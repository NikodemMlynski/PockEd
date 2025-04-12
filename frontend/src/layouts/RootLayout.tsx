import { NavLink, Outlet } from 'react-router-dom'
import { Home, User, Bell, Settings, Users } from 'lucide-react'
import Header from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import { StreakProvider } from '@/context/StreakContext'

const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen justify-between bg-gray-100">
        <Header/>
      <div className="p-4 overflow-y-auto flex-1">
        <Outlet />
      </div>
      <Navigation />
    </div>
  )
}


export default RootLayout
