import React from 'react'
import PersonalityForm from './PersonalityForm'
import { Button } from '@/components/ui/button' // użyj swojego systemu buttonów
import { useAuth } from '@/context/AuthProvider'

const Settings = () => {
    const {logout} = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      {/* Nagłówek */}
      <div className="bg-gray-100 rounded-2xl p-6 mb-10 shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ustawienia profilu</h1>
          <p className="text-gray-500 mt-1">Zaktualizuj swoje preferencje i dane osobowości.</p>
        </div>
        <Button
          onClick={handleLogout}
          className="cursor-pointer text-lg py-6 bg-black text-white hover:bg-gray-800"
        >
          Wyloguj się
        </Button>
      </div>

      {/* Formularz */}
      <PersonalityForm />
    </div>
  )
}

export default Settings;
