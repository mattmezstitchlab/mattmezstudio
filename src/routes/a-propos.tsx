import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/studio/pages";

export const Route = createFileRoute("/a-propos")({
  component: AboutPage,
});
