import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth-utils";

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
        // Helper to clean env vars (remove quotes if added by mistake in UI)
        const cleanEnv = (val: string | undefined) => val ? val.replace(/^['"]|['"]$/g, '') : undefined;
        
        const validEmail = cleanEnv(process.env.ADMIN_EMAIL);
        const validPassword = cleanEnv(process.env.ADMIN_PASSWORD);

        const isEmailMatch = credentials?.email === validEmail;
        const isPasswordMatch = credentials?.password === validPassword;

        // 1. Check Admin
        if (isEmailMatch && isPasswordMatch) {
          console.log("Authorize success: Admin");
          return { id: "admin", name: "Admin", email: validEmail, role: "admin" };
        }
        
        // 2. Check User
        if (credentials?.email && credentials?.password) {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (user && verifyPassword(credentials.password, user.password)) {
             console.log("Authorize success: User");
             return { id: user.id, name: user.email.split('@')[0], email: user.email, role: "user" };
          }
        }

        console.log("Authorize failed");
        return null;
      }
    })
  ],
  pages: {
    signIn: "/gizli-yonetim-kapisi-2024/login", // Default admin login
    error: '/gizli-yonetim-kapisi-2024/login', 
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
