import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/src/config/site";
import { HeaderNav } from "./HeaderNav";

export function Header() {
  return <HeaderNav />;
}

export function Footer() {
  const year = new Date().getFullYear();
  return <footer className="footer"><div className="container footer-grid">
    <div className="footer-brand"><Image src="/images/logo/oxsa-logo.jpg" alt="" width={72} height={72}/><h2>OXSA Nepal</h2><p>Working for safer, healthier lives for street animals through practical care and community compassion.</p></div>
    <FooterLinks title="Quick Links" links={[["About","/about"],["Our Work","/our-work"],["Adopt","/adopt"],["Sponsor","/sponsor"],["Donate","/donate"]]}/>
    <FooterLinks title="Helpful Resources" links={[["Success Stories","/stories"],["Blog","/blog"],["FAQ","/faq"],["Vet Centres","/vet-centres"],["Wishlist","/wishlist"]]}/>
    <div><h3>Contact</h3><address><a href={`tel:${siteConfig.phone}`}><Phone/>{siteConfig.phone}</a><a href={`mailto:${siteConfig.email}`}><Mail/>{siteConfig.email}</a><span><MapPin/>{siteConfig.shelter}</span><span><MapPin/>{siteConfig.office}</span></address></div>
  </div><div className="container copyright">© {year} OXSA Nepal Animal Welfare Society. All rights reserved.</div></footer>;
}

function FooterLinks({ title, links }: { title: string; links: readonly (readonly [string,string])[] }) {
  return <div><h3>{title}</h3><ul className="footer-links">{links.map(([label,href])=><li key={href}><Link href={href}>{label}</Link></li>)}</ul></div>;
}

export function PageHero({ eyebrow, title, children, actions }: { eyebrow?: string; title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return <section className="page-hero"><div className="container narrow"><p className="eyebrow">{eyebrow ?? "OXSA Nepal"}</p><h1>{title}</h1><div className="hero-copy">{children}</div>{actions && <div className="button-row">{actions}</div>}</div></section>;
}

export function PawPlaceholder({ name, species = "Animal" }: { name: string; species?: string }) {
  return <div className="paw-placeholder" role="img" aria-label={`${name}, ${species}; photo coming soon`}><span>♥</span><b>{name}</b><small>Photo coming soon</small></div>;
}

export function Breadcrumb({ items }: { items: [string,string?][] }) {
  return <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link>{items.map(([label,href]) => <span key={label}>/ {href ? <Link href={href}>{label}</Link> : label}</span>)}</nav>;
}

export function CTA() {
  return <section className="cta-band"><div className="container"><p className="eyebrow">One compassionate choice</p><h2>A kinder community starts with all of us.</h2><p>Choose the way to help that fits your life today.</p><div className="button-row centered"><Link className="button" href="/donate">Donate</Link><Link className="button button-light" href="/sponsor">Sponsor</Link><Link className="button button-light" href="/adopt">Adopt</Link></div></div></section>;
}
