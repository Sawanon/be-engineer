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
      fontFamily :{ 
         sans: ["var(--ibm-sans)", "Helvetica", "Arial"],
         serif: ["var(--ibm-serif)", "Times New Roman"],
      },
      extend: {
         colors: {
            // primary: {
            //    DEFAULT: "var(--nextui-default-foreground)",
            //    foreground: "#FFFFFF",
            //    warning  : "#F5A524"
            // },
            // secondary: {
            //    DEFAULT: "var(--secondary)",
            //    foreground: "#00000",
            // },
            'secondary-default': `#393E44`,
            'secondary-fade': `#9098A2`,
            'secondary-light': `#6C7074`,
            background: "var(--background)",
            foreground: "var(--foreground)",
            backdrop: `rgba(255,255,255,0.85)`,
         },
         fontFamily: {
            'IBM-Thai': 'IBM Plex Sans Thai',
            'IBM-Thai-Looped': 'IBM Plex Sans Thai Looped',
            sans: ["var(--ibm-sans)", "Helvetica", "Arial"],
            serif: ["var(--ibm-serif)", "Times New Roman"],
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
            'neutral-base': `0px 1px 2px 0px rgba(0,0,0,0.06), 0px 1px 3px 0px rgba(0,0,0,0.1)`,
            'nextui-md': `0px 2px 30px 0px rgba(0,0,0,0.08), 0px 0px 1px 0px rgba(0,0,0,0.3), 0px 0px 15px 0px rgba(0,0,0,0.03)`,
         }
      },
   },
   important: true,
   darkMode: "class",
   plugins: [nextui({
      addCommonColors: true,
      themes: {
         light: {
           // ...
           colors: {
               // background: "#000000",
            // foreground: "#ECEDEE",
            primary: {
               50: "#FAFAFA",
               100: "#F4F4F5",
               200: "#E4E4E7",
               300: "#D4D4D8",
               400: "#A1A1AA",
               500: "#71717A",
               600: "#52525B",
               700: "#3F3F46",
               800: "#27272A",
               900: "#000000",
               foreground: "#FFFFFF",
               DEFAULT: "#000000",
            },

           },
         },
         dark: {
           // ...
           colors: {},
         },
         // ... custom themes
       },
   })],
};
export default config;
