const { nextui } = require("@nextui-org/react");
import type { Config } from "tailwindcss";

const config: Config = {
   content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./ui/**/*.{js,ts,jsx,tsx,mdx}",
      "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      extend: {
         colors: {
            primary: {
               DEFAULT: "var(--primary)",
               foreground: "#FFFFFF",
               warning  : "#F5A524"
            },
            secondary: {
               DEFAULT: "var(--secondary)",
               foreground: "#00000",
            },
            background: "var(--background)",
            foreground: "var(--foreground)",
            backdrop: `rgba(255,255,255,0.85)`,
         },
         fontFamily: {
            'IBM-Thai': 'IBM Plex Sans Thai',
            'IBM-Thai-Looped': 'IBM Plex Sans Thai Looped',
         },
         height: {
            screenDevice: "100dvh",
         },
         spacing: {
            'app': '14px',
         },
         width: {
            'menu-button': '269px',
         },
         boxShadow: {
            'nextui-large': `0px 0px 1px 0px rgba(0,0,0,0.3), 0px 2px 30px 0px rgba(0,0,0,0.08), 0px 0px 15px 0px rgba(0,0,0,0.03)`,
            'neutral-sm-app': `0px 1px 2px 0px rgba(0,0,0,0.05)`,
         }
      },
   },
   important: true,
   darkMode: "class",
   plugins: [nextui({
      //TODO: config color primary calendar this here
   })],
};
export default config;
