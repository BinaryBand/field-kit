import React, { ReactElement } from 'react';
import { useDebounce } from 'use-debounce';
import AppContext from '@providers/AppContext';

export type AppProps = {
  children?: React.ReactNode;
  root: HTMLElement;
};

function App({ children, root }: AppProps): ReactElement {
  const [_updateTrigger, setUpdateTrigger] = React.useState<number>(0);

  const [_pageWidth, setPageWidth] = React.useState<number>(0);
  const [_pageHeight, setPageHeight] = React.useState<number>(0);

  const [updateTrigger] = useDebounce(_updateTrigger, 250);
  const [pageWidth] = useDebounce(_pageWidth, 125);
  const [pageHeight] = useDebounce(_pageHeight, 125);

  const bodyObserver: MutationObserver = React.useMemo(
    () =>
      new MutationObserver((muts: MutationRecord[]) => {
        muts.forEach((mut) => root.dispatchEvent(new Event(mut.type)));
      }),
    [root]
  );

  function handleResize(): void {
    setPageWidth(window.innerWidth);
    setPageHeight(window.innerHeight);
  }

  // The single event handler for our custom 'mutation' event
  function handleUpdate(): void {
    setUpdateTrigger((prev) => prev + 1);
  }

  React.useEffect((): (() => void) | undefined => {
    if (typeof window !== 'undefined') {
      handleResize();

      window.addEventListener('resize', handleResize);

      return (): void => {
        window.removeEventListener('resize', handleResize);
      };
    }
    return;
  }, []);

  React.useEffect((): (() => void) => {
    bodyObserver.observe(document.body, { attributes: true, childList: true, subtree: true });

    // Listen for the single, custom 'mutation' event
    root.addEventListener('mutation', handleUpdate);

    return (): void => {
      root.removeEventListener('mutation', handleUpdate);
      bodyObserver.disconnect();
    };
  }, [bodyObserver, root]);

  return (
    <AppContext.Provider
      children={children}
      value={{ root, updateTrigger, pageWidth, pageHeight }}
    />
  );
}

export default App;
