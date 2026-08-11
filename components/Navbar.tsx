"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCirclePlus } from "lucide-react";
import { HomeIcon } from "lucide-react";


export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();


    async function getUser() {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.log(error);
            return;
        }

        const currentUser = data.user;
        
        if (currentUser) {
            setUser(data.user);
        }
    }


    async function logOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error);
        }
        setUser(null);
        router.push("/sign-up");
    }


    async function renderNavbar() {
        await getUser();
        setLoading(false);
    }


    useEffect(() => {

        renderNavbar();
    
        supabase.auth.onAuthStateChange(getUser);
        
    }, []);

    
    return(
        <>
            <header className="flex flex-col items-center bg-gray-800 mb-4">
                <nav className="w-[65%] flex flex-col md:flex-row justify-evenly items-center p-2">
                    <h1 className="text-2xl text-white font-bold m-1">Incognigram</h1>
                    <div className="w-full flex flex-row justify-center md:justify-end">
                        {loading ?
                            <></>
                            :
                            <>
                                <Link href="/" className="flex flex-col items-center justify-center text-sm text-white bg-purple-800 p-1 px-2 rounded-sm m-1">
                                    <HomeIcon></HomeIcon>
                                </Link>
                                {user ? 
                                    <>
                                        <Link href="/profile" className="flex flex-col items-center justify-center text-sm text-white bg-purple-800 p-1 px-2 rounded-sm m-1">
                                         <MessageCirclePlus></MessageCirclePlus>
                                        </Link>
                                        <button onClick={logOut} className="flex flex-col items-center justify-center text-sm text-white bg-purple-800 p-1 px-2 rounded-sm m-1">Log Out</button>
                                    </>
                                    :
                                    <>
                                        <Link href="/log-in" className="flex flex-col items-center justify-center text-sm text-white bg-purple-800 p-1 px-2 rounded-sm m-1">Log In</Link>
                                        <Link href="/sign-up" className="flex flex-col items-center justify-center text-sm text-white bg-purple-800 p-1 px-2 rounded-sm m-1">Sign Up</Link>
                                    </>
                                }
                            </>
                        }
                    </div>
                </nav>
            </header>
        </>
    )
}