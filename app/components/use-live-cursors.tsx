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
    function onPointerMove(event: MouseEvent) {
      const offset = canvas?.getBoundingClientRect() ?? { x: 0, y: 0 }

      const x = event.pageX - offset.x - window.scrollX
      const y = event.pageY - offset.y - window.scrollY

      updateMyPresence({
        cursor: { x, y },
      })
    }

    function onPointerLeave() {
      updateMyPresence({ cursor: null })
    }

    if (!canvas) {
      return
    }

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)

    return () => {
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
