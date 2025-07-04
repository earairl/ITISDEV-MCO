/* 
HOW TO USE:

import { useToast } from '@/components/ui/Toaster'

const { showToast } = useToast()

// Pass parameters here, no need to pass everything everytime (default values below):
showToast({
		title: '',
		description: 'This is a toast',
		duration: 4000,
          })
*/


import * as RadixToast from "@radix-ui/react-toast"
import { createContext, useContext, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { motion, AnimatePresence } from 'motion/react'

import styles from "./Toaster.module.css"

const ToastContext = createContext();

export function Toaster({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ title = '', description = 'This is a toast', duration = 4000 }) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, title, description, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
        <RadixToast.Provider swipeDirection={null}>
            {children}
            <AnimatePresence>
                {toasts.map((toast) => (
                    <RadixToast.Root
                        key={toast.id}
                        duration={toast.duration}
                        open
                        onOpenChange={(open) => {
                        if (!open) removeToast(toast.id);
                        }}
                    >
                        <motion.div 
                            className={styles.toast}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <RadixToast.Title className={styles.toastTitle}>{toast.title}</RadixToast.Title>
                            <RadixToast.Description className={styles.toastBody}>
                                {toast.description}
                            </RadixToast.Description>
                            <RadixToast.Close className={styles.closeBtn}>
                                <span className='material-symbols-outlined'>
                                    close
                                </span>
                            </RadixToast.Close>                        
                        </motion.div>
                    </RadixToast.Root>
                ))}
            </AnimatePresence>
            <RadixToast.Viewport className={styles.toastWrap} />
        </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  return useContext(ToastContext);
};