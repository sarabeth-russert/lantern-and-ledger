'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                       w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#161210',
              border: '1px solid rgba(242,232,213,0.10)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            }}
          >
            {title && (
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(242,232,213,0.08)' }}
              >
                <h3 className="font-serif text-lg" style={{ color: '#f2e8d5' }}>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-sm"
                  style={{ color: 'rgba(242,232,213,0.35)' }}
                >
                  ✕
                </button>
              </div>
            )}
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
