import { login } from "@/lib/actions/user.actions";
import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
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
            // Add logic here to look up the user from the credentials supplied
            const loginRes = await login({
               password: credentials?.password!,
               username: credentials?.username!,
            });

            if (loginRes) {
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
         session.user.username = token.username;
         session.user.firstName = token.firstName;
         session.user.lastName = token.lastName;
         session.user.id = token.id;
         return session;
      },
      async jwt({ token, user }: { token: any; user: any }) {
         if (token.username === undefined) {
            token.id = user.id
            token.username = user.username;
            token.firstName = user.firstName;
            token.lastName = user.lastName;
         }
         // console.log('token', token)
         return Promise.resolve(token);
      },
   },
   secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
