"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    async function logIn(email: string, password: string) {
        await supabase.auth.signInWithPassword({ email: email, password: password });
        router.push("/");
    }


    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        
        await logIn(email, password);
    }


    return(
        <>
            <main className="flex-1 flex flex-col items-center justify-center bg-gray-900">
                <form onSubmit={handleSubmit} className="w-[65%] flex flex-col items-center bg-white p-4 m-4 rounded-xl">
                    <h2 className="text-2xl text-black font-bold p-4">Log In</h2>
                    <div className="flex flex-col p-4">
                        <label htmlFor="log-in-email" className="text-md">Email</label>
                        <input id="log-in-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-md p-1 border-2 border-grey-900 rounded-sm"/>
                    </div>

                    <div className="flex flex-col p-4">
                        <label htmlFor="log-in-password" className="text-md">Password</label>
                        <input id="log-in-password" type="password" value={password} onChange={(p) => setPassword(p.target.value)} className="w-full text-md p-1 border-2 border-grey-900 rounded-sm"/>
                    </div>

                    <button type="submit" className="flex flex-col items-center justify-center text-md text-white bg-purple-800 m-16 p-2 px-4 rounded-sm">Log In</button>
                </form>
            </main>
        </>
    );
}