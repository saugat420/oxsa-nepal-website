import type { MetadataRoute } from "next";
import { animals,blog,stories } from "@/src/content/data";
import { siteConfig } from "@/src/config/site";
export default function sitemap():MetadataRoute.Sitemap{const paths=["","/about","/our-work","/donate","/sponsor","/sponsor/apply","/adopt","/stories","/blog","/wishlist","/vet-centres","/faq","/media","/contact",...animals.map(x=>`/sponsor/${x.slug}`),...stories.map(x=>`/stories/${x.slug}`),...blog.map(x=>`/blog/${x.slug}`)];return paths.map(path=>({url:`${siteConfig.url}${path}`,lastModified:new Date(),changeFrequency:path.includes("/")?"monthly":"weekly",priority:path===""?1:.7}))}
