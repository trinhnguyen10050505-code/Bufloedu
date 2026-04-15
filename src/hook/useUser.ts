import { useState, useEffect } from "react";

export function useUser() {
  const [level, setLevel] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("level");
    if (saved) setLevel(saved);
  }, []);

  const updateLevel = (newLevel: string) => {
    localStorage.setItem("level", newLevel);
    setLevel(newLevel);
  };

  return { level, updateLevel };
}