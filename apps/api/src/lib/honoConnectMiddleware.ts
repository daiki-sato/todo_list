import type { JsonValue } from "@bufbuild/protobuf";
import { Code, ConnectError, createConnectRouter } from "@connectrpc/connect";
import {
  type ConnectNodeAdapterOptions,
  universalRequestFromNodeRequest,
  universalResponseToNodeResponse,
} from "@connectrpc/connect-node";
import type { UniversalHandler } from "@connectrpc/connect/protocol";
import type { HttpBindings } from "@hono/node-server";
import { RESPONSE_ALREADY_SENT } from "@hono/node-server/utils/response";
import type { MiddlewareHandler } from "hono";

/**
 * based on expressConnectMiddleware
 * @see  https://github.com/connectrpc/connect-es/blob/v1.4.0/packages/connect-express/src/express-connect-middleware.ts
 */
export function honoConnectMiddleware({
  requestPathPrefix,
  contextValues,
  routes,
  ...options
}: Omit<ConnectNodeAdapterOptions, "fallback">): MiddlewareHandler<{
  Bindings: HttpBindings;
}> {
  const router = createConnectRouter(options);
  routes(router);

  const prefix = requestPathPrefix ?? "";
  const paths = new Map<string, UniversalHandler>();
  for (const uHandler of router.handlers) {
    paths.set(prefix + uHandler.requestPath, uHandler);
  }

  return async (c, next) => {
    const uHandler = paths.get(c.env.incoming.url?.split("?", 2)[0] ?? "");
    if (!uHandler) {
      return next();
    }

    const uReq = universalRequestFromNodeRequest(
      c.env.incoming,
      c.req.raw.body as JsonValue | undefined,
      contextValues?.(c.env.incoming),
    );
    try {
      const uRes = await uHandler(uReq);
      await universalResponseToNodeResponse(uRes, c.env.outgoing);
    } catch (reason) {
      if (ConnectError.from(reason).code === Code.Aborted) {
        return;
      }
      // eslint-disable-next-line no-console
      console.error(
        `handler for rpc ${uHandler.method.name} of ${uHandler.service.typeName} failed`,
        reason,
      );
    }
    return RESPONSE_ALREADY_SENT;
  };
}
