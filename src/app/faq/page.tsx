import { Metadata } from "next";

import FAQ from "./content.mdx";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Ofte stilte spørsmål",
};

export default function FAQPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-6">
      <FAQ />
    </div>
  );
}
