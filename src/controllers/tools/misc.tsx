export function assert(condition: boolean, message?: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

export function createRandomKey(): string {
  return Math.random().toString(36);
}

export function tryParse<T extends object = object>(value: unknown): T | undefined {
  try {
    return JSON.parse(`${value}`) as T;
  } catch {
    return undefined;
  }
}
