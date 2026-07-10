'use client';

import { useEffect, useState } from 'react';

const RECENTLY_VIEWED_KEY = 'course_platform_recently_viewed';
const MAX_RECENT = 10;

export interface RecentCourse {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  price: number;
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentCourse[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        setRecentlyViewed([]);
      }
    }
  }, []);

  const addRecentlyViewed = (course: RecentCourse) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((c) => c._id !== course._id);
      const updated = [course, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { recentlyViewed, addRecentlyViewed };
}
