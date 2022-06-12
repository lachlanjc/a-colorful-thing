import useLiveCursors from './use-live-cursors'

export const cursorColors =
  '#ffbb38 #f6609f #1f86ff #31805a #ba84ff #fc5100 #1ec072 #ff2424 #ffb4ed #17baff'.split(
    ' '
  )

export default function Cursors({
  canvas,
}: {
  canvas: HTMLCanvasElement | null
}) {
  const cursors = useLiveCursors(canvas)

  return (
    <>
      {cursors.filter(Boolean).map((cursor, i) => (
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            border: '2px solid #fff',
            transform: `translate(${cursor.x}px, ${cursor.y}px)`,
            boxShadow: '0 0 2px #fff',
            zIndex: 2,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          key={i}
        />
      ))}
    </>
  )
}
