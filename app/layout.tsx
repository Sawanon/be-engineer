import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./provider";
import NavbarApp from "@/components/NavbarApp";
import SidebarApp from "@/components/SidebarApp";
import {
   IBM_Plex_Sans_Thai,
   IBM_Plex_Sans_Thai_Looped,
 } from "next/font/google";
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


export const ibmPlexSansThai = IBM_Plex_Sans_Thai({
   subsets: ["thai", "latin", "latin-ext"],
   variable: "--ibm-sans",
   weight: ["100", "200", "300", "400", "500", "600", "700"],
 });
 
 export const ibmPlexSansThaiLoop = IBM_Plex_Sans_Thai_Looped({
   subsets: ["thai", "latin", "latin-ext"],
   variable: "--ibm-serif",
   weight: ["100", "200", "300", "400", "500", "600", "700"],
 });


export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         {/* <body className="flex flex-col"> */}
         <body className={`flex flex-col ${ibmPlexSansThai.variable} ${ibmPlexSansThaiLoop.variable} antialiased`}>
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