import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="app-header">
      <Link href="/" className="brand">
        <Image
          src="/penguin.png"
          alt=""
          aria-hidden="true"
          width={22}
          height={22}
          className="brand-mascot"
          priority
        />
        <span>edu.ninitux</span>
      </Link>
      <span className="brand-meta">part of ninitux.com</span>
      <ThemeToggle />
    </header>
  );
}
