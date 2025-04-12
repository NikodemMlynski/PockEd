import React, { createContext, useState, useEffect, useContext } from 'react';

interface StreakContextType {
  streak: number;
  exp: number;
  incrementStreak: () => void;
  updateExp: (newExp: number) => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const StreakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streak, setStreak] = useState<number>(() => {
    const storedStreak = localStorage.getItem('streak');
    return storedStreak ? parseInt(storedStreak, 10) : 0;
  });

  const [exp, setExp] = useState<number>(() => {
    const storedExp = localStorage.getItem('exp');
    return storedExp ? parseInt(storedExp, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('streak', streak.toString());
    localStorage.setItem('exp', exp.toString());
  }, [streak, exp]);

  const incrementStreak = () => {
    setStreak((prevStreak) => prevStreak + 1);
  };

  const updateExp = (newExp: number) => {
    setExp(newExp);
  };

  return (
    <StreakContext.Provider value={{ streak, exp, incrementStreak, updateExp }}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
};