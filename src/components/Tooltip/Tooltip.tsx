import React from 'react';
import { Portal } from '../Portal';

interface TooltipProps {
  children: React.ReactNode;
  title: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  followCursor?: boolean;
  arrow?: boolean;
  open?: boolean;
  onOpen?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onClose?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  title,
  placement = 'bottom',
  followCursor = false,
  arrow = false,
  open: openProp,
  onOpen,
  onClose,
}) => {
  const [open, setOpen] = React.useState(openProp ? openProp : false);
  const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, left: 0 });
  const [currentPlacement, setCurrentPlacement] = React.useState(placement);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const childRef = React.useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (childRef.current && tooltipRef.current) {
      const { top, left, width, height } = childRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let newPlacement = currentPlacement;

      const placements = ['top', 'bottom', 'left', 'right'];
      const calculateTooltipPosition = (placement: string) => {
        switch (placement) {
          case 'top':
            return {
              top: top - tooltipHeight - 8,
              left: left + width / 2 - tooltipWidth / 2,
            };
          case 'bottom':
            return {
              top: top + height + 8,
              left: left + width / 2 - tooltipWidth / 2,
            };
          case 'left':
            return {
              top: top + height / 2 - tooltipHeight / 2,
              left: left - tooltipWidth - 8,
            };
          case 'right':
            return {
              top: top + height / 2 - tooltipHeight / 2,
              left: left + width + 8,
            };
          default:
            return {
              top: top + height + 8,
              left: left + width / 2 - tooltipWidth / 2,
            };
        }
      };

      const isTooltipOutOfViewport = (position: { top: number; left: number }) => {
        return (
          position.top < 0 ||
          position.left < 0 ||
          position.top + tooltipHeight > viewportHeight ||
          position.left + tooltipWidth > viewportWidth
        );
      };

      let position = calculateTooltipPosition(currentPlacement);
      if (isTooltipOutOfViewport(position)) {
        for (let i = 0; i < placements.length; i++) {
          position = calculateTooltipPosition(placements[i]);
          if (!isTooltipOutOfViewport(position)) {
            newPlacement = placements[i] as typeof currentPlacement;
            break;
          }
        }
      }

      setTooltipPosition(position);
      setCurrentPlacement(newPlacement);
    }
  };

  const handleMouseOver = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setOpen(true);
    if (onOpen) onOpen(event);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setOpen(false);
    if (onClose) onClose(event);
  };

  React.useEffect(() => {
    if (followCursor) {
      const handleMouseMove = (event: MouseEvent) => {
        const tooltipTop = event.clientY + 8;
        const tooltipLeft = event.clientX + 8;
        setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
      };

      document.addEventListener('mousemove', handleMouseMove);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
    return undefined;
  }, [followCursor]);

  React.useEffect(() => {
    if (open) {
      calculatePosition();
    }
  }, [open, currentPlacement]);

  return (
    <div
      className="relative inline-block"
      ref={childRef}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {open && (
        <Portal>
          <div
            className="fixed z-10 p-2 bg-[#223354]/95 text-white text-sm rounded-lg shadow-lg"
            style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
            ref={tooltipRef}
          >
            {title}
            {arrow && (
              <div
                className={`absolute w-2 h-2 to-[#223354]/95 to-50% transform rotate-45 ${
                  currentPlacement === 'top'
                    ? 'bottom-[-4px] left-1/2 -translate-x-1/2 bg-gradient-to-br from-transparent from-50%'
                    : currentPlacement === 'bottom'
                    ? 'top-[-4px] left-1/2 -translate-x-1/2 bg-gradient-to-tl from-transparent from-50%'
                    : currentPlacement === 'left'
                    ? 'right-[-4px] top-1/2 -translate-y-1/2 bg-gradient-to-tr from-transparent from-50%'
                    : 'left-[-4px] top-1/2 -translate-y-1/2 bg-gradient-to-bl from-transparent from-50%'
                }`}
                style={{ zIndex: -1 }}
              />
            )}
          </div>
        </Portal>
      )}
    </div>
  );
};
