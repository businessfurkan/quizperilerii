import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("--- Login Attempt ---");
        console.log("Input Email:", credentials?.email);
        
        // Credentials from env
        const validEmail = process.env.ADMIN_EMAIL;
        const validPassword = process.env.ADMIN_PASSWORD;

        // Debug info
        console.log("Env Email configured:", !!validEmail);
        console.log("Env Password configured:", !!validPassword);
        
        if (!validEmail || !validPassword) {
            console.error("CRITICAL: Admin credentials not found in environment variables!");
            return null;
        }

        const isEmailMatch = credentials?.email === validEmail;
        const isPasswordMatch = credentials?.password === validPassword;

        console.log("Email Match:", isEmailMatch);
        console.log("Password Match:", isPasswordMatch);

        if (isEmailMatch && isPasswordMatch) {
          console.log("Authorize success");
          return { id: "1", name: "Admin", email: validEmail };
        }
        
        console.log("Authorize failed - Mismatch");
        if (!isEmailMatch) console.log("Reason: Email mismatch");
        if (!isPasswordMatch) console.log("Reason: Password mismatch");
        
        return null;
      }
    })
  ],
  pages: {
    signIn: "/gizli-yonetim-kapisi-2024/login",
    error: '/gizli-yonetim-kapisi-2024/login', // Error code passed in url query string as ?error=
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-change-this-in-prod",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
