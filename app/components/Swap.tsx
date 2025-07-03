// components/Swap.tsx
import { ReactNode, useEffect, useState } from "react";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import { TokenWithBalance } from "../api/hooks/useTokens";
import { PrimaryButton } from "./Button";
import { ArrowUpDown, ChevronDown, Wallet, Settings, RefreshCw } from "lucide-react";
import axios from "axios";

export const Swap = ({publicKey, tokenBalance} : {
    publicKey : string
    tokenBalance: {
        totalBalance: number;
        tokens: TokenWithBalance[];
    } | null
}) => {
    const [ baseAsset, setBaseAsset ] = useState(SUPPORTED_TOKENS[0]);
    const [ quoteAsset, setQuoteAsset ] = useState(SUPPORTED_TOKENS[1]);
    const [ baseAmount, setBaseAmount ] = useState<string>("");
    const [ quoteAmount, setQuoteAmount ] = useState<string>("");
    const [ fetchingQuote, setFetchingQuote ] = useState(false);
    const [ quoteResponse, setQuoteResponse ] = useState(null);
    const [notification, setNotification] = useState<{ type: "success" | "error", message: string } | null>(null);
    const [slippage, setSlippage] = useState(0.5);
    const [swapping, setSwapping] = useState(false);

    // Debounced quote fetching
    useEffect(() => {
        if(!baseAmount || parseFloat(baseAmount) === 0) {
            setQuoteAmount("");
            return;
        }

        const timeoutId = setTimeout(() => {
            setFetchingQuote(true);
            axios.get(`https://quote-api.jup.ag/v6/quote`, {
                params: {
                    inputMint: baseAsset.mint,
                    outputMint: quoteAsset.mint,
                    amount: Number(baseAmount) * 10 ** baseAsset.decimal,
                    slippageBps: slippage * 100,
                }
            })
            .then(res => {
                setQuoteAmount((Number(res.data.outAmount) / Number(10 ** quoteAsset.decimal)).toFixed(6));
                setQuoteResponse(res.data);
            })
            .catch(err => {
                console.error("Quote fetch error:", err);
                setQuoteAmount("");
                setNotification({ type: "error", message: "Failed to get quote" });
            })
            .finally(() => {
                setFetchingQuote(false);
            });
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [baseAmount, baseAsset, quoteAsset, slippage]);

    // Auto-dismiss notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleSwap = async () => {
        if (!quoteResponse) {
            setNotification({ type: "error", message: "No quote available" });
            return;
        }

        setSwapping(true);
        try {
            const res = await axios.post("/api/swap", { quoteResponse });
            if (res.data.txid) {
                setNotification({ type: "success", message: "Swap successful!" });
                setBaseAmount("");
                setQuoteAmount("");
                setQuoteResponse(null);
            } else {
                setNotification({ type: "error", message: "Swap failed!" });
            }
        } catch (e) {
            console.error("Swap error:", e);
            setNotification({ type: "error", message: "Swap failed!" });
        } finally {
            setSwapping(false);
        }
    };

    const getButtonText = () => {
        if (swapping) return "";
        if (!baseAmount || parseFloat(baseAmount) === 0) return "Enter an amount";
        if (fetchingQuote) return "Getting quote...";
        return "Swap";
    };

    const isButtonDisabled = !baseAmount || parseFloat(baseAmount) === 0 || fetchingQuote || swapping;

    const handleMaxClick = () => {
        const balance = tokenBalance?.tokens.find(x => x.name === baseAsset.name)?.balance;
        if (balance) {
            setBaseAmount(parseFloat(balance).toFixed(3));
        }
    };

    const handleHalfClick = () => {
        const balance = tokenBalance?.tokens.find(x => x.name === baseAsset.name)?.balance;
        if (balance) {
            setBaseAmount((parseFloat(balance) / 2).toFixed(3));
        }
    };

    return (
        <div className="max-w-md mx-auto">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-5 right-5 px-6 py-4 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 z-50 ${
                    notification.type === "success" ? "bg-green-600" : "bg-red-600"
                }`}>
                    {notification.message}
                </div>
            )}

            {/* Swap Container */}
            <div className="bg-[#1a1b23] rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Swap Tokens</h2>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                            <Settings size={16} className="text-gray-400" />
                        </button>
                        <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                            <RefreshCw size={16} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Selling Section */}
                <div className="bg-[#131620] rounded-xl p-5 mb-2">
                    <SwapInputRow 
                        amount={baseAmount}
                        onAmountChange={(value: string) => setBaseAmount(value)} 
                        onSelect={(asset) => setBaseAsset(asset)} 
                        selectedToken={baseAsset} 
                        title="You Pay" 
                        tokenBalance={tokenBalance}
                        subTitle={
                            <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
                                <div className="flex items-center gap-1">
                                    <Wallet size={12} />
                                    <span>
                                        {tokenBalance?.tokens.find(x => x.name === baseAsset.name)?.balance 
                                            ? parseFloat(tokenBalance.tokens.find(x => x.name === baseAsset.name)!.balance).toFixed(3)
                                            : "0.000"} {baseAsset.name}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={handleHalfClick}
                                        className="px-2 py-1 bg-gray-700/50 rounded text-xs font-medium hover:bg-gray-600/50 transition-colors"
                                    >
                                        HALF
                                    </button>
                                    <button 
                                        onClick={handleMaxClick}
                                        className="px-2 py-1 bg-gray-700/50 rounded text-xs font-medium hover:bg-gray-600/50 transition-colors"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                        }
                    />
                </div>

                {/* Swap Direction Button */}
                <div className="flex justify-center relative -my-3 z-10">
                    <button 
                        onClick={() => {
                            const temp = baseAsset;
                            setBaseAsset(quoteAsset);    
                            setQuoteAsset(temp);
                            // Clear amounts when swapping
                            setBaseAmount("");
                            setQuoteAmount("");
                        }} 
                        className="bg-[#2a2d3a] hover:bg-[#3a3d4a] border-4 border-[#1a1b23] rounded-full p-3 transition-all duration-200 hover:scale-110"
                    >
                        <ArrowUpDown size={18} className="text-gray-300" />
                    </button>
                </div>

                {/* Buying Section */}
                <div className="bg-[#131620] rounded-xl p-5 mt-2">
                    <SwapInputRow 
                        inputLoading={fetchingQuote} 
                        inputDisable={true} 
                        amount={quoteAmount} 
                        onSelect={(asset) => setQuoteAsset(asset)} 
                        selectedToken={quoteAsset} 
                        title="You Receive"
                        tokenBalance={tokenBalance}
                        subTitle={
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                                <Wallet size={12} />
                                <span>
                                    {tokenBalance?.tokens.find(x => x.name === quoteAsset.name)?.balance 
                                        ? parseFloat(tokenBalance.tokens.find(x => x.name === quoteAsset.name)!.balance).toFixed(3)
                                        : "0.000"} {quoteAsset.name}
                                </span>
                            </div>
                        }
                    />
                </div>

                {/* Swap Info */}
                {baseAmount && quoteAmount && !fetchingQuote && (
                    <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Rate</span>
                            <span>1 {baseAsset.name} ≈ {(parseFloat(quoteAmount) / parseFloat(baseAmount)).toFixed(6)} {quoteAsset.name}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400 mt-1">
                            <span>Slippage</span>
                            <span>{slippage}%</span>
                        </div>
                    </div>
                )}

                {/* Swap Button */}
                <div className="mt-6">
                    <PrimaryButton 
                        onClick={handleSwap}
                        className="w-full py-4 text-lg font-semibold"
                        disabled={isButtonDisabled}
                        loading={swapping}
                    >
                        {getButtonText()}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

function SwapInputRow({onSelect, amount, selectedToken, onAmountChange, title, subTitle, inputDisable, inputLoading, tokenBalance} : {
    onSelect: (asset: TokenDetails) => void;
    selectedToken: TokenDetails;
    title: string;
    subTitle?: ReactNode;
    amount?: string;
    onAmountChange?: (value: string) => void;
    inputDisable?: boolean;
    inputLoading?: boolean;
    tokenBalance?: any;
}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400 font-medium">{title}</span>
            </div>
            <div className="flex justify-between items-center">
                <AssetSelector selectedToken={selectedToken} onSelect={onSelect}/>
                <div className="text-right flex-1 ml-4">
                    <input 
                        onChange={(e) => onAmountChange?.(e.target.value)} 
                        disabled={inputDisable} 
                        placeholder="0.00" 
                        type="number"
                        step="any"
                        className="bg-transparent text-right outline-none text-4xl font-mono text-white placeholder-gray-500 w-full" 
                        value={inputLoading ? "" : amount || ""} 
                    />
                    {inputLoading && (
                        <div className="text-right text-4xl font-mono text-gray-400">...</div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">≈ $0.00</div>
                </div>
            </div>
            {subTitle}
        </div>
    );
}

function AssetSelector({selectedToken, onSelect} : {
    onSelect: (asset: TokenDetails) => void;
    selectedToken: TokenDetails
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-[#2a2d3a] hover:bg-[#3a3d4a] rounded-xl px-4 py-3 transition-colors min-w-[140px]"
            >
                <img 
                    src={selectedToken.image} 
                    alt={selectedToken.name} 
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/32x32/6b7280/ffffff?text=${selectedToken.name.charAt(0)}`;
                    }}
                />
                <span className="font-semibold text-white">{selectedToken.name}</span>
                <ChevronDown size={16} className="text-gray-400" />
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 bg-[#2a2d3a] rounded-xl border border-gray-600 shadow-xl z-20 min-w-[200px] max-h-60 overflow-y-auto">
                        {SUPPORTED_TOKENS.map(asset => (
                            <button
                                key={asset.name}
                                onClick={() => {
                                    onSelect(asset);
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#3a3d4a] transition-colors first:rounded-t-xl last:rounded-b-xl"
                            >
                                <img 
                                    src={asset.image} 
                                    alt={asset.name} 
                                    className="w-8 h-8 rounded-full"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://via.placeholder.com/32x32/6b7280/ffffff?text=${asset.name.charAt(0)}`;
                                    }}
                                />
                                <div className="text-left">
                                    <div className="font-medium text-white">{asset.name}</div>
                                    <div className="text-xs text-gray-400">{asset.name}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
