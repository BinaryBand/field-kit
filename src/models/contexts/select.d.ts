interface ISelectInputContext {
  options: Record<string, React.ReactNode>;
  addOption: (key: string, value: React.ReactNode) => void;
}
