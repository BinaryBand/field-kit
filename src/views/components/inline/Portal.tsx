import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

function Portal<E extends HTMLElement>({ children, container }: BasePortalProps<E>): ReactNode {
  if (!container) return children;
  return ReactDOM.createPortal(children, container);
}

export default Portal;
