export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Assertion failed');
  }
}

export function createRandomKey(): string {
  return crypto.randomUUID();
}

export function tryParse<T extends object = object>(value: unknown): T | undefined {
  try {
    return JSON.parse(`${value}`) as T;
  } catch {
    return undefined;
  }
}
