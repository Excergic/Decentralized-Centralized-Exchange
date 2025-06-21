import { Connection } from "@solana/web3.js";
import axios from "axios";

let LAST_UPDATED : number | null = null;
let prices : {[key: string]: {
    price: string;
    extraInfo?: {
        buyPrice?: string;
        sellPrice?: string;
        confidenceLevel?: string;
    };
}} = {};
const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // every 60s
export interface TokenDetails {
    name: string;
    mint: string;
    native: boolean;  
    price: string; 
    image: string; 
}
export const SUPPORTED_TOKENS : TokenDetails[] = [{
    name: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native: false,
    price: "1",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8tByANc8GU9Kbgrb7U99tHjuhbJfy_fKkuITxF-Nko-qjbjZB1X7_mzd7dyBsL5gxy80&usqp=CAU"
},{
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false,
    price: "1",
    image: "https://public.bnbstatic.com/static/academy/uploads/ed56241a5ef84c4682170faeff21f43f.png",
},{
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true,
    price: "150",
    image: "https://s3.coinmarketcap.com/static-gravity/image/5cc0b99a8dd84fbfa4e150d84b5531f2.png",
}
]

export const connection = new Connection("https://api.mainnet-beta.solana.com");

export async function getSupportedTokens() {
    if (!LAST_UPDATED || new Date().getTime() - LAST_UPDATED >= TOKEN_PRICE_REFRESH_INTERVAL) {
        try {
            const response = await axios.get("https://api.jup.ag/price/v2?ids=Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v,So11111111111111111111111111111111111111112&showExtraInfo=true");
            
            prices = response.data.data;
            LAST_UPDATED = new Date().getTime();
            
            // Log to debug what you're actually receiving
            console.log("Price data received:", prices);
            
        } catch (error) {
            console.error("Failed to fetch token prices:", error);
            return SUPPORTED_TOKENS;
        }
    } 
    
    return SUPPORTED_TOKENS.map(s => {
        const tokenData = prices[s.mint];
        if (tokenData) {
            // Use the most recent price available
            const currentPrice = tokenData.price || 
                                tokenData.extraInfo?.buyPrice || 
                                tokenData.extraInfo?.sellPrice || 
                                s.price;
            
            return {
                ...s,
                price: currentPrice,
                // Add confidence level if available
                confidence: tokenData.extraInfo?.confidenceLevel || 'Unknown'
            };
        }
        return { ...s, confidence: 'Default' };
    });
}
