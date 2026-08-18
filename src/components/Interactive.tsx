"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, Search } from "lucide-react";
import { animals, vets } from "@/src/content/data";
import { PawPlaceholder } from "./SiteChrome";
import { siteConfig } from "@/src/config/site";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(()=>setCopied(false), 1800); }
  return <button className="copy-button" type="button" onClick={copy} aria-live="polite">{copied ? <><Check/> Copied to clipboard</> : <><Copy/> {label}</>}</button>;
}

export function SponsorGrid({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState<"All"|"Dog"|"Cat">("All");
  const shown = (filter === "All" ? animals : animals.filter(a=>a.species===filter)).slice(0, limit ?? animals.length);
  return <><div className="filter-row" aria-label="Filter sponsor animals">{(["All","Dog","Cat"] as const).map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x === "Dog" ? "Dogs" : x === "Cat" ? "Cats" : x}</button>)}</div><div className="card-grid animal-grid">{shown.map(a=><article className="animal-card" key={a.slug}><PawPlaceholder name={a.name} species={a.species}/><div><span className="tag">{a.species}</span><h3>{a.name}</h3><p>{a.excerpt}</p><div className="card-actions"><Link className="text-link" href={`/sponsor/${a.slug}`}>Read their story →</Link><Link className="button button-small" href={`/sponsor/apply?animal=${a.slug}`}>Sponsor</Link></div></div></article>)}</div>{shown.length===0&&<div className="empty-state">No animals match this filter.</div>}</>;
}

export function VetDirectory() {
  const [query,setQuery] = useState(""); const [city,setCity] = useState("All");
  const cities=["All","Lalitpur","Kathmandu","Bhaktapur","Pokhara","Bharatpur","Birgunj"];
  const results=useMemo(()=>vets.filter(v=>(city==="All"||v[1]===city)&&`${v[0]} ${v[1]} ${v[2]}`.toLowerCase().includes(query.toLowerCase())),[query,city]);
  return <><div className="directory-tools"><label className="search-box"><Search/><span className="sr-only">Search vet centres</span><input value={query} onInput={e=>setQuery(e.currentTarget.value)} onChange={e=>setQuery(e.target.value)} placeholder="Search clinic, area or city"/></label><label><span className="sr-only">Filter by city</span><select value={city} onChange={e=>setCity(e.target.value)}>{cities.map(c=><option key={c}>{c}</option>)}</select></label></div><div className="vet-list" role="list">{results.map((v,i)=><article className="vet-card" role="listitem" key={`${v[0]}-${i}`}><div><span className="tag">{v[1]}</span><h3>{v[0]}</h3><p>{v[2]}</p></div><a className="phone-link" href={`tel:${v[3].replaceAll("-","")}`}>{v[3]}</a></article>)}</div>{results.length===0&&<div className="empty-state">No vet centres match your search. Try a different area or city.</div>}</>;
}

type FormKind = "contact"|"sponsor"|"adoption";
export function SmartForm({ kind, animal }: { kind: FormKind; animal?: string }) {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle"); const [message,setMessage]=useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setStatus("loading"); const form=e.currentTarget; const data=Object.fromEntries(new FormData(form)); try { const res=await fetch(`/api/${kind}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)}); const json=await res.json() as {message?:string}; if(!res.ok) throw new Error(json.message||"Unable to send your message."); setStatus("success"); setMessage(json.message||"Thank you. Your message has been sent."); form.reset(); } catch(err) { setStatus("error"); setMessage(`${err instanceof Error?err.message:"Unable to submit."} Please email ${siteConfig.email} or call ${siteConfig.phone}.`); } }
  const common=<><div className="form-grid"><Field name="fullName" label="Full name" required/><Field name="email" label="Email" type="email" required/><Field name="phone" label="Phone / WhatsApp" required/></div><div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div></>;
  return <form className="form-card" onSubmit={submit}>{common}{kind==="contact"&&<><label>Subject<select name="subject" required defaultValue=""><option value="" disabled>Choose a subject</option>{["General Inquiry","Adoption","Sponsorship","Donation","Shelter Visit","Animal Welfare Question","Other"].map(x=><option key={x}>{x}</option>)}</select></label><Field name="message" label="Message" textarea required/></>}{kind==="sponsor"&&<><label>Animal<select name="animal" defaultValue={animal||""} required><option value="" disabled>Choose an animal</option>{animals.map(a=><option key={a.slug} value={a.slug}>{a.name}</option>)}</select></label><Field name="contribution" label="Desired monthly contribution" required/><Field name="message" label="Message (optional)" textarea/></>}{kind==="adoption"&&<AdoptionFields/>}<button className="button submit-button" disabled={status==="loading"}>{status==="loading"?"Sending…":kind==="adoption"?"Submit Adoption Application":kind==="sponsor"?"Submit Sponsorship Interest":"Send Message"}</button>{status!=="idle"&&status!=="loading"&&<div className={`form-status ${status}`} role="status">{message}</div>}</form>;
}

function Field({name,label,type="text",required,textarea}:{name:string;label:string;type?:string;required?:boolean;textarea?:boolean}){return <label>{label}{textarea?<textarea name={name} rows={5} required={required}/>:<input name={name} type={type} required={required}/>}</label>}
function AdoptionFields(){return <><h2>Applicant & home</h2><div className="form-grid"><Field name="address" label="Address / Area" required/><Field name="city" label="City" required/><Field name="animal" label="Animal interested in" required/></div><label>Do you own or rent?<select name="housing" required><option>Own</option><option>Rent</option></select></label><Field name="landlord" label="If renting, does your landlord allow animals?"/><Field name="household" label="Who lives in your household, and does everyone agree?" textarea required/><h2>Experience & responsibility</h2><Field name="petsBefore" label="Have you had pets before? What happened to them?" textarea required/><Field name="exercise" label="How will the animal get daily exercise?" textarea required/><Field name="travelCare" label="Who will care for the animal when you travel?" textarea required/><Field name="vetExpenses" label="Are you prepared for veterinary expenses?" textarea required/><Field name="moveAbroad" label="Do you plan to move abroad? What would happen if pets were not allowed?" textarea required/><label className="check-label"><input type="checkbox" name="commitment" value="yes" required/> I understand that adoption is a lifelong commitment.</label></>}
