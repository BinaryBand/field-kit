interface IAppContext {
  root: HTMLElement;
}

interface IAppProps extends IAppContext {
  children: React.ReactNode;
}
