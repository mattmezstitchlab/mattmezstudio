import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Shell } from "@/components/studio/shell";
import { StudioProvider } from "@/components/studio/context";
import { getPublished } from "@/lib/studio/api";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  loader: () => getPublished(),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Matt Mez — Creative Studio" },
      { name: "description", content: "Matt Mez, creative studio. Identités, expériences, musique." },
      { name: "theme-color", content: "#090909" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,550;1,6..72,400&family=Outfit:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: Root,
});

function Root() {
  const data = Route.useLoaderData();
  return (
    <html lang="fr" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <StudioProvider initial={data}>
            <Shell>
              <Outlet />
            </Shell>
          </StudioProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
