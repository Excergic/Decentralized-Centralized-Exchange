"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { SecondaryButton, TabButton } from "./Button";
import { useEffect, useState } from "react";
import { TokenWithBalance, useTokens } from "../api/hooks/useTokens";
import { TokenList } from "./TokenList";
import { Swap } from "./Swap";

type Tab = "send" | "withdraw" | "swap" | "add funds" | "tokens"

const tabs: {id: Tab , name: string}[] = [
    {id: "tokens", name: "Tokens"}, 
    {id: "send", name: "Send"}, 
    {id: "withdraw", name: "Withdraw"}, 
    {id: "swap", name: "Swap"}, 
    {id: "add funds", name: "Add Funds"}
]

export const ProfileCard = ({publicKey}: {
    publicKey : string
}) => {
    const session = useSession();
    const router = useRouter();
    const [ selectedTab, setSelectedTab ] = useState<Tab>("tokens");
    const { tokenBalance, loading } = useTokens(publicKey);

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
            
            <div className="flex mt-5 justify-center">
                {tabs.map((tab => <TabButton key={tab.id} active={tab.id === selectedTab} onClick={() => {
                    setSelectedTab(tab.id)
                }}>{tab.name}</TabButton>))}
            </div>
            <div className={`${selectedTab === "tokens" ? "visible" : "hidden"}`}> <Assets tokenBalance={tokenBalance} loading={loading} publicKey={publicKey} /> </div>
            <div className={`${selectedTab === "swap" ? "visible" : "hidden"}`}> <Swap tokenBalance={tokenBalance} publicKey={publicKey} /> </div>
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
    
    function Assets({publicKey, tokenBalance, loading}: {
        publicKey : string
        tokenBalance: {
            totalBalance: number;
            tokens: TokenWithBalance[];
        } | null
        loading: boolean
    }) {
        const [ copied, setCopied ] = useState(false);
        

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
