import { useList } from '@liveblocks/react'
import { useEffect, useRef } from 'react'
import Cursors from '~/components/cursors'
import { CANVAS_SIZE, AXIS_PIXEL_COUNT, PIXEL_SIZE } from '~/root'

export default function Canvas({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasData = useList('canvas')

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    const arr = canvasData?.toArray()
    console.log('canvas data', canvasData, 'arr:', arr)
    if (!ctx) return
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    for (let index = 0; index < CANVAS_SIZE; index++) {
      const color = canvasData?.get(index)?.toString()
      const row = index % AXIS_PIXEL_COUNT
      const col = Math.floor(index / AXIS_PIXEL_COUNT)
      ctx.fillStyle = color?.toString() ?? '#FFFFFF'
      ctx.fillRect(row * PIXEL_SIZE, col * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
      // console.log('row', row, 'col', col)
      // console.log('color', color)
    }
  }, [canvasData?.toArray()])

  function onCanvasClick(e: MouseEvent) {
    const offset = canvasRef.current?.getBoundingClientRect() ?? { x: 0, y: 0 }

    const x = e.pageX - offset.x - window.scrollX
    const y = e.pageY - offset.y - window.scrollY

    const row = Math.floor(x / PIXEL_SIZE) + 1
    const col = Math.floor(y / PIXEL_SIZE)
    const index = col * AXIS_PIXEL_COUNT + row
    console.log({ row, col, index })

    canvasData?.delete(index - 1)
    canvasData?.insert(color, index - 1)
  }

  return (
    <div className="canvas-border">
      <canvas
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        ref={canvasRef}
        onClick={onCanvasClick}
      />
      <Cursors canvas={canvasRef.current} />
      <style>{`
        canvas {
          background: white;
        }

        .canvas-border {
          border-radius: 1px;
          position: relative;
          border: 4px solid #fff;
          box-shadow: 0px 30px 60px -12px rgb(50 50 93 / 25%), 0px 18px 36px -18px rgb(0 0 0 / 30%);
          display: block;
          line-height: 0;
        }
      `}</style>
    </div>
  )
}