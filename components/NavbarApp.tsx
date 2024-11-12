"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import {
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { menuItems } from "@/lib/res/const";
import { signOut, useSession } from "next-auth/react";

const NavbarApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useSession();
  const pathName = usePathname();
  const currentMenu = () => {
    // return location.pathname.toString()
    const menu = menuItems.find((menuItem) => menuItem.path === pathName);
    if (!menu) return ``;
    return menu.name;
  };

  const isMenuActive = (menu: {name: string, path: string, icon: JSX.Element}) => {
    return pathName === menu.path;
  };

  const isLoginOrMenuPage = pathName === "/login" || pathName === "/"
  return (
    <Navbar
      // className={`md:hidden ${isOpen ? "bg-default-100" : "bg-backdrop bg-opacity-20 backdrop-blur-md"}`}
      className={`${isLoginOrMenuPage ? "hidden": ""} md:hidden ${isOpen ? "bg-default-100" : "bg-backdrop"}`}
      classNames={{
        // wrapper: "bg-backdrop"
        wrapper: "bg-transparent"
      }}
      isBlurred={true}
      disableAnimation
      isMenuOpen={isOpen}
      // isMenuOpen={true}
      onMenuOpenChange={setIsOpen}
    >
      <NavbarContent className="md:hidden pr-3" justify="start">
        <NavbarBrand className="gap-1 flex items-center">
          {/* <AcmeLogo /> */}
          <div className="w-[41px] h-7 rounded-lg">
            <svg width="41" height="28" viewBox="0 0 41 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.8481 24.5835C14.0146 24.5835 16.5815 22.0166 16.5815 18.8501C16.5815 15.6836 14.0146 13.1167 10.8481 13.1167C7.68168 13.1167 5.11475 15.6836 5.11475 18.8501C5.11475 22.0166 7.68168 24.5835 10.8481 24.5835Z" fill="white"/>
              <path d="M22.5212 21.2012C26.9861 21.2012 30.6057 17.5816 30.6057 13.1167C30.6057 8.65175 26.9861 5.03219 22.5212 5.03219C18.0562 5.03219 14.4366 8.65175 14.4366 13.1167C14.4366 17.5816 18.0562 21.2012 22.5212 21.2012Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M11.3546 16.5972C11.0395 16.5597 10.726 16.5892 10.4229 16.6874C9.27578 17.0584 8.6448 18.2929 9.01573 19.442C9.27578 20.2488 9.9921 20.8377 10.8361 20.939C11.1511 20.9758 11.4646 20.943 11.7678 20.8473C12.914 20.4746 13.545 19.2409 13.1765 18.0934C12.9148 17.2859 12.1969 16.6985 11.3546 16.5972Z" fill="black"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M23.4449 13.8749L21.3626 15.3542C21.2535 15.4322 21.1635 15.3852 21.1635 15.2506V12.2164C21.1635 12.081 21.2535 12.0332 21.3626 12.112L23.4449 13.5921C23.554 13.6694 23.554 13.7968 23.4449 13.8749ZM23.3509 10.295C22.8548 10.1094 22.3301 10.0345 21.7973 10.0751C19.7811 10.2225 18.261 11.9862 18.4059 14.0055C18.5126 15.4274 19.4427 16.6741 20.7805 17.1736C21.2742 17.36 21.8005 17.4365 22.3348 17.3958C24.3543 17.2461 25.8752 15.484 25.7287 13.4654C25.6235 12.0419 24.6887 10.7968 23.3509 10.295Z" fill="black"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M28.6764 14.6455L27.8628 14.7058C27.7613 15.2736 27.5781 15.8136 27.3251 16.3186L27.9461 16.8555C28.3331 17.1874 28.3759 17.7726 28.0428 18.1602L27.3664 18.9447C27.2046 19.1305 26.981 19.2457 26.7359 19.2639C26.4877 19.283 26.2506 19.202 26.0634 19.0408L25.4465 18.504C24.9849 18.8288 24.4758 19.0877 23.9278 19.2703L23.9873 20.085C24.0246 20.5933 23.6416 21.0387 23.134 21.0761L22.1015 21.1531C21.5924 21.1904 21.1483 20.8061 21.1118 20.2971L21.0523 19.4831C20.4845 19.3823 19.9437 19.2004 19.4393 18.9463L18.904 19.5681C18.7423 19.7547 18.5163 19.869 18.2704 19.8865C18.0254 19.9032 17.7859 19.8238 17.5995 19.661L16.8136 18.9868C16.6289 18.8256 16.5147 18.5993 16.4972 18.3539C16.479 18.1054 16.5567 17.8671 16.7177 17.6805L17.2538 17.0619C16.9318 16.5998 16.6717 16.0907 16.4909 15.5404L15.6764 15.6024C15.1673 15.6397 14.7224 15.2546 14.6875 14.7448L14.6122 13.7132C14.5757 13.205 14.9572 12.7595 15.4655 12.7222L16.2791 12.6618C16.3814 12.0925 16.5623 11.5493 16.8136 11.049L16.1951 10.5114C16.0095 10.3518 15.8977 10.1255 15.8787 9.87933C15.8604 9.63237 15.9397 9.39335 16.1015 9.20753L16.7764 8.42138C17.0999 8.04736 17.7082 8.00289 18.0801 8.32767L18.6971 8.8613C19.1602 8.5389 19.6669 8.28082 20.2165 8.0958L20.157 7.28185C20.1197 6.77204 20.5012 6.32814 21.0103 6.29082L22.0373 6.21617C22.5456 6.17965 22.9897 6.56081 23.027 7.07062L23.0864 7.88616C23.6542 7.9878 24.1959 8.16806 24.6987 8.42138L25.2347 7.7996C25.5551 7.42479 26.1634 7.38191 26.5377 7.70272L27.3212 8.38247C27.7066 8.71837 27.7486 9.30123 27.4155 9.68875L26.8818 10.3066C27.2046 10.7703 27.4639 11.2785 27.6447 11.8272L28.4623 11.7669C28.9699 11.728 29.4148 12.1131 29.4528 12.6229L29.5289 13.6545C29.5662 14.1619 29.184 14.6082 28.6764 14.6455ZM14.9572 19.6284C15.2284 19.7666 15.3354 20.1017 15.1959 20.3701L14.9167 20.9196C14.8517 21.0499 14.7367 21.1483 14.5964 21.192C14.4576 21.2389 14.3109 21.2269 14.1792 21.1579L13.7462 20.9379C13.5234 21.1888 13.268 21.4096 12.9762 21.5938L13.1261 22.056C13.2197 22.3442 13.0579 22.6547 12.7708 22.7492L12.1856 22.9374C11.8993 23.0311 11.5876 22.8723 11.4933 22.5817L11.345 22.1211C11.004 22.1425 10.6653 22.1132 10.3402 22.0393L10.1182 22.4705C10.0531 22.6023 9.93814 22.7 9.80016 22.7437C9.65979 22.7913 9.5115 22.7786 9.38065 22.7111L8.83109 22.43C8.70103 22.3633 8.60349 22.2482 8.56067 22.1084C8.51229 21.9694 8.52419 21.8201 8.59318 21.6867L8.81443 21.2563C8.56225 21.034 8.34179 20.7759 8.15781 20.4853L7.69627 20.6338C7.40999 20.7306 7.09833 20.571 7.00634 20.2812L6.81681 19.6967C6.72324 19.4077 6.88263 19.0972 7.1705 19.0019L7.63362 18.8542C7.61063 18.5135 7.63759 18.1737 7.71372 17.8481L7.28152 17.6265C7.15226 17.5614 7.05472 17.4479 7.01031 17.3073C6.96273 17.1659 6.97621 17.0182 7.04362 16.8864L7.32355 16.3393C7.45757 16.0757 7.80333 15.9621 8.06423 16.0987L8.49643 16.3202C8.71689 16.0661 8.97462 15.8446 9.26408 15.6603L9.11657 15.199C9.02379 14.9123 9.18319 14.5986 9.47105 14.5073L10.0547 14.3183C10.345 14.2238 10.6542 14.3826 10.7478 14.6717L10.8953 15.1339C11.2379 15.1124 11.5773 15.1418 11.9009 15.2164L12.1221 14.7837C12.2554 14.5208 12.5971 14.4112 12.8596 14.5431L13.41 14.8242C13.6804 14.9623 13.7875 15.2943 13.6487 15.5666L13.4274 15.9978C13.678 16.2202 13.9001 16.4767 14.0825 16.7697L14.544 16.6204C14.8335 16.5267 15.142 16.6863 15.2379 16.9754L15.4195 17.5598C15.5123 17.8465 15.3537 18.1586 15.065 18.2531L14.6043 18.4016C14.6257 18.743 14.5987 19.0789 14.5226 19.4085L14.9572 19.6284ZM39.0301 15.0735C37.9635 13.9308 36.5773 13.1709 35.0674 12.885C34.977 11.3182 34.6249 9.79992 34.0135 8.35705C33.3259 6.72678 32.341 5.26405 31.0872 4.0078C29.8327 2.75233 28.3703 1.76607 26.7439 1.07679C25.0587 0.361313 23.2672 0 21.4251 0C18.7891 0 16.2316 0.753596 14.0278 2.179C12.0404 3.46225 10.4243 5.22911 9.3291 7.31361C6.89374 7.47958 4.62649 8.51905 2.89611 10.2716C1.02776 12.1616 0 14.6685 0 17.3279C0 20.0009 1.03806 22.5181 2.92228 24.4121C4.63442 26.1337 6.86043 27.158 9.25773 27.3375L9.26883 27.3883H34.314L34.3212 27.3415C36.0373 27.2009 37.6305 26.4624 38.862 25.2292C40.2379 23.8483 41 22.0123 41 20.0612C40.9952 18.203 40.2982 16.4338 39.0301 15.0735Z" fill="black"/>
            </svg>
          </div>
          <div className="text-default-300 text-xl font-light font-IBM-Thai">
            /
          </div>
          <p className="font-bold text-xl font-IBM-Thai text-default-foreground">{currentMenu()}</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="md:hidden" justify="end">
        <NavbarMenuToggle
          // onClick={() => setIsOpen(prev => !prev)}
          className="text-default-foreground"
          icon={(isOpen) => {
            if (isOpen) {
              return <X size={32} />;
            }
            return <Menu size={32} />;
          }}
        />
      </NavbarContent>

      <NavbarMenu className="bg-default-100 font-sans">
        <div className="flex-1 flex flex-col">
          <div className="space-y-2 flex-1">
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item.name}-${index}`}>
                <div>
                  <Link href={`${item.path}`}>
                    <div
                      className={`flex gap-2 items-center rounded-lg w-max p-1 ${
                        isMenuActive(item)
                          ? "text-default-foreground shadow-neutral-sm-app"
                          : "text-default-600"
                      }`}
                    >
                      {item.icon}
                      <div className="text-lg font-semibold">{item.name}</div>
                    </div>
                  </Link>
                </div>
              </NavbarMenuItem>
            ))}
          </div>
          <div className={`border-y border-zinc-200 p-app flex gap-app`}>
            <div className="flex flex-1 items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center">
                <User size={24} fill="#000" />
              </div>
              <div className="text-lg font-semibold">
                {auth.data?.user.username}
              </div>
            </div>
            <div onClick={() => signOut()} className="p-1 cursor-pointer">
              <LogOut size={24} />
            </div>
          </div>
        </div>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavbarApp;
