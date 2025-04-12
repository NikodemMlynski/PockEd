import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useStreak } from './context/StreakContext';

const notes = [
  "Funkcja kwadratowa to równanie postaci: f(x) = ax² + bx + c. Jej wykresem jest parabola. Występuje ona w wielu zadaniach z matematyki i życia codziennego. Nauczysz się, jak ją rozpoznawać, rysować i rozwiązywać związane z nią problemy.",
  "Parabola to krzywa, która ma kształt litery U. Jej ramiona są symetryczne względem osi symetrii. Wierzchołek paraboli to punkt, w którym parabola osiąga minimum lub maksimum.",
  "Współczynnik 'a' w równaniu kwadratowym decyduje o kształcie paraboli. Jeśli 'a' jest dodatnie, parabola jest skierowana w górę. Jeśli 'a' jest ujemne, parabola jest skierowana w dół.",
  "Miejsca zerowe funkcji kwadratowej to punkty, w których parabola przecina oś x. Można je obliczyć za pomocą wzoru kwadratowego.",
  "Funkcję kwadratową można przedstawić w postaci kanonicznej: f(x) = a(x - p)² + q. Wierzchołek paraboli ma współrzędne (p, q).",
];

const NoteDisplay: React.FC = () => {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [streakUpdated, setStreakUpdated] = useState(false); // Dodaj stan

  const { incrementStreak, updateExp } = useStreak();

  const handleNextNote = () => {
    setCurrentNoteIndex((prevIndex) => {
      if (prevIndex === notes.length - 1 && !streakUpdated) {
        incrementStreak();
        updateExp(435);
        setStreakUpdated(true); // Ustaw stan na true
      }
      return Math.min(prevIndex + 1, notes.length - 1);
    });
  };

  const handlePrevNote = () => {
    setCurrentNoteIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  useEffect(() => {
    if (currentNoteIndex === notes.length - 1 && !streakUpdated) {
      incrementStreak();
      updateExp(435);
      setStreakUpdated(true); // Ustaw stan na true
    }
  }, [currentNoteIndex, incrementStreak, updateExp, streakUpdated]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Link to="/" className="w-[70%] text-sm mb-2 text-gray-500">
        Powrót
      </Link>
      <div className="w-[85%] bg-green-400 text-white p-4 rounded-lg mb-4">
        <h2 className="text-2xl font-bold text-center">Funkcja kwadratowa</h2>
        <p className="text-center">Plan nauki: Do 14.04.25r.</p>
      </div>
      <div className="relative w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <span className="absolute top-3 right-3 text-md text-sm text-gray-500">
          {currentNoteIndex + 1}/{notes.length}
        </span>
        <div className="relative p-4 rounded-lg mb-4">
          <p className="text-gray-800">{notes[currentNoteIndex]}</p>
        </div>
        <div className="flex justify-between mb-4">
          <Button onClick={handlePrevNote} disabled={currentNoteIndex === 0} className="cursor-pointer bg-blue-500 hover:bg-blue-600">
            Poprzedni
          </Button>
          <Button onClick={handleNextNote} disabled={currentNoteIndex === notes.length - 1} className="cursor-pointer bg-blue-500 hover:bg-blue-600">
            Następny
          </Button>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-lg">Plan nauki: do 12.02.25r.</p>
          <p className="text-md">
            <span>✅ Dotrzyj do slajdu 10</span>
            <span className="ml-2 text-blue-400 font-bold">⭐- 10 XP</span>
          </p>
          <p className="text-md">
            <span>✅ Wykonaj 5 zadań</span>
            <span className="ml-2 text-blue-400 font-bold">⭐- 40 XP</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteDisplay;