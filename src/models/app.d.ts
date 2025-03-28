interface IAppContext {
  root: HTMLElement;
  scrollHeight: number;
  scrollWidth: number;
  pageWidth: number;
  pageHeight: number;
}

interface IAppProps {
  children: React.ReactNode;
  root: HTMLElement;
}
