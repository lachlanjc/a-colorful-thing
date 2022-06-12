import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix'
import type { MetaFunction } from 'remix'
import { createClient, LiveObject, LiveList } from '@liveblocks/client'
import { LiveblocksProvider, RoomProvider } from '@liveblocks/react'

const liveblocksClient = createClient({
  publicApiKey: 'pk_test_G4aL5dByWTvWlxUch1TAy37Z',
})

export const PIXEL_SIZE = 32
export const AXIS_PIXEL_COUNT = 25
export const CANVAS_SIZE = PIXEL_SIZE * AXIS_PIXEL_COUNT

let content = new Array(AXIS_PIXEL_COUNT * AXIS_PIXEL_COUNT)
// for (let i = 0; i < content.length; i++) {
//   content[i] = new Array(10)
//   content[i].fill('#FF0000', 0, 10)
// }
content.fill('#ffbb38', 0, AXIS_PIXEL_COUNT * AXIS_PIXEL_COUNT)

console.log(content)

const initialStorage = {
  intro: new LiveObject({
    name: 'a colorful thing :)',
  }),
  canvas: new LiveList(content),
}

export const meta: MetaFunction = () => {
  return { title: 'a colorful thing :)' }
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
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;800&display=swap"
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
