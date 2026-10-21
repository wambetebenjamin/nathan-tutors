/**
 * Small persistence helper.
 * Uses Vercel KV when KV_REST_API_URL and KV_REST_API_TOKEN are present,
 * and falls back to an in-process store so the site stays fully usable in
 * preview and local development.
 */

type KvClient = {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown) => Promise<unknown>;
};

const memory = new Map<string, unknown>();

let clientPromise: Promise<KvClient | null> | null = null;

async function getClient(): Promise<KvClient | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  if (!clientPromise) {
    clientPromise = import("@vercel/kv")
      .then((mod) => {
        const kv = (mod as unknown as { kv: KvClient }).kv;
        return kv ?? null;
      })
      .catch(() => null);
  }

  return clientPromise;
}

export async function storeGet<T>(key: string): Promise<T | null> {
  try {
    const client = await getClient();
    if (client) {
      const value = await client.get<T>(key);
      return value ?? null;
    }
  } catch {
    // fall through to the in-process store
  }
  return (memory.get(key) as T | undefined) ?? null;
}

export async function storeSet<T>(key: string, value: T): Promise<void> {
  memory.set(key, value);
  try {
    const client = await getClient();
    if (client) {
      await client.set(key, value);
    }
  } catch {
    // the in-process copy already holds the value
  }
}

export async function storeAppend<T>(key: string, value: T): Promise<T[]> {
  const current = (await storeGet<T[]>(key)) ?? [];
  const next = [value, ...current];
  await storeSet(key, next);
  return next;
}

export function memorySnapshot(key: string): unknown {
  return memory.get(key) ?? null;
}
