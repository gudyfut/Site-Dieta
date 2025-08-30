// pages/logout.tsx
"use client";

import { useEffect } from 'react';
import { deleteSessionToken } from '@/back/utils/auth';

export default function Logout() {
   // const router = useRouter();

   /* useEffect(() => {
        const handleLogout = async () => {
            await deleteSessionToken();
            router.push('/login'); // Redireciona para a página de login
        };
        handleLogout();
    }, [router]);*/

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-xl">Deslogando...</p>
        </div>
    );
}
