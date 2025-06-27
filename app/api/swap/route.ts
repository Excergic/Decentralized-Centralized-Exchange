
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig, session } from "@/app/lib/auth";
import db from "@/app/db";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const session = await getServerSession(authConfig);

    if(!session) {
        return NextResponse.json({
            message: "Unauthorized"
        }, {
            status: 401
        })
    }

    const { fromToken, toToken, amount } = body;

    if(!fromToken || !toToken || !amount) {
        return NextResponse.json({
            message: "Invalid input"
        }, {
            status: 400
        })
    }

    try {
        const user = await db.user.findFirst({
            where: {
                id: (session as session).user.uid
            },
            include: {
                solWallet: true
            }
        })
    
        if(!user || !user.solWallet) {
            return NextResponse.json({
                message: "User not found"
            }, {
                status: 404
            })
        }
    
        // Add your swap logic here
        // 1. Get the user's private key from the database
        // 2. Use the private key to sign the transaction
        // 3. Use the Jupiter API to get the swap transaction
        // 4. Send the transaction to the Solana network
    
        return NextResponse.json({
            message: "Swap successful"
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}
