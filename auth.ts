import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { password: { type: "password" } },
      async authorize({ password }) {
        if (password === process.env.ADMIN_PASSWORD) {
          return { id: "admin", name: "Admin" };
        }
        return null;
      },
    }),
  ],
});
