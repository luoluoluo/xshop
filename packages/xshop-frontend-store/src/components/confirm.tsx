"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";

import React, { createContext, useContext, useState } from "react";

interface ConfirmState {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  openConfirm: (message: string) => Promise<boolean>;
  closeConfirm: () => void;
}

const ConfirmContext = createContext<ConfirmState>({
  open: false,
  message: "",
  onConfirm: () => {},
  onCancel: () => {},
  openConfirm: () => Promise.resolve(false),
  closeConfirm: () => {},
});

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [promiseResolve, setPromiseResolve] =
    useState<(value: boolean) => void>();

  const openConfirm = async (message: string): Promise<boolean> => {
    setMessage(message);
    setOpen(true);
    const promise = new Promise<boolean>((resolve) => {
      setPromiseResolve(() => resolve);
    });
    return promise;
  };

  const closeConfirm = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    promiseResolve?.(true);
    closeConfirm();
  };

  const handleCancel = () => {
    promiseResolve?.(false);
    closeConfirm();
  };

  return (
    <ConfirmContext.Provider
      value={{
        open,
        message,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
        openConfirm,
        closeConfirm,
      }}
    >
      {children}
      <ConfirmDialog />
    </ConfirmContext.Provider>
  );
};

const ConfirmDialog: React.FC = () => {
  const { open, message, onConfirm, onCancel, closeConfirm } = useConfirm();

  return (
    open && (
      <AlertDialog open={open} onOpenChange={closeConfirm}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{message}</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                onConfirm();
              }}
            >
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
};
