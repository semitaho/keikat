import PageContent from "@/app/components/layout/page-content";
import PageTitle from "@/app/components/ui/page-title";
import { getProjektiBySlug } from "@/app/data/dummy-data";

export default async function ProjectDetailPage({ params: { projectslug } }) {
  const { title, description } = await getProjektiBySlug(projectslug);
  console.log("props", projectslug);
  return (
    <PageContent>
      <PageTitle className="text-xl3">{title}</PageTitle>
      <div className="grid grid-cols-3 w-full">
        <div>tiedot</div>
        <div className="col-span-2">
          <article dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>
    </PageContent>
  );
}
