"use client";
import { getUserData, signOut } from "@/service/auth";
import {
  IconBrandX,
  IconBrandYoutube,
  IconFileText,
  IconHash,
  IconLayoutDashboard,
  IconLink,
  IconLogout,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps = {}) {
  const pathName = usePathname();
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-2 p-6">
        <div className="flex items-center gap-2">
          <img src="/brainly.png" alt="Brainly Logo" className="h-8 w-auto" />
          <h1 className="text-2xl font-semibold text-purple-900">Brainly</h1>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 md:hidden"
          >
            <IconX className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navLinks.map((link, index) => (
          <Link
            href={link.href}
            key={index}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-purple-100 hover:text-purple-800 ${pathName === link.href ? "bg-purple-100 text-purple-800" : ""}`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
          <svg
            className="mr-3 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {getUserData()?.userName}
        </button>

        <button
          onClick={() => signOut()}
          className="mt-2 flex w-full items-center gap-1 rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <IconLogout /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export const navLinks = [
  {
    name: "All Content",
    href: "/",
    icon: <IconLayoutDashboard className="h-7 w-7" />,
  },
  {
    name: "Tweets",
    href: "/tweets",
    icon: <IconBrandX className="h-7 w-7" />,
  },
  {
    name: "Videos",
    href: "/videos",
    icon: <IconBrandYoutube className="h-7 w-7" />,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: <IconFileText className="h-7 w-7" />,
  },
  {
    name: "Links",
    href: "/links",
    icon: <IconLink className="h-7 w-7" />,
  },
  {
    name: "Tags",
    href: "/tags",
    icon: <IconHash className="h-7 w-7" />,
  },
];
