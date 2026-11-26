import { createFileRoute } from "@tanstack/react-router";
import { SignalTool } from "@/components/studio/pages";

export const Route = createFileRoute("/laboratoire/signal")({
  component: SignalTool,
});
