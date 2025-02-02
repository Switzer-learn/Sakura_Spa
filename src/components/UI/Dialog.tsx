// dialog.tsx
import React from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  const handleClose = () => onOpenChange(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-lg z-10">
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

interface DialogHeaderProps {
  children: React.ReactNode;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return <div className="border-b pb-2 mb-4">{children}</div>;
};

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;  // <-- Added optional className
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className }) => {
  return <h2 className={`text-xl font-bold ${className || ""}`}>{children}</h2>;
};

interface DialogFooterProps {
  children: React.ReactNode;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ children }) => {
  return <div className="mt-4 flex justify-end space-x-2">{children}</div>;
};
