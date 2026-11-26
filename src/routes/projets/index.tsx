import { createFileRoute } from "@tanstack/react-router";
import { WorkIndex } from "@/components/studio/pages";

export const Route = createFileRoute("/projets/")({
  component: WorkIndex,
});
