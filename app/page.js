import { Metadata } from "next";
import Image from "next/image";
import PageTitle from "./components/ui/page-title";
import PageContent from "./components/layout/page-content";

export const metadata = {
  title: "Keikat etusivu",
  description: "Keikat - Vapaita keikkoja Freelancereille",
};
export default function Home() {
  return (
    <PageContent>
      <article>
        <PageTitle>
          Keikat on uudenlainen sivusto ohjelmistotekniikan uranuurtajille!
        </PageTitle>
      </article>
    </PageContent>
  );
}
