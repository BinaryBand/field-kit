export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Assertion failed');
  }
}

export function createRandomKey(): string {
  return Math.random().toString(36).slice(2);
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  let result = '';
  strings.forEach((str, i) => {
    result += str + (values[i] ?? '');
  });
  return result;
}

export function tryParse<T extends object = object>(value: unknown): T | undefined {
  try {
    return JSON.parse(`${value}`) as T;
  } catch {
    return undefined;
  }
}
