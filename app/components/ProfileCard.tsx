"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { SecondaryButton, TabButton } from "./Button";
import { useEffect, useState } from "react";
import { TokenWithBalance, useTokens } from "../api/hooks/useTokens";
import { TokenList } from "./TokenList";
import { Swap } from "./Swap";

type Tab = "swap" | "portfolio";

const tabs: {id: Tab , name: string}[] = [
    {id: "portfolio", name: "Portfolio"}, 
    {id: "swap", name: "Swap"}
]

export const ProfileCard = ({publicKey}: {
    publicKey : string
}) => {
    const session = useSession();
    const router = useRouter();
    const [ selectedTab, setSelectedTab ] = useState<Tab>("portfolio");
    const { tokenBalance, loading } = useTokens(publicKey);

    if(session.status === "loading") {
        return <Loader />
    }

    if(!session.data?.user) {
        router.push("/")
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0b0f] via-[#1a1b23] to-[#0a0b0f] pt-24 px-4 flex items-center justify-center">
            <div className='max-w-5xl w-full bg-gradient-to-br from-[#1e2028] to-[#16171d] shadow-2xl rounded-3xl border border-gray-700/50 p-8 md:p-12'>
                
                {/* Header Section */}
                <Greeting 
                    image = {session.data?.user?.image ?? ""} 
                    name = {session.data?.user?.name ?? ""} 
                />
                
                {/* Tab Navigation */}
                <div className="flex justify-center mt-8 mb-8">
                    <div className="bg-[#0f1014] rounded-2xl p-2 border border-gray-700/30">
                        {tabs.map((tab) => (
                            <TabButton 
                                key={tab.id} 
                                active={tab.id === selectedTab} 
                                onClick={() => setSelectedTab(tab.id)}
                                className="mx-1"
                            >
                                {tab.name}
                            </TabButton>
                        ))}
                    </div>
                </div>

                {/* Content Sections */}
                <div className="min-h-[400px]">
                    {selectedTab === "portfolio" && (
                        <Assets tokenBalance={tokenBalance} loading={loading} publicKey={publicKey} />
                    )}
                    {selectedTab === "swap" && (
                        <div className="flex justify-center">
                            <Swap tokenBalance={tokenBalance} publicKey={publicKey} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function Greeting({ image, name } : { image : string, name : string }) {
    return (
        <div className='flex items-center gap-5 mb-6'>
            <img 
                src={image} 
                className='rounded-full w-16 h-16 border-2 border-gray-600 object-cover' 
                alt="Profile"
            />
            <div>
                <h1 className='text-3xl md:text-4xl font-bold text-white'>
                    Welcome back, 
                    <span className="bg-gradient-to-r from-[#00D4FF] to-[#9945FF] bg-clip-text text-transparent ml-2">
                        {name?.split(' ')[0]}
                    </span>
                </h1>
                <p className="text-gray-400 mt-1">Manage your crypto portfolio</p>
            </div>
        </div>
    )
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
        return (
            <div className="flex justify-center items-center h-64">
                <Loader />
            </div>
        )
    }
    
    return (
        <div className='space-y-8'>
            {/* Portfolio Header */}
            <div className="text-center md:text-left">
                <h2 className="text-gray-400 text-lg font-semibold mb-4">
                    Total Portfolio Value
                </h2>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="text-center md:text-left">
                        <div className="text-6xl md:text-7xl font-bold text-white leading-none">
                            ${tokenBalance?.totalBalance.toFixed(2) || "0.00"}
                        </div>
                        <span className="text-2xl md:text-3xl font-semibold text-gray-400 ml-2">USD</span>
                    </div>

                    <div className="flex justify-center md:justify-end">
                        <SecondaryButton 
                            onClick={() => {
                                setCopied(true)
                                navigator.clipboard.writeText(publicKey)
                            }}
                            className="px-6 py-3 text-base font-semibold"
                        >
                            {copied ? "Copied!" : "Copy Wallet Address"}
                        </SecondaryButton>
                    </div>
                </div>
            </div>

            {/* Assets List */}
            <div className="bg-[#0f1014] rounded-2xl p-6 border border-gray-700/30">
                <h3 className="text-xl font-bold text-white mb-6">Your Assets</h3>
                <TokenList tokens={tokenBalance?.tokens || []} />
            </div>
        </div>
    )
}
