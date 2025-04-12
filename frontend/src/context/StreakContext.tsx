import React, { createContext, useState, useEffect, useContext } from 'react';

interface StreakContextType {
  streak: number;
  incrementStreak: () => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const StreakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streak, setStreak] = useState<number>(() => {
    const storedStreak = localStorage.getItem('streak');
    return storedStreak ? parseInt(storedStreak, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('streak', streak.toString());
  }, [streak]);

  const incrementStreak = () => {
    console.log('incrementStreak wywołane');
    setStreak((prevStreak) => {
      if (prevStreak === 0) {
        return 1;
      }
      return prevStreak;
    });
  };

  return (
    <StreakContext.Provider value={{ streak, incrementStreak }}>
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