'use client';

import { useEffect } from 'react';
import { usePageTitle } from '@/context/PageTitleContext';

export function useSetPageTitle(title: string) {
  const { setTitle } = usePageTitle();
  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
}
