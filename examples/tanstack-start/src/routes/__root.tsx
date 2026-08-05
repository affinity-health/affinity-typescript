import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import stylesHref from "../styles.css?url";

export const Route = createRootRoute({
  component: () => (
    <Document>
      <Outlet />
    </Document>
  ),
  head: () => ({
    links: [{ href: stylesHref, rel: "stylesheet" }],
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: "Affinity SDK Test Practice" },
    ],
  }),
});

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
