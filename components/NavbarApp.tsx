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
  BookOpen,
  Box,
  LogOut,
  Menu,
  MonitorPlay,
  Package,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { menuItems } from "@/lib/res/const";

const NavbarApp = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  return (
    <Navbar
      // className={`md:hidden ${isOpen ? "bg-default-100" : "bg-backdrop bg-opacity-20 backdrop-blur-md"}`}
      className={`md:hidden ${isOpen ? "bg-default-100" : "bg-backdrop"}`}
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
          <div className="w-[41px] h-7 bg-gray-400 rounded-lg"></div>
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

      <NavbarMenu className="bg-default-100 font-IBM-Thai">
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
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="text-lg font-semibold">Name</div>
            </div>
            <div onClick={() => alert("logout")} className="p-1 cursor-pointer">
              <LogOut size={24} />
            </div>
          </div>
        </div>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavbarApp;
