import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

function Portal<E extends HTMLElement>({ children, container }: BasePortalProps<E>): ReactNode {
  return container ? ReactDOM.createPortal(children, container) : children;
}

export default Portal;
