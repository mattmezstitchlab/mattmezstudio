import { createFileRoute } from "@tanstack/react-router";
import { ProjectView } from "@/components/studio/project-view";

export const Route = createFileRoute("/projets/$slug")({
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  return <ProjectView slug={slug} />;
}
