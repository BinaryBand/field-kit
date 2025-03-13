interface IOverloadedWrapperProps<T extends keyof HTMLElementTagNameMap> {
  component: T | React.ComponentType<React.ComponentProps<T>>;
  container: HTMLElementTagNameMap[T];
}

interface IOverloadedInputWrapperProps<T extends keyof HTMLElementTagNameMap> {
  component: T | React.ComponentType<React.ComponentProps<T>>;
  container: HTMLElementTagNameMap[T];
}

interface IWrapperProps<T extends keyof HTMLElementTagNameMap> {
  component: React.ComponentType<React.ComponentProps<T>>;
  container: HTMLElementTagNameMap[T];
}

type WrapperProps<T extends keyof HTMLElementTagNameMap> = IWrapperProps<T> & React.ComponentProps<T>;
type OverloadedWrapperProps<T extends keyof HTMLElementTagNameMap> = IWrapperProps<T> & React.ComponentProps<T>;
type OverloadedInputWrapperProps<T extends "input" | "select" | "textarea"> = IOverloadedInputWrapperProps<T> &
  ComponentProps<T>;
