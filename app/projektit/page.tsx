import PageContent from "../components/layout/page-content";
import PageTitle from "../components/ui/page-title";
import ProjectCardList from "../components/projects/project-card-list";
import { projektit } from "../data/dummy-data";

export default function ProjektitPage() {
  return (
    <PageContent>
      <PageTitle>Avoimet toimeksiannot</PageTitle>

      <ProjectCardList items={projektit}></ProjectCardList>
    </PageContent>
  );
}
