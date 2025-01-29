"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export default function ConfirmationAlert({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
}: ConfirmationAlertProps) {
  const [timeLeft, setTimeLeft] = useState<number>(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setTimeLeft(5);
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="mb-4">{message}</p>
        <p className="mb-4 text-sm text-gray-600">
          After 5secs this operation will cancelled
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            {cancelButtonText} {timeLeft}s
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
