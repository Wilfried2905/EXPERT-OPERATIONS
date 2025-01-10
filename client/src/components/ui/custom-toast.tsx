import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose?: () => void;
}

export const CustomToast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center w-auto min-w-[256px] p-4 rounded-lg shadow-lg",
        type === 'success' ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
      )}
    >
      <div className="flex-1 text-sm font-normal">
        {message}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-2 hover:opacity-70 rounded-lg focus:outline-none"
      >
        <X size={16} />
      </button>
    </div>
  );
};
