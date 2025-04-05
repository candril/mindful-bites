import { FC, ReactNode, useEffect, useRef, useState } from "react";
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

  if (!isVisible) return null;

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
          transition: "transform 0.3s ease-out",
        }}
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
