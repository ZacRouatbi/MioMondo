"use client";

import { motion } from "framer-motion";
import { LogOut, Package, Settings, Loader2 } from "lucide-react";
import { UserDropdownProps } from "@/types/user";

export default function UserDropdown({ user, onLogout }: UserDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-4 w-72 bg-snow border border-jet/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden z-[100]"
    >
      {/* Header Section */}
      <div className="p-6 bg-lavender/20 border-b border-jet/5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-jet/40 font-bold mb-2">
          Logged in as
        </p>
        <p 
          className="text-[15px] text-jet font-medium truncate" 
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {user.name || user.email.split('@')[0]}
        </p>
        <p className="text-xs text-jet/50 truncate">{user.email}</p>
      </div>

      {/* Menu Links */}
      <div className="p-2">
        <DropdownLink 
          icon={<Package size={16} strokeWidth={1.5} />} 
          label="My Orders" 
          href="/account/orders" 
        />
        <DropdownLink 
          icon={<Settings size={16} strokeWidth={1.5} />} 
          label="Settings" 
          href="/account/settings" 
        />
        
        <div className="my-2 border-t border-jet/5" />
        
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-[13px] text-red-500/80 hover:text-red-500 hover:bg-red-50/50 transition-all rounded-xl group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut 
            size={16} 
            strokeWidth={1.5} 
            className="group-hover:translate-x-1 transition-transform" 
          />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
}

function DropdownLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 text-[13px] text-jet/70 hover:text-jet hover:bg-lavender/40 transition-all rounded-xl group"
    >
      <span className="text-jet/30 group-hover:text-[#FFCA68] transition-colors">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </a>
  );
}