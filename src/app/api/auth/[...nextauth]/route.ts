import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Tolong isi username dan password!");
        }

        // Cari user di database Supabase
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user) {
          throw new Error("Username tidak ditemukan.");
        }

        // Cek kecocokan password dengan bcrypt
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Password salah.");
        }

        // Jika sukses, kembalikan data user untuk disimpan di Session
        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          role: user.role, // Membawa role (asesi/asesor/admin) ke session
        };
      }
    })
  ],
  callbacks: {
    // Menyisipkan data tambahan (id, role, username) ke JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    // Menyisipkan data dari JWT ke Session yang bisa dibaca oleh Frontend
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', 
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };