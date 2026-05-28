import { createContext, useContext, useMemo, useState } from "react";
import { FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const notify = (message, type = "success") => {
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, type }]);
    setTimeout(() => setToasts((items) => items.filter((toast) => toast.id !== id)), 3600);
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-3">
        {toasts.map((toast) => {
          const Icon = toast.type === "error" ? FiInfo : FiCheckCircle;
          return (
            <div key={toast.id} className={`toast ${toast.type === "error" ? "toast-error" : ""}`}>
              <Icon className="h-4 w-4" />
              <span>{toast.message}</span>
              <button onClick={() => setToasts((items) => items.filter((item) => item.id !== toast.id))}>
                <FiX className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
