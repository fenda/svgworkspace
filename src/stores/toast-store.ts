"use client";

import { create } from "zustand";

const TOAST_DURATION_MS = 2400;

export type ToastItem = {
  id: number;
  message: string;
};

type ToastStore = {
  toasts: ToastItem[];
  showSuccessToast: (message: string) => void;
  dismissToast: (id: number) => void;
};

let nextToastId = 1;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showSuccessToast: (message) => {
    const id = nextToastId++;

    set((state) => ({
      toasts: [...state.toasts, { id, message }],
    }));

    window.setTimeout(() => {
      useToastStore.getState().dismissToast(id);
    }, TOAST_DURATION_MS);
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

export function showSuccessToast(message: string) {
  useToastStore.getState().showSuccessToast(message);
}
