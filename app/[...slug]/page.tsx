import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { animals, blog, stories } from "@/src/content/data";
import { AboutPage, AdoptPage, ArticlePage, BlogPage, ContactPage, DonatePage, FAQPage, MediaPage, SponsorApplyPage, SponsorPage, SponsorProfile, StoriesPage, VetPage, WishlistPage, WorkPage } from "@/src/components/Pages";

const meta: Record<string,[string,string]>={
  about:["Our Story","Learn how a dog named Oxsa inspired an animal-welfare organization in Lalitpur."],
  "our-work":["Our Work","Spaying and neutering, adoption, feeding, vaccination and awareness."],
  donate:["Donate","Verified ways to donate directly to Oxsa Nepal."], sponsor:["Sponsor an Animal","Support an Oxsa Nepal shelter animal each month."],
  adopt:["Adopt","Learn about responsible adoption and submit an application."], stories:["Stories of Compassion","Read Oxsa Nepal's animal-welfare success stories."],
  blog:["Blog","Animal-welfare education and stories from Oxsa Nepal."], wishlist:["Shelter Wishlist","Practical supplies that help Oxsa Nepal care for animals."],
  "vet-centres":["Veterinary Centres","Search a practical directory of veterinary centres in Nepal."], faq:["FAQ","Answers to common animal-welfare questions."],
  media:["Media","Oxsa Nepal stories and interviews in Nepali media."], contact:["Contact","Email or visit Oxsa Nepal in Lalitpur."],
};

export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}):Promise<Metadata>{const {slug}=await params;const root=slug[0];let data=meta[root];if(root==="sponsor"&&slug[1]==="apply")data=["Sponsorship Form","Apply to sponsor an Oxsa Nepal shelter animal."];else if(root==="sponsor"&&slug[1]){const a=animals.find(x=>x.slug===slug[1]);if(a)data=[`Sponsor ${a.name}`,a.excerpt];}if((root==="blog"||root==="stories")&&slug[1]){const a=(root==="blog"?blog:stories).find(x=>x.slug===slug[1]);if(a)data=[a.title,a.excerpt];}if(!data)return {};return{title:data[0],description:data[1],alternates:{canonical:`/${slug.join("/")}`},openGraph:{title:`${data[0]} | Oxsa Nepal`,description:data[1]}}}

export async function generateStaticParams(){return [...Object.keys(meta).map(x=>({slug:[x]})),...animals.map(x=>({slug:["sponsor",x.slug]})),...blog.map(x=>({slug:["blog",x.slug]})),...stories.map(x=>({slug:["stories",x.slug]})),{slug:["sponsor","apply"]}]}

export default async function Page({params,searchParams}:{params:Promise<{slug:string[]}>;searchParams:Promise<Record<string,string|undefined>>}){const {slug}=await params;const query=await searchParams;const [root,child]=slug;if(root==="about"&&!child)return <AboutPage/>;if(root==="our-work"&&!child)return <WorkPage/>;if(root==="donate"&&!child)return <DonatePage/>;if(root==="sponsor"&&!child)return <SponsorPage/>;if(root==="sponsor"&&child==="apply")return <SponsorApplyPage animal={query.animal}/>;if(root==="sponsor"&&animals.some(x=>x.slug===child))return <SponsorProfile slug={child}/>;if(root==="adopt"&&!child)return <AdoptPage/>;if(root==="stories"&&!child)return <StoriesPage/>;if(root==="stories"&&stories.some(x=>x.slug===child))return <ArticlePage kind="stories" slug={child}/>;if(root==="blog"&&!child)return <BlogPage/>;if(root==="blog"&&blog.some(x=>x.slug===child))return <ArticlePage kind="blog" slug={child}/>;if(root==="wishlist"&&!child)return <WishlistPage/>;if(root==="faq"&&!child)return <FAQPage/>;if(root==="vet-centres"&&!child)return <VetPage/>;if(root==="media"&&!child)return <MediaPage/>;if(root==="contact"&&!child)return <ContactPage/>;notFound()}
