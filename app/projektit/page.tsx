import PageContent from "../components/layout/page-content";
import PageTitle from "../components/ui/page-title";
import ProjectCardList from "../components/projects/project-card-list";
import { loadProjects } from "../lib/db-util";
import SearchForm from './../components/projects/search-form';
import SearchFilters from "../components/projects/search-filters";

export default  async function ProjektitPage({searchParams }: {searchParams: { provider: string }}) {
  const projektit = await loadProjects(searchParams)

  return (
    <PageContent>
      <PageTitle>Avoimet toimeksiannot</PageTitle>
      <SearchForm></SearchForm>
      <SearchFilters></SearchFilters>
      <ProjectCardList items={projektit}></ProjectCardList>
    </PageContent>
  );
}


