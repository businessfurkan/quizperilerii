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
        console.log("Authorize attempt:", credentials?.email);
        
        // Credentials from env
        const validEmail = process.env.ADMIN_EMAIL;
        const validPassword = process.env.ADMIN_PASSWORD;

        if (
          credentials?.email === validEmail &&
          credentials?.password === validPassword
        ) {
          console.log("Authorize success");
          return { id: "1", name: "Admin", email: validEmail };
        }
        console.log("Authorize failed");
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
    error: '/admin/login', // Error code passed in url query string as ?error=
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
