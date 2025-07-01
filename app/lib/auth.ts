
import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db";
import { Keypair } from "@solana/web3.js";
import { Account, Profile, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface session extends Session {
    user: {
        email: string;
        name: string;
        image: string;
        uid: string;
    }
}

interface customJWT extends JWT {
  uid?: string;
}

declare module "next-auth" {
  interface Profile {
    picture?: string;
  }
}

// Providers for sign up / log in
export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
      })
  ],
    
  callbacks : {
    //This makes the database user ID available on the client side
     session: ({ session, token }: {session: Session, token: customJWT}) : session => {
        const newSession : session = session as session; // to make sure, this session has uid
        
        if(newSession.user && token.uid) {
            newSession.user.uid = token.uid ?? "";
        }
        return newSession! ;
    },

    //Queries the database to find the user by their OAuth provider ID (sub)
    async jwt({ token, account }: {token: customJWT, account: Account | null}) {
        const user = await db.user.findFirst({
            where: {
                sub: account?.providerAccountId ?? ""
            }
        })
        if(user){
            token.uid = user.id
        }
        return token 
    },
      async signIn({ user, account, profile, email, credentials }: any) {
        if(account?.provider === "google") {
          const email = user.email;
          if(!email) {
            return false
          }

          const userDb = await db.user.findFirst({
            where: {
              username: email
            }
          })

          if(userDb) {
            return true;
          }

          const keypair = Keypair.generate(); // generates the keypair
          const publicKey = keypair.publicKey.toBase58();
          const privateKey = keypair.secretKey;
          console.log(`publicKey: ${publicKey}`);
          console.log(`privateKey: ${privateKey}`);

          await db.user.create({
            data: {
              username: email,
              name: profile?.name,
              profilePicture: profile?.picture,
              provider: "Google",
              sub: account.providerAccountId,
              solWallet: {
                create: {
                  publicKey: publicKey,
                  privateKey: privateKey.toString()
                }
              },
              inrWallet: {
                create: {
                  balance: 0
                }
              }
            }
          })

        }
        return true
      },
  }
}
