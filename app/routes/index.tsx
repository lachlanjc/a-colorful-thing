import { useOthers, useObject, useList } from '@liveblocks/react'
import { useState, useEffect, useRef } from 'react'
import Canvas from '~/components/canvas'
import { cursorColors } from '~/components/cursors'
import { CANVAS_SIZE } from '~/root'

export default function Index() {
  const intro = useObject('intro')
  const others = useOthers()
  const [color, setColor] = useState('#ba84ff')

  return (
    <main>
      <h1>
        <input
          type="text"
          value={intro?.get('name')?.toString() ?? ''}
          onChange={(e) => intro?.update({ name: e.target.value })}
          style={{ width: '100%' }}
        />
      </h1>
      <aside
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <span style={{ marginRight: 'auto' }}>
          <mark>{others.count}</mark> here now
        </span>
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          value={color}
        />
        {cursorColors.map((colorItem) => (
          <button
            key={colorItem}
            onClick={() => setColor(colorItem)}
            style={{
              border: 0,
              background: colorItem,
              width: 24,
              height: 24,
              borderRadius: 12,
            }}
          />
        ))}
      </aside>
      <Canvas color={color} />
      <style>{`
        :root {
          --color-purple: #ba84ff;
        }

        * {
          box-sizing: border-box;
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
          width: clamp(100%, 66vw, ${CANVAS_SIZE}px);
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
        
        mark {
          width: 5ch;
          display: inline-block;
          background: var(--color-purple);
          color: #fff;
          border-radius: 999px;
          margin-right: 6px;
        }
      `}</style>
    </main>
  )
}
