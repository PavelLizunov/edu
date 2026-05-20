"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface SidebarLinkProps {
  href: string;
  children: ReactNode;
  disabled?: boolean;
}

export function SidebarLink({ href, children, disabled = false }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = !disabled && (pathname === href || (href !== "/" && pathname.startsWith(href)));

  if (disabled) {
    return (
      <span className="sidebar-link" data-disabled="true" aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="sidebar-link"
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
