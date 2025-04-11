import { Flame, Star } from 'lucide-react'

const Header = () => {
  return (
    <header className="flex items-center justify-between p-5 pt-7">
        
        <div className="flex items-center">
          <Flame className="w-9 h-9 text-orange-500 fill-orange-500 mr-1" />
          <span className="font-bold text-2xl text-orange-500">64</span>
        </div>
        <div className="flex items-center">
          <img src="/twarz.png" alt="Pocked Logo" className="h-8 mr-1" />
          <span className="font-bold text-blue-400 text-3xl">Pocked</span>
        </div>
        <div className="flex items-center">
          <Star className="w-9 h-9 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="font-bold text-2xl text-yellow-500">17k</span>
        </div>
      </header>
  )
}

export default Header