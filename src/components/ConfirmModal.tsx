import React from "react";
import { Button } from "./ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Do you really want to delete this event? This action cannot be undone.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">{message}</p>
        <div className="mt-6 flex justify-center space-x-4">
          <Button variant="outline" onClick={onClose}>
            No, Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
