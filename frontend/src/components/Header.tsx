import { useStreak } from '@/context/StreakContext';
import { Flame, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const Header = () => {
  const { streak, exp } = useStreak();
  const [localStreak, setLocalStreak] = useState(streak);

  useEffect(() => {
    setLocalStreak(streak);
  }, [streak]);

  return (
    <header className="flex items-center justify-between p-5 pt-7">
      {localStreak === 1 ? (
        <div className="flex items-center">
          <Flame className="w-9 h-9 text-orange-500 fill-orange-500 mr-1" />
          <span className="font-bold text-2xl text-orange-500">{localStreak}</span>
        </div>
      ) : (
        <div className="flex items-center">
          <Flame className="w-9 h-9 text-gray-500 mr-1" />
          <span className="font-bold text-2xl text-orange-500">{localStreak}</span>
        </div>
      )}

      <div className="flex items-center">
        <img src="/twarz.png" alt="Pocked Logo" className="h-8 mr-1" />
        <span className="font-bold text-blue-400 text-3xl">Pocked</span>
      </div>
      <div className="flex items-center">
        <Star className="w-9 h-9 text-yellow-500 fill-yellow-500 mr-1" />
        <span className="font-bold text-2xl text-yellow-500">{exp}</span>
      </div>
    </header>
  );
};

export default Header;