import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix'
import type { MetaFunction } from 'remix'
import { createClient, LiveObject } from '@liveblocks/client'
import { LiveblocksProvider, RoomProvider } from '@liveblocks/react'

const liveblocksClient = createClient({
  publicApiKey: 'pk_test_G4aL5dByWTvWlxUch1TAy37Z',
})

const initialStorage = {
  product: new LiveObject({
    name: 'Livebridge',
  }),
}

export const meta: MetaFunction = () => {
  return { title: 'New Remix App' }
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LiveblocksProvider client={liveblocksClient}>
          <RoomProvider id="livebridge" initialStorage={initialStorage}>
            <Outlet />
          </RoomProvider>
        </LiveblocksProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
