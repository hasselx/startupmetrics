import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sml_saved_metrics';

export const useSavedMetrics = () => {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSave = (id: string) => {
    setSavedIds(prev =>
      prev.includes(id)
        ? prev.filter(savedId => savedId !== id)
        : [...prev, id]
    );
  };

  return { savedIds, isSaved, toggleSave };
};
