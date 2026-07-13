"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 text-sm font-semibold text-text hover:bg-surface-muted"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-primary font-mono text-xs font-bold text-ink">
          {initials(user.name)}
        </span>
        <span className="hidden sm:inline">{user.name}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-56 rounded-md border border-border bg-surface py-1.5 shadow-lg"
        >
          <div className="border-b border-border px-3.5 py-2.5">
            <p className="truncate text-sm font-semibold text-text">
              {user.name}
            </p>
            <p className="truncate text-xs text-text-muted">{user.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-3.5 py-2.5 text-left text-sm font-semibold text-error hover:bg-error-surface disabled:opacity-50"
          >
            {isLoggingOut ? "Déconnexion…" : "Déconnexion"}
          </button>
        </div>
      )}
    </div>
  );
}
