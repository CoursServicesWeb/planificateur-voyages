import React, { createContext, useContext, useState, useCallback } from 'react';
 

const ErrContext = createContext<ErrContextType | null>(null);

export const ErrProvider = ({ children } : { children:React.ReactNode }) => {
  const [errCode, setErrCode] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');
  const [showErrModal, setShowErrModal] = useState(false);

  const addError = useCallback((message :string, code : string) => {
    setErrMsg(message);
    setErrCode(code);
    setShowErrModal(true);
  }, []);

  const clearError = useCallback(() => {
    setShowErrModal(false);
  }, []);

  const value = { errCode, errMsg, showErrModal, addError, clearError };

  return (
    <ErrContext.Provider value={value}>
      {children}
    </ErrContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrContext);
  
  if (!context) {
    throw new Error('useError doit être utilisé dans ErrProvider');
  }
  
  return context;
};

interface ErrContextType {
  errMsg : string;
  errCode : string;
  showErrModal : boolean;
  addError: (message: string, code : string) => void;
  clearError: () => void;
}