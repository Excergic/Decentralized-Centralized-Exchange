import { ReactNode, useEffect, useState } from "react";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import { TokenWithBalance } from "../api/hooks/useTokens";
import { PrimaryButton, SecondaryButton } from "./Button";
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
    const [ baseAmount, setBaseAmount ] = useState<string>();
    const [ quoteAmount, setQuoteAmount ] = useState<string>();
    const [ fetchingQuote, setFetchingQuote ] = useState(false);
    const [ quoteResponse, setQuoteResponse ] = useState(null);
    // TODO: Use async useEffect that u can cancle
    // Use Debouncing
    useEffect(() => {
        if(!baseAmount) {
            return;
        }
        setFetchingQuote(true)
        axios.get(`https://lite-api.jup.ag/swap/v1/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${Number(baseAmount) * 10 ** baseAsset.decimal}&slippageBps=50`)
            .then(res => {
                setQuoteAmount((Number(res.data.outAmount) / Number(10 ** quoteAsset.decimal)).toString())
                setFetchingQuote(false)
                setQuoteResponse(res.data)
            })

    },[baseAmount, quoteAmount, baseAsset])

    return <div>
        <div className="text-green-700 font-bold text-2xl text-center my-5">
            Swap Token
        </div>
        <div className="border-2 border-gray-600 rounded-lg p-5">
            <SwapInputRow 
            amount={baseAmount}
            onAmountChange = {(value : string) => {
                setBaseAmount(value)
            }} 
            onSelect={(asset) => {
                setBaseAsset(asset)
            }} selectedToken = {baseAsset} title={"You Pay:"} 
            subTitle=
            {<div className="text-gray-400 pt-3">
                {`Current Balance: ${tokenBalance?.tokens.find(x => x.name === baseAsset.name)?.balance} ${baseAsset.name}`}
            </div>}
        />
        </div>
        <div className="flex justify-center">
            <div onClick={() => {
                let baseAsetTemp = baseAsset
                setBaseAsset(quoteAsset)    
                setQuoteAsset(baseAsetTemp)
            }} className="cursor-pointer rounded-full w-9 h-9 border-gray-700 mt-[-20px] absolute  bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className=" w-full h-full">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                </svg>
            </div>
        </div>

        <div className="border-2 border-gray-600 rounded-lg p-5 ">
            <SwapInputRow inputLoading={fetchingQuote} inputDisable={true} amount={quoteAmount} onSelect={(asset) => {
                setQuoteAsset(asset)
            }} selectedToken = {quoteAsset} title={"You Receive:"}/>
        </div>
        <div className="flex justify-center pt-4">
        <SecondaryButton onClick={async () => {
            // fetch swap
            try{
                const res = await axios.post("/api/swap", {
                    quoteResponse
                });
                if(res.data.txid){
                    alert("Swap successful!")
                }
            }catch(e){
                alert("Swap failed!")
            }
        }}>Swap</SecondaryButton>
        </div>
        
    </div>
    
}

function SwapInputRow({onSelect,amount, selectedToken, onAmountChange, title, subTitle, inputDisable, inputLoading} : {
    onSelect: (asset: TokenDetails) => void;
    selectedToken: TokenDetails;
    title: string;
    subTitle?: ReactNode;
    amount?: string;
    onAmountChange?: (value: string) => void;
    inputDisable?: boolean;
    inputLoading?: boolean;
}) {
    return <div className="flex justify-between p-4">
        <div>
            <div className="text-sm font-bold text-gray-400 mb-2">
                {title}
            </div>
            <AssetSelector selectedToken={selectedToken} onSelect={onSelect}/>
            {subTitle}
        </div>
        <div>
            <input onChange={(e) => {
                onAmountChange?.(e.target.value);
            }} disabled={inputDisable} placeholder="0" type="text" className="p-4 outline-none text-4xl" dir="rtl" value={amount} />
        </div>
       
    </div>
}

function AssetSelector({selectedToken, onSelect} : {
    onSelect: (asset: TokenDetails) => void;
    selectedToken: TokenDetails
}) {
    return <div>
        
        <select onChange={(e) => {
            const selectedToken = SUPPORTED_TOKENS.find(x => x.name === e.target.value)
            if(selectedToken){
                onSelect(selectedToken)
            }
        }} id="tokens" className="bg-gray-900 text-white rounded-lg 
        text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 
        focus:outline-none dark:focus:ring-gray-700 dark:border-gray-700">
            <option selected = {true} value={selectedToken.name}>
                <img src={selectedToken.image} className="w-10" />{selectedToken.name}
            </option>
            {SUPPORTED_TOKENS.filter(asset => asset.name !== selectedToken.name).map(asset => <option key={asset.name} 
            onClick={() => onSelect(asset)} value={asset.name}><img src={asset.image} className="w-10" />{asset.name}</option>)}
            <option value="SOL">
                <img src={SUPPORTED_TOKENS[0].image} className="w-10" />{SUPPORTED_TOKENS[0].name}
            </option>
        </select>
    </div>
}