"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { SecondaryButton } from "./Button";
import { useEffect, useState } from "react";
import { useTokens } from "../api/hooks/useTokens";
import { TokenList } from "./TokenList";

export const ProfileCard = ({publicKey}: {
    publicKey : string
}) => {
    const session = useSession();
    const router = useRouter();

    if(session.status === "loading") {
        return <Loader />
    }

    if(!session.data?.user) {
        router.push("/")
        return null
    }

    return (
        <div className="pt-8 flex justify-center">
            <div className='max-w-4xl bg-gray-900 shadow w-full p-12'>
                <Greeting 
                image = {session.data?.user?.image ?? ""} 
                name = {session.data?.user?.name ?? ""} 
            />
            <Assets publicKey={publicKey} />
            </div>
      </div>
      );
    };
    
    function Greeting(
        { image, name } : {
            image : string, name : string
        }
    ) {
        return <div className='flex'>
            <img src={image} className='flex-col justify-center rounded-full w-12 h-12 mr-5' />
            <div className='text-xl text-gray-400 mt-2 flex-col justify-center font-bold'>
                Welcome back, {name}
                </div>
        </div>
    }
    
    function Assets({publicKey}: {
        publicKey : string
    }) {
        const [ copied, setCopied ] = useState(false);
        const { tokenBalance, loading } = useTokens(publicKey);

        useEffect(() => {
            if(copied) {
                let timeOut = setTimeout(() => {
                    setCopied(false)
                }, 3000)
                return () => {
                    clearTimeout(timeOut)
                }
            }
        }, [copied])


        if(loading) {
            return <Loader />
        }
        
        return <div className='mt-6'>
            <div className="text-gray-500">
                Account Assets
            </div>
            <div className="flex justify-between">
                <div className="text-6xl font-bold text-gray-400">
                    ${tokenBalance?.totalBalance.toFixed(2)}
                    <span className="font-bold text-slate-400 text-3xl">USD</span>
                </div>
              

                <div>
                    <SecondaryButton onClick={() => {
                        setCopied(true)
                        navigator.clipboard.writeText(publicKey)
                    }}>{copied ? "Copied" : "Your Wallet Address"}</SecondaryButton>
                </div>
            </div>

            <div>
                <TokenList tokens={tokenBalance?.tokens || []} />
            </div>
        </div>
    }
