import { type HttpBindings, serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createSchema, createYoga } from "graphql-yoga";
import { cors } from "hono/cors";
import { routes as connectRoutes } from "./connect/routes";
import { resolvers } from "./graphql/resolvers.generated";
import { typeDefs } from "./graphql/typeDefs.generated";
import { tasksRoutes as honoTasksRoutes } from "./hono/routes";
import { honoConnectMiddleware } from "./lib/honoConnectMiddleware";
import { tasksRoutes as restTasksRoutes } from "./rest/routes";

const app = new OpenAPIHono<{ Bindings: HttpBindings }>();

app.use("/*", cors());

// Register Connect routes
app.use(
  honoConnectMiddleware({
    requestPathPrefix: "/connect",
    routes: connectRoutes,
    interceptors: [
      (next) => async (req) => {
        try {
          return await next(req);
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
    ],
  }),
);

// Register REST API routes
app.doc("/rest/openapi", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Task app",
  },
});
app.route("/rest/tasks", restTasksRoutes);

// Register Hono RPC routes
const honoRpcRoutes = app.route("/hono/tasks", honoTasksRoutes);
export type HonoAppType = typeof honoRpcRoutes;

// Register GraphQL routes
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  landingPage: false,
  graphqlEndpoint: "/",
});
app.mount("/graphql", yoga);

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
