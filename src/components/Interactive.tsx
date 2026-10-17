"use client";

import { useMemo, useState } from "react";
import { Check, Copy, ExternalLink, MapPin, Phone, Search, ShieldCheck } from "lucide-react";
import { animals, vets } from "@/src/content/data";
import { AnimalPhoto } from "./SiteChrome";
import { siteConfig } from "@/src/config/site";
import { NativeLink as Link } from "./NativeLink";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(()=>setCopied(false), 1800); }
  return <button className="copy-button" type="button" onClick={copy} aria-live="polite">{copied ? <><Check/> Copied to clipboard</> : <><Copy/> {label}</>}</button>;
}

export function SponsorGrid({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState<"All"|"Dog"|"Cat">("All");
  const shown = (filter === "All" ? animals : animals.filter(a=>a.species===filter)).slice(0, limit ?? animals.length);
  return <><div className="filter-row" aria-label="Filter sponsor animals">{(["All","Dog","Cat"] as const).map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x === "Dog" ? "Dogs" : x === "Cat" ? "Cats" : x}</button>)}</div><div className="card-grid animal-grid">{shown.map(a=><article className="animal-card" key={a.slug}><AnimalPhoto name={a.name} species={a.species} src={a.image}/><div><span className="tag">{a.species}</span><h3>{a.name}</h3><p>{a.excerpt}</p><div className="card-actions"><Link className="text-link" href={`/sponsor/${a.slug}`}>Read their story →</Link><Link className="button button-small" href={`/sponsor/apply?animal=${a.slug}`}>Sponsor</Link></div></div></article>)}</div>{shown.length===0&&<div className="empty-state">No animals match this filter.</div>}</>;
}

export function VetDirectory() {
  const [query,setQuery] = useState("");
  const [province,setProvince] = useState("All");
  const provinces=["All",...Array.from(new Set(vets.map(v=>v.province))).sort()];
  const normalizedQuery=query.trim().toLowerCase();
  const results=useMemo(()=>vets.filter(v=>{
    const matchesProvince=province==="All"||v.province===province;
    const searchable=`${v.name} ${v.province} ${v.city} ${v.location} ${v.phones.join(" ")}`.toLowerCase();
    return matchesProvince&&(!normalizedQuery||searchable.includes(normalizedQuery));
  }),[normalizedQuery,province]);

  return <>
    <div className="directory-tools">
      <label className="search-box"><Search/><span className="sr-only">Search vet centres</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, phone, city, district or place"/></label>
      <label><span className="sr-only">Filter by province</span><select value={province} onChange={e=>setProvince(e.target.value)}>{provinces.map(p=><option key={p}>{p}</option>)}</select></label>
    </div>
    <div className="directory-summary" aria-live="polite"><ShieldCheck/>{results.length} verified {results.length===1?"centre":"centres"} shown</div>
    <div className="vet-list" role="list">{results.map(v=>{
      const mapQuery=encodeURIComponent(`${v.name}, ${v.location}, Nepal`);
      return <article className="vet-card" role="listitem" key={`${v.name}-${v.location}`}>
        <div className="vet-card-copy"><div className="vet-tags"><span className="tag">{v.province}</span><span>{v.city}</span></div><h3>{v.name}</h3><p><MapPin/>{v.location}</p></div>
        <div className="vet-card-actions"><div className="vet-phones">{v.phones.map(phone=><a className="phone-link" href={`tel:${phone.replace(/[^\d+]/g,"")}`} key={phone}><Phone/>{phone}</a>)}</div><a className="vet-action-link" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer"><MapPin/>Google Maps</a><a className="vet-source-link" href={v.source} target="_blank" rel="noopener noreferrer">Official source<ExternalLink/></a></div>
      </article>;
    })}</div>
    {results.length===0&&<div className="empty-state">No verified vet centres match your search. Try a different spelling, district, city or province.</div>}
  </>;
}

type FormKind = "contact"|"sponsor"|"adoption";
export function SmartForm({ kind, animal }: { kind: FormKind; animal?: string }) {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle"); const [message,setMessage]=useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setStatus("loading"); const form=e.currentTarget; const data=Object.fromEntries(new FormData(form)); try { const res=await fetch(`/api/${kind}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)}); const json=await res.json() as {message?:string}; if(!res.ok) throw new Error(json.message||"Unable to send your message."); setStatus("success"); setMessage(json.message||"Thank you. Your message has been sent."); form.reset(); } catch(err) { setStatus("error"); setMessage(`${err instanceof Error?err.message:"Unable to submit."} Please email ${siteConfig.email}.`); } }
  const common=<><div className="form-grid"><Field name="fullName" label="Full name" required/><Field name="email" label="Email" type="email" required/><Field name="phone" label="Phone / WhatsApp" required/></div><div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div></>;
  return <form className="form-card" onSubmit={submit}>{common}{kind==="contact"&&<><label>Subject<select name="subject" required defaultValue=""><option value="" disabled>Choose a subject</option>{["General Inquiry","Adoption","Sponsorship","Donation","Shelter Visit","Animal Welfare Question","Other"].map(x=><option key={x}>{x}</option>)}</select></label><Field name="message" label="Message" textarea required/></>}{kind==="sponsor"&&<><label>Animal<select name="animal" defaultValue={animal||""} required><option value="" disabled>Choose an animal</option>{animals.map(a=><option key={a.slug} value={a.slug}>{a.name}</option>)}</select></label><Field name="contribution" label="Desired monthly contribution" required/><Field name="message" label="Message (optional)" textarea/></>}{kind==="adoption"&&<AdoptionFields/>}<button className="button submit-button" disabled={status==="loading"}>{status==="loading"?"Sending…":kind==="adoption"?"Submit Adoption Application":kind==="sponsor"?"Submit Sponsorship Interest":"Send Message"}</button>{status!=="idle"&&status!=="loading"&&<div className={`form-status ${status}`} role="status">{message}</div>}</form>;
}

function Field({name,label,type="text",required,textarea}:{name:string;label:string;type?:string;required?:boolean;textarea?:boolean}){return <label>{label}{textarea?<textarea name={name} rows={5} required={required}/>:<input name={name} type={type} required={required}/>}</label>}
function AdoptionFields(){return <><h2>Applicant & home</h2><div className="form-grid"><Field name="address" label="Address / Area" required/><Field name="city" label="City" required/><Field name="animal" label="Animal interested in" required/></div><label>Do you own or rent?<select name="housing" required><option>Own</option><option>Rent</option></select></label><Field name="landlord" label="If renting, does your landlord allow animals?"/><Field name="household" label="Who lives in your household, and does everyone agree?" textarea required/><h2>Experience & responsibility</h2><Field name="petsBefore" label="Have you had pets before? What happened to them?" textarea required/><Field name="exercise" label="How will the animal get daily exercise?" textarea required/><Field name="travelCare" label="Who will care for the animal when you travel?" textarea required/><Field name="vetExpenses" label="Are you prepared for veterinary expenses?" textarea required/><Field name="moveAbroad" label="Do you plan to move abroad? What would happen if pets were not allowed?" textarea required/><label className="check-label"><input type="checkbox" name="commitment" value="yes" required/> I understand that adoption is a lifelong commitment.</label></>}
