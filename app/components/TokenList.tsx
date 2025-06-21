import { TokenWithBalance } from "../api/hooks/useTokens";

export function TokenList({ tokens }: {
    tokens: TokenWithBalance[]
}) {
    return <div>
        {tokens.map(t => <TokenRow token = {t} />)}
    </div>

}

function TokenRow({token} : {
    token: TokenWithBalance
}){
    return <div className="flex justify-between">
        <div className="flex mt-5">
            <div>
                <img src={token.image} className="w-9 h-9 rounded-full" />
            </div>
            <div className="font-bold">
                {token.name}
                <div className="font-thin text-xs">         
                    1 {token.name} = ~${token.price}
                </div>
            </div>
        </div>
        <div className="flex mt-5">
            <div className="font-bold">
                {token.usdBalance} 
                <div className="font-thin text-xs">
                {token.balance}
            </div>
            </div>
            
        </div>

    </div>
}