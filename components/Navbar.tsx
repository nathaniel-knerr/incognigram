"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";


export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {


        async function getUser() {
            const response = await supabase.auth.getUser();
            setUser(response.data.user);
        }

        getUser();
    
        supabase.auth.onAuthStateChange(getUser);
        
    }, []);

    return(
        <>
            <header className="flex flex-col items-center bg-gray-800 mb-4">
                <nav className="w-[65%] flex flex-row justify-evenly p-2">
                    <Link href="/">
                        <h1 className="text-2xl text-white font-bold">Incognigram</h1>
                    </Link>
                    {user ? 
                        <>
                            <Link href="/profile" className="flex flex-col items-center justify-center text-sm text-white bg-purple-800 p-1 px-2 rounded-sm">Profile</Link>
                        </>
                        :
                        <>
                            <Link href="/log-in" className="flex flex-col items-center justify-center text-sm text-white bg-purple-800 p-1 px-2 rounded-sm">Log In</Link>
                            <Link href="/sign-up" className="flex flex-col items-center justify-center text-sm text-white bg-purple-800 p-1 px-2 rounded-sm">Sign Up</Link>
                        </>
                    }
                </nav>
            </header>
        </>
    )
}