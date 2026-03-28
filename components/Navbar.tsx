"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Map, Compass, Upload } from "lucide-react";

const links = [
  { href: "/", label: "Map", icon: Map },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/submit", label: "Add Spot", icon: Upload },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-sm border-b border-stone-700">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center h-14 gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg tracking-tight flex-shrink-0">
          <Camera className="w-5 h-5 text-amber-400" />
          <span className="hidden xs:inline">India<span className="text-amber-400">Lens</span></span>
          <span className="xs:hidden"><span className="text-amber-400">IL</span></span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1 ml-auto">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                path === href
                  ? "bg-amber-500 text-stone-900"
                  : "text-stone-300 hover:text-white hover:bg-stone-700"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
