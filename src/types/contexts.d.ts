interface IAppContext {
  root: HTMLElement;
  updateTrigger: number;
  pageWidth: number;
  pageHeight: number;
}

interface IFilterContext {
  textFilters: Record<string, string>;
  registerFilter: (key: string, value: string) => void;
  unregisterFilter: (key: string) => void;
  updateTextFilter: (key: string, value: string) => void;
}

interface IGroupedInputContext {
  options: Record<string, Record<string, React.ReactNode>>;
  addOption: (key: string, value: React.ReactNode, group?: string) => void;
}
