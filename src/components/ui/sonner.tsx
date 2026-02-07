"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group"
      style={{ zIndex: 9999 }}
      toastOptions={{
        classNames: {
          toast: 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 shadow-lg',
          title: 'text-zinc-900 dark:text-zinc-100 font-medium',
          description: 'text-zinc-600 dark:text-zinc-400',
          success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
          info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        },
        style: { zIndex: 9999 },
      }}
      {...props}
    />
  );
};

export { Toaster };
