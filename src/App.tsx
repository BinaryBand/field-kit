import React, { ReactElement } from 'react';
import AppContext from '@providers/AppContext';

function App({ children, root }: IAppProps): ReactElement {
  const [scrollHeight, setScrollHeight] = React.useState<number>(0);
  const [scrollWidth, setScrollWidth] = React.useState<number>(0);
  const [pageWidth, setPageWidth] = React.useState<number>(0);
  const [pageHeight, setPageHeight] = React.useState<number>(0);

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
