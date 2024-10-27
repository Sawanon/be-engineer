import { login } from "@/lib/actions/user.actions";
import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
   providers: [
      CredentialsProvider({
         // The name to display on the sign in form (e.g. "Sign in with...")
         name: "credentials",
         // `credentials` is used to generate a form on the sign in page.
         // You can spaecify which fields should be submitted, by adding keys to the `credentials` object.
         // e.g. domain, username, password, 2FA token, etc.
         // You can pass any HTML attribute to the <input> tag through the object.
         credentials: {
            username: {
               label: "Username",
               type: "text",
               placeholder: "jsmith",
            },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials, req) {
            console.table(credentials);
            // Add logic here to look up the user from the credentials supplied
            const loginRes = await login({
               password: credentials?.password!,
               username: credentials?.username!,
            });
            
            if (loginRes) {
               console.log("login success", loginRes);
               // Any object returned will be saved in `user` property of the JWT
               return loginRes;
            } else {
               return null;
            }
         },
      }),
   ],
   callbacks: {
      async session({ session, token }: { session: Session; token: any }) {
         return session;
      },
      // async jwt(token, user, account, profile, isNewUser) {
      //    console.log("jwt", token, user);
      //    // Add logic here to generate JWT
      //    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      //    return token;
   },
   secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
