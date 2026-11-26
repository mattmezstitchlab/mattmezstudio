import { createFileRoute } from "@tanstack/react-router";
import { LabPage } from "@/components/studio/pages";

export const Route = createFileRoute("/laboratoire/")({
  component: LabPage,
});
