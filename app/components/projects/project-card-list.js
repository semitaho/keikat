import ProjectCard from "./project-card";
export default function ProjectCardList({ items }) {
  return (
    <section className="flex gap-10 mt-10">{items.map(item => 
        <ProjectCard key={item.slug} {...item}></ProjectCard>
    )}
    </section>
  );
}
