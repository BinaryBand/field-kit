interface IFilterContext {
  textFilters: Record<string, string>;
  registerFilter: (key: string, value: string) => void;
  unregisterFilter: (key: string) => void;
  updateTextFilter: (key: string, value: string) => void;
}

interface ISelectInputContext {
  options: Record<string, React.ReactNode>;
  addOption: (key: string, value: React.ReactNode) => void;
}
