import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { redirect } from "next/navigation";
function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname;
   if (pathname.startsWith("/api")) {
   } else {
      console.log("middleware");
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-pathname", request.nextUrl.pathname);
      NextResponse.next({
         request: {
            headers: requestHeaders,
         },
      });
      console.log('pathname', pathname)
      if (pathname.startsWith("/login")) {
         redirect("/");
      }
   }
}

export default withAuth(middleware, {
   callbacks: {
      authorized: (req) => {
         // TODO: JWT DATA
         const { token } = req;
         const pathName = req.req.nextUrl.pathname;

         console.log("28", pathName, token && pathName.startsWith("/login"));
         if (token && pathName.startsWith("/login")) {
            redirect("/");
         }
         if (!token) {
            return false;
         }
         return true;
      },
   },
   pages: {
      signIn: "/login",
      error: "/login",
   },
});
