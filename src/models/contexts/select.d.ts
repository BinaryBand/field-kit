interface ISelectInputContext {
  options: Record<string, ReactNode>;
  addOption: (key: string, value: ReactNode) => void;
}
