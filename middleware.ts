import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname;
   if (pathname.startsWith("/api")) {
   } else {
      console.log("middleware");
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-pathname", request.nextUrl.pathname);
      return NextResponse.next({
         request: {
            headers: requestHeaders,
         },
      });
   }
}
