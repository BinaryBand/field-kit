import React, { ReactElement } from 'react';
import { useDebounce } from 'use-debounce';
import AppContext from '@providers/AppContext';

function App({ children, root }: IAppProps): ReactElement {
  const [scrollHeight, setScrollHeight] = React.useState<number>(0);
  const [scrollWidth, setScrollWidth] = React.useState<number>(0);
  const [currentPageWidth, setPageWidth] = React.useState<number>(0);
  const [currentPageHeight, setPageHeight] = React.useState<number>(0);

  const [pageWidth] = useDebounce(currentPageWidth, 125);
  const [pageHeight] = useDebounce(currentPageHeight, 125);

  function handleResize(): void {
    setPageWidth(window.innerWidth);
    setPageHeight(window.innerHeight);
  }

  function handleScroll(): void {
    setScrollHeight(window.scrollY);
    setScrollWidth(window.scrollX);
  }

  React.useEffect((): (() => void) => {
    handleResize();
    handleScroll();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return (): void => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <AppContext.Provider
      children={children}
      value={{ root, scrollHeight, scrollWidth, pageWidth, pageHeight }}
    />
  );
}

export default App;
