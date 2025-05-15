import React, { ReactElement } from 'react';
import { useDebounce } from 'use-debounce';
import AppContext from '@providers/AppContext';

// import PasskeyInput from '@components/PasskeyInput';

function App({ children, root }: IAppProps): ReactElement {
  const [_updateTrigger, setUpdateTrigger] = React.useState<number>(0);

  const [scrollWidth, setScrollWidth] = React.useState<number>(0);
  const [scrollHeight, setScrollHeight] = React.useState<number>(0);
  const [_pageWidth, setPageWidth] = React.useState<number>(0);
  const [_pageHeight, setPageHeight] = React.useState<number>(0);

  const [updateTrigger] = useDebounce(_updateTrigger, 250);
  const [pageWidth] = useDebounce(_pageWidth, 125);
  const [pageHeight] = useDebounce(_pageHeight, 125);

  const bodyObserver: MutationObserver = React.useMemo(
    () =>
      new MutationObserver((muts: MutationRecord[]) => {
        muts.map((mut) => mut.type).forEach((type) => root.dispatchEvent(new Event(type)));
      }),
    [root]
  );

  function handleResize(): void {
    setPageWidth(window.innerWidth);
    setPageHeight(window.innerHeight);
  }

  function handleScroll(): void {
    setScrollWidth(window.scrollX);
    setScrollHeight(window.scrollY);
  }

  function handleUpdate(): void {
    setUpdateTrigger((prev) => prev + 1);
  }

  React.useEffect((): (() => void) => {
    handleResize();
    handleScroll();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return (): void => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  React.useEffect((): (() => void) => {
    bodyObserver.observe(document.body, { attributes: true, childList: true, subtree: true });

    root.addEventListener('childList', handleUpdate);
    root.addEventListener('subtree', handleUpdate);
    root.addEventListener('attributes', handleUpdate);

    return (): void => {
      root.removeEventListener('childList', handleUpdate);
      root.removeEventListener('subtree', handleUpdate);
      root.removeEventListener('attributes', handleUpdate);
      bodyObserver.disconnect();
    };
  }, [bodyObserver, root]);

  return (
    <AppContext.Provider
      children={children}
      value={{ root, updateTrigger, scrollWidth, scrollHeight, pageWidth, pageHeight }}
    />
  );
}

export default App;
