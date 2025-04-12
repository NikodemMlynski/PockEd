import { useAuth } from '@/context/AuthProvider'
import { Loader2 } from 'lucide-react';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const {user, isLoading} = useAuth();

    if(isLoading) return <Loader2/>

    return user ? <Outlet/> : <Navigate to="/signin" replace/>
}

export default ProtectedRoute