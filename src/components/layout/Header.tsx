"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

/**
 * Sticky header: transparent over the hero, solid once the page scrolls past it.
 * Active-section indicator tracks whichever nav target is currently in view.
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string>(siteConfig.nav[0].href);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = siteConfig.nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHref(`#${visible.target.id}`);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 text-brand-black transition-colors duration-500",
        isScrolled || mobileOpen
          ? "border-b border-brand-border bg-brand-white/90 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="#home" className="text-lg font-semibold tracking-[0.18em]">
          ADINN
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative py-2 text-sm font-medium transition-opacity",
                activeHref === item.href
                  ? "text-brand-red opacity-100"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              {item.label}
              {activeHref === item.href && (
                <span className="absolute inset-x-0 -bottom-0.5 h-px bg-brand-red" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#enquiry"
            className="hidden rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-brand-white transition-transform hover:scale-[1.03] lg:inline-flex lg:min-h-[44px] lg:items-center"
          >
            Get a Quote
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full text-brand-black lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} aria-hidden />
          </button>
        </div>
      </div>

      <MobileNavigation open={mobileOpen} onClose={closeMobileMenu} activeHref={activeHref} />
    </header>
  );
}
