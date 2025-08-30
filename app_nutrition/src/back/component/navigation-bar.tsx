// components/NavBar.tsx
import { cookies } from 'next/headers';
import { isSessionValid, deleteSessionToken } from '@/back/utils/auth';
import Link from 'next/link';

export default async function Navbar() {
    // Verifica a sessão no servidor
    const sessionValid = await isSessionValid();  

    return (
        <header className="fixed top-0 right-0 p-4 w-full bg-gray-100 flex justify-end items-center shadow">            
            {sessionValid ? (                
                 <Link  href="/logout"  className="text-blue-500 hover:underline">Logout</Link>    
            ) : (
                <Link href="/login" className="text-blue-500 hover:underline">
                    Login
                </Link>
            )}
        </header>
    );
}
