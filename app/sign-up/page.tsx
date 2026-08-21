"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    async function signUp(email: string, password: string) {
    
        await supabase.auth.signUp({ email: email, password: password });
        await supabase.auth.signInWithPassword({ email: email, password: password });
        router.push("profile");
    }


    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        
        await signUp(email, password);
    }


    return(
        <>
            <main className="flex-1 flex flex-col items-center justify-center bg-gray-900">
                <form onSubmit={handleSubmit} className="w-full md:w-[65%] flex flex-col items-center bg-gray-700 p-4 m-4">
                    <h2 className="text-2xl text-white font-bold p-4">Sign Up</h2>
                    <div className="w-full md:w-[65%] flex flex-col p-4">
                        <label htmlFor="sign-up-email" className="text-md text-white">Email</label>
                        <input id="sign-up-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-md p-1 bg-white"/>
                    </div>

                    <div className="w-full md:w-[65%] flex flex-col p-4">
                        <label htmlFor="sign-up-password" className="text-md text-white">Password</label>
                        <input id="sign-up-password" type="password" value={password} onChange={(p) => setPassword(p.target.value)} className="w-full text-md p-1 bg-white"/>
                    </div>

                    <button type="submit" className="flex flex-col items-center justify-center text-md text-white bg-purple-700 m-16 p-2 px-4 rounded-sm">Sign Up</button>
                </form>
            </main>
        </>
    );
}