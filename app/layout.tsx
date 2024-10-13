import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./provider";
import NavbarApp from "@/components/NavbarApp";
import SidebarApp from "@/components/SidebarApp";
const geistSans = localFont({
   src: "./fonts/GeistVF.woff",
   variable: "--font-geist-sans",
   weight: "100 900",
});
const geistMono = localFont({
   src: "./fonts/GeistMonoVF.woff",
   variable: "--font-geist-mono",
   weight: "100 900",
});

export const metadata: Metadata = {
   title: "Be-engineer",
   description: "Course",
};





export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className="flex flex-col">
            <Providers>
               <div className="md:flex">
                  <NavbarApp />
                  <SidebarApp />
                  <div className="md:flex-1 overflow-x-auto">
                     {children}
                  </div>
               </div>
            </Providers>
         </body>
      </html>
   );
}