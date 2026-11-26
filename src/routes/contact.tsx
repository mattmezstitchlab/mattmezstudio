import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/studio/pages";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});
