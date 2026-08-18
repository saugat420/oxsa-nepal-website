"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
import { exploreNav, nav } from "@/src/config/site";
import { NativeLink as Link } from "./NativeLink";

export function HeaderNav() {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenus(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExploreOpen(false);
        setMobileOpen(false);
      }
    }

    function closeExplore(event: PointerEvent) {
      if (!exploreRef.current?.contains(event.target as Node)) setExploreOpen(false);
    }

    document.addEventListener("keydown", closeMenus);
    document.addEventListener("pointerdown", closeExplore);
    return () => {
      document.removeEventListener("keydown", closeMenus);
      document.removeEventListener("pointerdown", closeExplore);
    };
  }, []);

  function closeAll() {
    setExploreOpen(false);
    setMobileOpen(false);
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="OXSA Nepal home" onClick={closeAll}>
          <Image src="/images/logo/oxsa-logo.jpg" alt="OXSA Nepal paw logo" width={62} height={62} priority />
          <span><b>OXSA Nepal</b><small>Animal Welfare Society</small></span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.slice(0, 6).map(([label, href]) => <Link key={href} href={href} onClick={closeAll}>{label}</Link>)}
          <div className="nav-dropdown" ref={exploreRef}>
            <button
              className="nav-dropdown-trigger"
              type="button"
              aria-expanded={exploreOpen}
              aria-controls="explore-menu"
              onClick={() => setExploreOpen(open => !open)}
            >
              Explore <ChevronDown aria-hidden="true" />
            </button>
            {exploreOpen && <div id="explore-menu" className="nav-dropdown-menu">
              {exploreNav.map(([label, href]) => <Link key={href} href={href} onClick={closeAll}>{label}</Link>)}
            </div>}
          </div>
          <Link href="/contact" onClick={closeAll}>Contact</Link>
        </nav>

        <div className="header-actions">
          <Link className="button button-small" href="/donate" onClick={closeAll}><Heart aria-hidden="true" /> Donate Now</Link>
          <div className="mobile-menu">
            <button
              className="menu-toggle"
              type="button"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen(open => !open)}
            >
              {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
            {mobileOpen && <>
              <button className="menu-backdrop" type="button" aria-label="Close navigation" onClick={closeAll} />
              <div className="mobile-panel" id="mobile-navigation">
                <nav aria-label="Mobile navigation">
                  {nav.map(([label, href]) => <Link key={href} href={href} onClick={closeAll}>{label}</Link>)}
                  <span className="mobile-section">Explore</span>
                  {exploreNav.map(([label, href]) => <Link key={href} href={href} onClick={closeAll}>{label}</Link>)}
                </nav>
              </div>
            </>}
          </div>
        </div>
      </div>
    </header>
  </>;
}
