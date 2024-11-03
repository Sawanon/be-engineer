"use client"
import { menuItems } from '@/lib/res/const'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const SidebarApp = () => {
  const pathName = usePathname()

  const isMenuActive = (menu: {name: string, path: string, icon: JSX.Element}) => {
    return pathName === menu.path;
  };

  const isLoginOrMenuPage = pathName === "/login" || pathName === "/"
  return (
    <div className={`${isLoginOrMenuPage ? "hidden": "md:flex"} hidden md:flex-col w-64 min-w-64 h-screenDevice bg-default-100`}>
        <div className={`flex-1 py-3 px-app`}>
            <div className='flex gap-2'>
                <div className='w-[46.86px] h-8 rounded-lg bg-gray-400'>
                </div>
                <div className='text-2xl font-bold'>
                    be-engineer
                </div>
            </div>
            <div className={`mt-app space-y-2 font-IBM-Thai`}>
                {menuItems.map((item, index) => (
                    <div key={`${item}-${index}`}>
                        <Link href={`${item.path}`}>
                            <div
                              className={`flex gap-2 items-center rounded-lg w-max p-1 ${
                                  isMenuActive(item)
                                  ? "text-default-foreground bg-default-50 shadow-neutral-sm-app font-semibold"
                                  : "text-default-600"
                              }`}
                              >
                              {item.icon}
                              <div className="text-lg">{item.name}</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
        <div className='flex px-app py-2'>
            <div className='flex-1 flex gap-1 items-center'>
                <div className={`w-8 h-8 rounded-full bg-gray-300`}></div>
                <div className={`font-semibold text-default-600 text-lg`}>Username</div>
            </div>
            <div onClick={() => signOut()} className={`p-1 cursor-pointer`}>
                <LogOut size={24} />
            </div>
        </div>
    </div>
  )
}

export default SidebarApp