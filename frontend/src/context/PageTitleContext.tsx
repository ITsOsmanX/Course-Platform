'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PageTitleContextType {
  title: string;
  setTitle: (t: string) => void;
}

const PageTitleContext = createContext<PageTitleContextType>({
  title: 'Dashboard',
  setTitle: () => {},
});

export const PageTitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState('Dashboard');
  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = () => useContext(PageTitleContext);
