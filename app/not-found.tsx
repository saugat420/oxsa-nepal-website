import { PawPrint } from "lucide-react";
import { NativeLink as Link } from "@/src/components/NativeLink";
export default function NotFound(){return <section className="not-found"><div><span><PawPrint/></span><p className="eyebrow">404</p><h1>Looks like this page wandered away.</h1><p>Let’s help you find the right path.</p><div className="button-row centered"><Link className="button" href="/">Go Home</Link><Link className="button button-outline" href="/sponsor">See Our Animals</Link></div></div></section>}
