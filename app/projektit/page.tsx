import PageContent from "../components/layout/page-content";
import PageTitle from "../components/ui/page-title";
import ProjectCardList from "../components/projects/project-card-list";
import { loadProjects } from "../lib/db-util";

export default  async function ProjektitPage({searchParams }: {searchParams: { provider: string }}) {
  const projektit = await loadProjects(searchParams)

  return (
    <PageContent>
      <PageTitle>Avoimet toimeksiannot</PageTitle>

      <ProjectCardList items={projektit}></ProjectCardList>
    </PageContent>
  );
}


