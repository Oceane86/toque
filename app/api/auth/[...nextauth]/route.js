// app/api/auth/[...nextauth].js

import { connectToDB } from "@/mongodb/database";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { compare } from "bcryptjs";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req) {
                await connectToDB();
                const user = await User.findOne({ email: credentials.email });
                if (!user) {
                    throw new Error("Invalid email or password");
                }
                const isMatch = await compare(credentials.password, user.password);
                if (!isMatch) {
                    throw new Error("Invalid email or password");
                }
                return user;
            }
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async session({ session }) {
            const sessionUser = await User.findOne({ email: session.user.email });
            session.user.id = sessionUser._id.toString();
            session.user.profileImagePath = sessionUser.profileImagePath;
            return session;
        },

        async signIn({ account, profile }) {
            if (account.provider === "google") {
                try {
                    await connectToDB();
                    let user = await User.findOne({ email: profile.email });
                    if (!user) {
                        user = await User.create({
                            email: profile.email,
                            username: profile.name,
                            profileImagePath: profile.picture,
                            isGoogleUser: true,
                        });
                    }
                    return true;
                } catch (err) {
                    console.error("Error during Google sign-in:", err.message);
                    return false;
                }
            }
            return true;
        },

        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };