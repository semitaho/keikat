import PageContent from "../components/layout/page-content";
import PageTitle from "../components/ui/page-title";
import ProjectCardList from "../components/projects/project-card-list";
import { getAllProviders, getAllSkills, loadProjects } from "../lib/db-util";
import SearchForm from "./../components/projects/search-form";
import SearchFilters from "../components/projects/search-filters";
import { SearchParams } from "../data/search-params.model";
import { QuerySearchParameters } from "../data/query-search-parameters.model";



export default async function ProjektitPage({
  searchParams,
}: {
  searchParams: QuerySearchParameters;
}) {
  const skills = await getAllSkills();
  const providers = await getAllProviders();
  const projektit = await loadProjects(searchParams);

  return (
    <PageContent>
      <PageTitle>Avoimet toimeksiannot</PageTitle>
      <SearchForm skills={skills} providers={providers}></SearchForm>
      <SearchFilters></SearchFilters>
      <ProjectCardList items={projektit}></ProjectCardList>
    </PageContent>
  );
}
