'use client';

import { useCallback } from 'react';
import { toast } from 'react-toastify';

export default function useToast() {
  const toastSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const toastError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const toastInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  const toastWarning = useCallback((message: string) => {
    toast.warning(message);
  }, []);

  return { toastSuccess, toastError, toastInfo, toastWarning };
}