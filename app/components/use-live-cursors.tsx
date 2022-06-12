import { useEffect } from 'react'
import { useOthers, useUpdateMyPresence } from '@liveblocks/react'
import type { User } from '@liveblocks/client'

type Cursor = {
  x: number
  y: number
}

type Presence = {
  cursor: Cursor | null
}

export default function useLiveCursors(
  canvas: HTMLCanvasElement | null
): (User<Presence> & Cursor)[] {
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

    if (!canvas) {
      return
    }

    canvas.addEventListener('scroll', onDocumentScroll)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)

    return () => {
      canvas.removeEventListener('scroll', onDocumentScroll)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [canvas, updateMyPresence])

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
