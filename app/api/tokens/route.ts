import { NextRequest, NextResponse } from "next/server";
import { getAccount, getAssociatedTokenAddress, getMint } from "@solana/spl-token";
import { connection, getSupportedTokens } from "@/app/lib/costants";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address") as unknown as string;
    const supportedTokens = await getSupportedTokens(); //token with, name, mint, native, price, image and some extra info
    const balances = await Promise.all(supportedTokens.map((token) => 
        getAccountBalance(token, address)
    )); // => result will look like this [0, 0, 0.06] -> 0 USDT, 0 USDC, 0.06 SOL

    const tokens = supportedTokens.map((token, index) => ({
        ...token,
        balance: balances[index],
        usdBalance: (balances[index] * Number(token.price))
    })) // get each tokens, balances(how many token user hold) and its USD Balances

    return NextResponse.json({
        tokens,
        totalBalance: tokens.reduce((acc, token) => Number(acc + token.usdBalance), 0)
    });
}

async function getAccountBalance(token: {
    // token has name and mint as a string
    name: string;
    mint: string;
    native: boolean; 
    decimal: number; 
}, address: string) {
    if(token.native) {
        let balance = await connection.getBalance(new PublicKey(address));
        return balance / LAMPORTS_PER_SOL; // e.g 8.01 / 1000000000 => 801000000
    }
    
    //Associated Token Account (ATA)
    const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address));
    try{
        const account = await getAccount(connection, ata);
        const mint = await getMint(connection, new PublicKey(token.mint));
        return Number(account.amount) / (10 ** Number(mint.decimals));
    }catch(e){
        return 0;
    }
}   