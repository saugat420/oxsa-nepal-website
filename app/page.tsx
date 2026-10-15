import type { Metadata } from "next";
import { HomePage } from "@/src/components/Pages";

export const metadata: Metadata = {
  title: { absolute: "Oxsa Nepal | Animal Welfare Society" },
  description: "Oxsa Nepal supports street animals through spaying and neutering, feeding, vaccination, adoption and awareness.",
  alternates: { canonical: "/" },
};

export default function Page(){ return <HomePage/>; }
