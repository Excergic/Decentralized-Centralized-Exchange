
export interface TokenDetails {
    name: string;
    mint: string;
    native: boolean;  
    price: string; 
    image: string; 
    decimal: number;
}
export const SUPPORTED_TOKENS : TokenDetails[] = [{
    
        name: "SOL",
        mint: "So11111111111111111111111111111111111111112",
        native: true,
        price: "150",
        image: "https://s3.coinmarketcap.com/static-gravity/image/5cc0b99a8dd84fbfa4e150d84b5531f2.png",
        decimal: 9
    },{
        name: "USDT",
        mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        native: false,
        price: "1",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8tByANc8GU9Kbgrb7U99tHjuhbJfy_fKkuITxF-Nko-qjbjZB1X7_mzd7dyBsL5gxy80&usqp=CAU",
        decimal: 6
    },{
        name: "USDC",
        mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        native: false,
        price: "1",
        image: "https://public.bnbstatic.com/static/academy/uploads/ed56241a5ef84c4682170faeff21f43f.png",
        decimal: 6
    }
]