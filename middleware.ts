import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { redirect } from "next/navigation";
function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname;
   console.log("🚀 ~ middleware ~ pathname:", pathname)
   if(pathname.includes("/api/uploadthing")){
      console.log("pathname in if one", pathname);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-pathname", request.nextUrl.pathname);
      NextResponse.next({
         request: {
            headers: requestHeaders,
         },
      });
   }else if (pathname.startsWith("/api")) {
      console.log("pathname in if two", pathname);
   } else {
      console.log("middleware");
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-pathname", request.nextUrl.pathname);
      return NextResponse.next({
         request: {
            headers: requestHeaders,
         },
      });
      console.log("pathname", pathname);
      // if (pathname.startsWith("/login")) {
      //    redirect("/");
      // }
   }
}

export default withAuth(middleware, {
   callbacks: {
      authorized: (req) => {
         // TODO: JWT DATA
         const { token } = req;
         const pathName = req.req.nextUrl.pathname;

         console.log("28", pathName, token && pathName.startsWith("/login"));
         if(pathName.includes("/api/uploadthing")){
            return true
         }
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
