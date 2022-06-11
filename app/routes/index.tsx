import { User } from '@liveblocks/client'
import {
  RoomProvider,
  useOthers,
  useObject,
  useUpdateMyPresence,
} from '@liveblocks/react'
import { useState, useEffect } from 'react'

const cursorColors =
  '#ffbb38 #f6609f #dadde0 #b8bcc0 #1f86ff #31805a #ba84ff #fc5100 #1ec072 #ff2424 #ffb4ed #17baff'.split(
    ' '
  )

type Cursor = {
  x: number
  y: number
}

type Presence = {
  cursor: Cursor | null
}

function useLiveCursors(): (User<Presence> & Cursor)[] {
  const updateMyPresence = useUpdateMyPresence<Presence>()

  useEffect(() => {
    let scroll = {
      x: window.scrollX,
      y: window.scrollY,
    }

    let lastPosition: Cursor | null = null

    function transformPosition(cursor: Cursor) {
      return {
        x: cursor.x / window.innerWidth,
        y: cursor.y,
      }
    }

    function onPointerMove(event: MouseEvent) {
      const position = {
        x: event.pageX,
        y: event.pageY,
      }
      lastPosition = position
      updateMyPresence({
        cursor: transformPosition(position),
      })
    }

    function onPointerLeave() {
      lastPosition = null
      updateMyPresence({ cursor: null })
    }

    function onDocumentScroll() {
      if (lastPosition) {
        const offsetX = window.scrollX - scroll.x
        const offsetY = window.scrollY - scroll.y
        const position = {
          x: lastPosition.x + offsetX,
          y: lastPosition.y + offsetY,
        }
        lastPosition = position
        updateMyPresence({
          cursor: transformPosition(position),
        })
      }
      scroll.x = window.scrollX
      scroll.y = window.scrollY
    }

    document.addEventListener('scroll', onDocumentScroll)
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerleave', onPointerLeave)

    return () => {
      document.removeEventListener('scroll', onDocumentScroll)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [updateMyPresence])

  const others = useOthers<Presence>()

  return others
    .toArray()
    .filter((user) => user.presence?.cursor != null)
    .map(({ connectionId, presence, id, info }) => {
      return {
        x: ((presence as Presence).cursor as Cursor).x * window.innerWidth,
        y: ((presence as Presence).cursor as Cursor).y,
        connectionId,
        id,
        info,
        presence,
      }
    })
}

export default function Index() {
  const product = useObject('product')
  const others = useOthers()
  const cursors = useLiveCursors()

  const updateMyPresence = useUpdateMyPresence()
  const pixelSize = 100

  return (
    <main>
      {cursors.filter(Boolean).map((cursor, i) => (
        <svg
          width={50}
          height={50}
          viewBox="0 0 50 50"
          style={{
            position: 'absolute',
            left: cursor.x,
            top: cursor.y,
            transform: `translate(-50%, -50%)`,
          }}
          key={cursor.id}
        >
          <circle
            cx={24}
            cy={24}
            r={8}
            stroke={cursorColors[i]}
            strokeWidth={2}
            fill="none"
          />
        </svg>
      ))}
      <h1 style={{ display: 'flex', gap: 16 }}>
        <input
          type="text"
          value={product?.get('name')?.toString() ?? ''}
          onChange={(e) => product?.update({ name: e.target.value })}
          style={{ flexGrow: 1 }}
        />
      </h1>
      <aside>
        <mark>{others.count}</mark> here now
      </aside>
      <p>There's a beautiful Canvas WOW</p>
      <canvas width={1000} height={1000} />
      <style>{`
        :root {
          --color-purple: #ba84ff;
        }

        body {
          padding: 0;
          display: grid;
          place-content: center;
          font-family: Syne, system-ui, sans-serif;
          line-height: 1.4;
          background-color: #f4cfff;
          color: #002e50;
        }

        main {
          width: clamp(100%, 66vw, 1024px);
          padding-block: 48px;
          text-align: center;
        } 

        input {
          font: inherit;
          outline-color: var(--color-purple);
          border-radius: 4px;
          border: 0;
          background: none;
          text-align: center;
        }
        
        canvas {
          background: white;
          border-radius: 16px;
          box-shadow: 0px 30px 60px -12px rgb(50 50 93 / 25%), 0px 18px 36px -18px rgb(0 0 0 / 30%);
        }

        mark {
          width: 5ch;
          display: inline-block;
          background: var(--color-purple);
          color: #fff;
          border-radius: 999px;
        }
      `}</style>
    </main>
  )
}
