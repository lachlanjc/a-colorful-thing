import { useList } from "@liveblocks/react";
import { Key, KeyboardEventHandler, useEffect, useRef, useState } from "react";
import Cursors from "~/components/cursors";
import { cursorColors } from "~/components/cursors";
import { CANVAS_SIZE, AXIS_PIXEL_COUNT, PIXEL_SIZE } from "~/root";

export default function Canvas() {
  const [color, setColor] = useState("#ba84ff");
  const [colorPicker, setColorPicker] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasData = useList("canvas");
  const [dataUrl, setDataUrl] = useState("");
  const [time, setTime] = useState('')

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    setDataUrl(
      getCanvasDataUrl(document.getElementById("canvas") as HTMLCanvasElement)
    );
    setTime(getTime())

    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let index = 0; index < CANVAS_SIZE; index++) {
      const color = canvasData?.get(index)?.toString();
      const row = index % AXIS_PIXEL_COUNT;
      const col = Math.floor(index / AXIS_PIXEL_COUNT);
      ctx.fillStyle = color?.toString() ?? "#FFFFFF";
      ctx.fillRect(row * PIXEL_SIZE, col * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }
  }, [canvasData?.toArray()]);

  function keyDown(e: KeyboardEvent) {
    if (e.shiftKey) {
      setColorPicker(true)
    }
  }

  function keyUp(e: KeyboardEvent) {
    setColorPicker(false)
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDown)
    document.addEventListener('keyup', keyUp)
  }, [])



  function onCanvasClick(e: MouseEvent) {
    const offset = canvasRef.current?.getBoundingClientRect() ?? { x: 0, y: 0 };

    const x = e.pageX - offset.x - window.scrollX;
    const y = e.pageY - offset.y - window.scrollY;

    const row = Math.floor(x / PIXEL_SIZE) + 1;
    const col = Math.floor(y / PIXEL_SIZE);
    const index = col * AXIS_PIXEL_COUNT + row;
    console.log({ row, col, index });

    if (colorPicker) {
      const color = canvasData?.get(index - 1)?.toString() ?? "#FFFFFFF"
      setColor(color)
    } 
    else {
      canvasData?.delete(index - 1);
      canvasData?.insert(color, index - 1);
    }
  }

  function getCanvasDataUrl(canvas: HTMLCanvasElement) {
    return canvas.toDataURL("png");
  }

  function getTime() {
    const now = new Date(Date.now()).toLocaleString()
    return now.replace(new RegExp(/(:| )/g), '_').replace(',_', '-')
  }

  return (
    <article>
      <aside
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
          width: "100%",
        }}
      >
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
        {colorPicker && <img 
                          src="/color-picker.png" 
                          style={{
                            width:24,
                            height:24,
                          }}/>}
        <a href={dataUrl} download={`a-colorful-thing-${time}`} className="button">
          Download
        </a>
      </aside>

      <div className="canvas-border">
        <canvas
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          ref={canvasRef}
          id="canvas"
          onClick={onCanvasClick}
        />
        <Cursors canvas={canvasRef.current} />
      </div>

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
            margin-top: 16px;
          }

          .button {
            padding: 8px 18px;
            color: #ffb4ed;
            background-color: var(--color-text);
            transition: 0.5s cubic-bezier(.85,0,.15,1) color, 0.5s cubic-bezier(.85,0,.15,1) background-color;
            border-radius: 6px;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
            margin-left: auto;
          }
          .button:hover,
          .button:focus {
              background-color: #ffb4ed;
            color: var(--color-text);
          }
        `}</style>
    </article>
  );
}
