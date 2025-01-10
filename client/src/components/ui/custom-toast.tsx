import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface CustomToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const CustomToast: React.FC<CustomToastProps> = ({
  message,
  type = 'success',
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center w-auto min-w-[256px] p-4 rounded-lg shadow-lg border ${bgColor} ${textColor} ${borderColor}`}>
      <div className="flex-1 text-sm font-normal">
        {message}
      </div>
      <button
        onClick={onClose}
        className="ml-2 p-1 hover:bg-white/20 rounded-lg focus:outline-none"
      >
        <X size={16} />
      </button>
    </div>
  );
};