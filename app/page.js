import PageLink from './components/ui/page-link';
import PageTitle from "./components/ui/page-title";
import PageContent from "./components/layout/page-content";

export const metadata = {
  title: "Keikat etusivu",
  description: "Keikat - Vapaita keikkoja Freelancereille",
};
export default function Home() {
  return (
    <PageContent>
      <div className="p-10 bg-blue-200">
      <PageTitle>
          Tervetuloa Keikat-sivustolle! Täältä löydät kaikki Freelancer-keikat!
        </PageTitle>
      </div>
      <main className="max-w-4xl mx-auto p-6 text-lg">
        
        <p className="my-8">Toimitko ohjelmistoalalla pienyrittäjänä ja olet vailla toimeksiantoja, jotka vastaavat osaamistasi? 
          Ei tarvitse lähteä merta edemmäs kalaan!
        </p>
        <p className="my-8"><i>Keikat</i>-sivusto kokoaa yhteen Suomen suurimpien IT-yritysten ja välitystoimistojen julkisessa haussa  
        markkinoimat IT-projektit.</p>
        <p>Voit aloittaa projektin etsinnän siirtymällä <PageLink href="/projektit">avoimet projektit</PageLink> -osioon.</p>
        <p className="font-bold my-8">Sivusto ei tallenna käyttäjätietoja, vaan valinnat 
        säilyvät selaimen muistissa.</p>
      </main>
    </PageContent>
  );
}
