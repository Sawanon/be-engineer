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
            primary: {
               DEFAULT: "var(--nextui-default-foreground)",
               foreground: "#FFFFFF",
               warning  : "#F5A524"
            },
            secondary: {
               DEFAULT: "var(--secondary)",
               foreground: "#00000",
            },
            'secondary-default': `#393E44`,
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
         }
      },
   },
   important: true,
   darkMode: "class",
   plugins: [nextui({
      addCommonColors: true,
      //TODO: config color primary calendar this here
      // themes: {
      //    light: {
      //       colors: {
      //          default: 'black',
      //       }
      //    }
      // }
      themes: {
         light: {
           // ...
           colors: {
               // background: "#000000",
            // foreground: "#ECEDEE",
            primary: {
              //... 50 to 900
              foreground: "#FFFFFF",
              DEFAULT: "#000000",
            //   50:   "#000000",
            //   100:  "#000000",
            //   200:  "#000000",
            //   300:  "#000000",
            //   400:  "#000000",
            //   500:  "#000000",
            //   600:  "#000000",
            //   700:  "#000000",
            //   800:  "#000000",
            //   900:  "#000000",
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
