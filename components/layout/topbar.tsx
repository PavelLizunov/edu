"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CategoryConfig, TopicMeta } from "@/types/content";
import { T } from "@/components/i18n/t";
import { LangToggle } from "@/components/i18n/lang-toggle";
import { MobileDrawer } from "@/components/layout/mobile-drawer";

interface TopbarProps {
  topics: TopicMeta[];
  categories: readonly CategoryConfig[];
}

export function Topbar({ topics, categories }: TopbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={scrolled ? "topbar scrolled" : "topbar"} id="topbar">
        <Link href="/" className="brand-sticker" aria-label="edu.ninitux">
          <span className="star">★</span> edu.ninitux
        </Link>
        <a className="back" href="https://ninitux.com">
          ←&nbsp;
          <T ru="ninitux.com" en="ninitux.com" />
        </a>
        <nav className="nav" aria-label="primary">
          <Link className="nl" href="/#cats">
            <T ru="категории" en="categories" />
          </Link>
          <Link className="nl" href="/#topics">
            <T ru="темы" en="topics" />
          </Link>
          <Link className="nl" href="/devops/kubernetes">
            <T ru="пример темы" en="example topic" />
          </Link>
          <LangToggle />
        </nav>
        <div className="nav-mobile">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Открыть меню"
          >
            ≡
          </button>
        </div>
      </header>
      {drawerOpen && (
        <MobileDrawer
          topics={topics}
          categories={categories}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}
