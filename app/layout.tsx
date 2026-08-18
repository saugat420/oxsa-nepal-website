import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Footer, Header } from "@/src/components/SiteChrome";
import { siteConfig } from "@/src/config/site";
import "./globals.css";

const inter = Inter({ subsets:["latin"], variable:"--font-body" });
const manrope = Manrope({ subsets:["latin"], variable:"--font-heading" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default:"OXSA Nepal | Animal Welfare Society", template:"%s | OXSA Nepal" },
  description: siteConfig.description,
  icons: { icon:"/images/logo/oxsa-logo.jpg", apple:"/images/logo/oxsa-logo.jpg" },
  openGraph: { type:"website", siteName:"OXSA Nepal", title:"OXSA Nepal | Animal Welfare Society", description:siteConfig.description, images:[{url:"/og.png",width:1536,height:910,alt:"OXSA Nepal — safety, care and kindness for street animals"}] },
  twitter: { card:"summary_large_image", title:"OXSA Nepal", description:siteConfig.description, images:["/og.png"] },
};

export default function RootLayout({children}:{children:React.ReactNode}){
  const org={"@context":"https://schema.org","@type":"NGO",name:siteConfig.name,url:siteConfig.url,email:siteConfig.email,telephone:siteConfig.phone,address:[{"@type":"PostalAddress",streetAddress:siteConfig.office,addressLocality:"Lalitpur",addressCountry:"NP"},{"@type":"PostalAddress",streetAddress:siteConfig.shelter,addressLocality:"Lalitpur",addressCountry:"NP"}]};
  return <html lang="en"><body className={`${inter.variable} ${manrope.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(org)}}/><Header/><main id="main">{children}</main><Footer/></body></html>;
}
