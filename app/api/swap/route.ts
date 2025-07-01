import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";


export async function POST(req: NextRequest) {
    const connection = new Connection("https://api.mainnet-beta.solana.com")
    const data : {
        quoteResponse: any,
    } = await req.json();

    const session = await getServerSession(authConfig);
       if(!session?.user) {
        return NextResponse.json({
            message: "You are not logged In"
        }, {
            status: 401
        })
    }

    const solWallet = await db.solWallet.findFirst({
        where: {
            userId: session.user.uid
        }
    })

    if(!solWallet) {
        return NextResponse.json({
            message: "No wallet found with this User"
        }, {
            status: 401
        })
    }

    const { swapTransaction } = await (
        await fetch('https://lite-api.jup.ag/swap/v1/swap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // quote response from quote api
            quoteResponse: data.quoteResponse,
            // user public key to be used for the swap
            userPublicKey: solWallet.publicKey,
            // auto wrap and unwrap SOL
            wrapAndUnwrapSol: true,
          })
        })
      ).json();    

      // deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      var transaction = VersionedTransaction.deserialize(swapTransactionBuf); 
      const privateKey = getPrivateKeyFromDb(solWallet.privateKey);
      // sign the transaction
      transaction.sign([privateKey]);

      const latestBlockHash = await connection.getLatestBlockhash();

      //execute the transaction
      const rawTransaction = transaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
      });

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      });

      return NextResponse.json({
        message: "Swap Successful",
        txid
      })
}

function getPrivateKeyFromDb(privateKey: string) {
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyArr = Uint8Array.from(arr);
    const keyPair = Keypair.fromSecretKey(privateKeyArr);
    return keyPair;
}