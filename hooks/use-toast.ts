"use client"

import { useState, useCallback } from 'react'

interface ToastState {
  open: boolean
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: '',
    description: '',
    variant: 'default',
  })

  const showToast = useCallback(({ title, description, variant = 'default' }: Omit<ToastState, 'open'>) => {
    setToast({
      open: true,
      title,
      description,
      variant,
    })

    setTimeout(() => {
      setToast(prev => ({ ...prev, open: false }))
    }, 3000)
  }, [])

  return {
    toast: showToast,
    toastState: toast,
  }
}