import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Database, Task } from "./__generated__/proto/task/v1/task_pb";

export async function listTasks(): Promise<Task[]> {
  const db = await getDb();
  return db.tasks.toReversed().map((t) => new Task(t));
}

export async function updateTasks(
  update: (db: Database) => Promise<Database> | Database,
): Promise<Database> {
  const db = await getDb();

  try {
    locked = true;
    const newDb = await update(db);
    await mkdir(path.dirname(dbPath), { recursive: true });
    await writeFile(dbPath, newDb.toBinary());
    return db;
  } finally {
    locked = false;
  }
}

const dbPath = path.join(__dirname, "..", "tmp", "db.pb");

let locked = false;

class AlreadyLockedError extends Error {}

async function getDb(): Promise<Database> {
  if (locked) {
    throw new AlreadyLockedError("already locked");
  }

  let dbBin: Buffer;
  try {
    dbBin = await readFile(dbPath);
  } catch {
    return new Database();
  }

  return Database.fromBinary(dbBin);
}
