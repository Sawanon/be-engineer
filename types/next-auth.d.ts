import { DefaultSession, Session } from "next-auth";

declare module "next-auth" {
   interface Session {
      user: {
         id: number;
      } & DefaultSession["user"];
   }
}
