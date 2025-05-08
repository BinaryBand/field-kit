interface IAppContext {
  root: HTMLElement;
  updateTrigger: number;
  scrollHeight: number;
  scrollWidth: number;
  pageWidth: number;
  pageHeight: number;
}

interface IAppProps {
  children: React.ReactNode;
  root: HTMLElement;
}
