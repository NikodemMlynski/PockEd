import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthProvider';
import { Flame, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const {user} = useAuth();
  return (
    <div className="space-y-4">
      {/* Górny pasek z ikonami */}

      {/* Biały kafelek z powitaniem */}
      <Card className=" p-4 bg-white rounded-3xl shadow-xl border-none">
        <div className="text-2xl font-semibold">Cześć, {user?.username}</div>
        <div className="text-lg">Wybierz, co chcesz dzisiaj zrobić:</div>
      </Card>

      {/* Karty z treścią */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="planning">
        <Card className="bg-gradient-to-r from-sky-400 to-blue-500 from-green-400 to-teal-500 text-white pl-[20%]">
          <CardHeader>
            <CardTitle className="font-extrabold text-3xl ">Plany edukacyjne</CardTitle> 
            <CardDescription className='text-large font-semibold pl-1'>Rozplanuj swój czas na podstawie Twoich umiejętności i zarządzaj zadaniami.</CardDescription>
          </CardHeader>
        </Card>
        </Link>
        <Link to="flashcards">
        <Card className="bg-gradient-to-r  from-sky-400 to-blue-500   text-white pl-[20%]">
          <CardHeader>
            <CardTitle className="font-extrabold text-3xl">Fiszki</CardTitle>
            <CardDescription className='text-large font-semibold pl-1'>Sprytne zestawy do nauki generowane dla Ciebie przez Edko.</CardDescription>
          </CardHeader>
        </Card>
        </Link>
        <Link to="informations">
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500  text-white pl-[20%]">
          <CardHeader>
            <CardTitle className="font-extrabold text-3xl">Konkursy / Stypendia</CardTitle>
            <CardDescription className='text-large font-semibold pl-1'>Znajdź wydarzenia, nie przegap szansy, rozwijaj talenty, si zaj po więcej.</CardDescription>
          </CardHeader>
        </Card>
        </Link>
        <Link to="notes">
        <Card className="bg-gradient-to-r from-purple-400 to-pink-500 text-white pl-[20%]">
          <CardHeader>
            <CardTitle className="font-extrabold text-3xl">Tworzenie notatek</CardTitle>
            <CardDescription className='text-large font-semibold pl-1'>Utwórz pomocnicze notatki na podstawie Twoich materiałów edukacyjnych.</CardDescription>
          </CardHeader>
        </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;