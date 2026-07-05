"use client";

import { create } from "zustand";

const SUCCESS_TOAST_DURATION_MS = 2400;
const WARNING_TOAST_DURATION_MS = 7000;

export type ToastVariant = "success" | "warning";

export type ToastItem = {
  id: number;
  variant: ToastVariant;
  title?: string;
  message: string;
  dismissible: boolean;
};

type ToastStore = {
  toasts: ToastItem[];
  showSuccessToast: (message: string) => void;
  showWarningToast: (title: string, message: string) => void;
  dismissToast: (id: number) => void;
};

let nextToastId = 1;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showSuccessToast: (message) => {
    const id = nextToastId++;

    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          variant: "success",
          message,
          dismissible: false,
        },
      ],
    }));

    window.setTimeout(() => {
      useToastStore.getState().dismissToast(id);
    }, SUCCESS_TOAST_DURATION_MS);
  },
  showWarningToast: (title, message) => {
    const id = nextToastId++;

    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          variant: "warning",
          title,
          message,
          dismissible: true,
        },
      ],
    }));

    window.setTimeout(() => {
      useToastStore.getState().dismissToast(id);
    }, WARNING_TOAST_DURATION_MS);
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

export function showWarningToast(title: string, message: string) {
  useToastStore.getState().showWarningToast(title, message);
}
