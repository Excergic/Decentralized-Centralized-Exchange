'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { PrimaryButton } from "./Button";
import { useRouter } from "next/navigation";

export const Appbar = () => {
    const session = useSession();
    const navigate = useRouter();
    return <div className="flex justify-between items-center p-4">
        <div>
            DCEX
        </div>
        <div>
            {session.data?.user? <PrimaryButton onClick= {() => {
                signOut()
            }} >Logout</PrimaryButton> : <PrimaryButton onClick={() => {
                signIn() 
            }}>Login</PrimaryButton>}      
        </div>
    </div>
}