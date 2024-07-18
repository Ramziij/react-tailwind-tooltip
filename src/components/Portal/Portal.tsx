import React from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
  children: React.ReactNode;
};

export const Portal: React.FC<PortalProps> = ({ children }) => {
  const elRef = React.useRef(document.createElement('div'));

  React.useEffect(() => {
    const el = elRef.current;
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  return createPortal(children, elRef.current);
};
