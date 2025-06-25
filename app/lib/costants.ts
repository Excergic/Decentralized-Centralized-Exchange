import { Connection } from "@solana/web3.js";
import axios from "axios";
import { SUPPORTED_TOKENS } from "./tokens";

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
