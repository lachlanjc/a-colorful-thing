import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import { createClient } from "@liveblocks/client";
import { LiveblocksProvider } from "@liveblocks/react";

const liveblocksClient = createClient({
  publicApiKey: "pk_test_G4aL5dByWTvWlxUch1TAy37Z",
});

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <LiveblocksProvider client={liveblocksClient}>
          <Outlet />
        </LiveblocksProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
