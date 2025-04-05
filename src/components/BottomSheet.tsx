import { FC, ReactNode, useEffect, useRef, useState, TouchEvent } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: ReactNode;
}

export const BottomSheet: FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const startTransition = async () => {
        if (!document.startViewTransition) {
          setIsVisible(true);
          return;
        }

        await document.startViewTransition(() => {
          setIsVisible(true);
        }).finished;
      };
      startTransition();
    } else {
      document.body.style.overflow = "";
      const endTransition = async () => {
        if (!document.startViewTransition) {
          setIsVisible(false);
          return;
        }

        await document.startViewTransition(() => {
          setIsVisible(false);
        }).finished;
      };
      endTransition();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleTouchStart = (e: TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (startY === null) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 0) {
      setCurrentY(diff);
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (currentY && currentY > 150) {
      onClose();
    }
    setStartY(null);
    setCurrentY(null);
    setIsDragging(false);
  };

  if (!isVisible) return null;

  const transform = currentY ? `translateY(${currentY}px)` : "";
  const transition = isDragging ? "" : "transform 0.3s ease-out";

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm overlay-enter"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      />
      <div
        className="fixed z-50 bg-white shadow-2xl sheet-enter
          sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg sm:rounded-2xl
          inset-x-0 bottom-0 rounded-t-[32px] sm:bottom-auto"
        ref={sheetRef}
        style={{
          transform: `${transform} ${isDragging ? "" : "sm:none"}`,
          transition,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute left-0 right-0 top-0 z-30 mx-auto h-1 w-12 -translate-y-1/2 rounded-full bg-gray-3 sm:hidden" />
        <div className="flex p-4">
          <h2 className="flex-1 text-2xl">{title}</h2>
          <button
            onClick={onClose}
            className="flex-initial p-2 text-gray-5 hover:text-gray-7"
          >
            <X className="size-6" />
          </button>
        </div>
        <div className="max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto px-4 pb-8 pt-8">
          {children}
        </div>
      </div>
    </>
  );
};
