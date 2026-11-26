import { createFileRoute } from "@tanstack/react-router";
import { CadenceTool } from "@/components/studio/pages";

export const Route = createFileRoute("/laboratoire/cadence")({
  component: CadenceTool,
});
