interface IFilterContext {
  textFilters: Record<string, string>;
  registerFilter: (key: string, value: string) => void;
  unregisterFilter: (key: string) => void;
  updateTextFilter: (key: string, value: string) => void;
}
