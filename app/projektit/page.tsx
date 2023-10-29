import PageContent from "../components/layout/page-content";
import PageTitle from "../components/ui/page-title";
import ProjectCardList from "../components/projects/project-card-list";
import { loadAllProjects } from "../lib/db-util";

export default  async function ProjektitPage() {
  const projektit = await loadAllProjects()
  
  return (
    <PageContent>
      <PageTitle>Avoimet toimeksiannot</PageTitle>

      <ProjectCardList items={projektit}></ProjectCardList>
    </PageContent>
  );
}


