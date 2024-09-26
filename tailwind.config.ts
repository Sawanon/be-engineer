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
            },
            secondary: {
               DEFAULT: "var(--secondary)",
               foreground: "#00000",
            },
            background: "var(--background)",
            foreground: "var(--foreground)",
         },
         fontFamily: {
            'IBM-Thai': 'IBM Plex Sans Thai',
            'IBM-Thai-Looped': 'IBM Plex Sans Thai Looped',
         },
         height: {
            screenDevice: "100dvh",
         }
      },
   },
   important: true,
   darkMode: "class",
   plugins: [nextui({})],
};
export default config;
