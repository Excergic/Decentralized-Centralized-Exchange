'use client';
import { signIn, useSession } from "next-auth/react";
import { SecondaryButton } from "./Button"
import { useRouter } from "next/navigation";

export const Hero = () => {
    const navigate = useRouter();
    const session = useSession();

    return <div className="flex flex-col items-center">
        <h2 className="text-6xl font-bold">CoinEX</h2>
        <p className="text-2xl">The Solana SuperPower App</p>
        <p className="text-2xl">portfolio, swap, perps at one place</p>
        <div className="flex flex-col items-center mt-5">
        {session.data?.user? <SecondaryButton onClick= {() => {
                navigate.push("/dashboard");
            }} >Go to DashBoard</SecondaryButton> : <SecondaryButton onClick={() => {
                signIn("google")
            }}>Login with Google</SecondaryButton>}   
        </div>
    </div>
}