import ProjectCard from "./project-card";
import CardListTitle from "./card-list-title";
export default function ProjectCardList({ items }) {
  return (
    <section className="mt-10 flex flex-col gap-2">
      <CardListTitle>Uusimmat toimeksiannot</CardListTitle>
      <div className="flex gap-10">
        {items.map((item) => (
          <ProjectCard key={item.slug} {...item}></ProjectCard>
        ))}
      </div>
    </section>
  );
}
