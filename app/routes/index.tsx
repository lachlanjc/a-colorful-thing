import { useOthers, useObject } from "@liveblocks/react";
import { useEffect } from "react";
import Canvas from "~/components/canvas";
import { CANVAS_SIZE } from "~/root";

export default function Index() {
  const intro = useObject("intro");
  const others = useOthers();

  useEffect(() => {
    window.document.title =
      intro?.get("name")?.toString() ?? "a colorful thing :)";
  }, [intro?.get("name")]);

  return (
    <main>
      <h1>
        <input
          type="text"
          value={intro?.get("name")?.toString() ?? ""}
          onChange={(e) => intro?.update({ name: e.target.value })}
          style={{ width: "100%" }}
        />
      </h1>
      <Canvas />
      <p>
        <mark>{others.count + 1}</mark> here now
      </p>
      <p>
        Shift + Click for Color Picker
      </p>
      <footer>
        <p>
          Site by @MatthewStanciu, @athenaleong, & @lachlanjc at{" "}
          <a href="https://noisebridge.net">Noisebridge</a> in June 2022.
        </p>
        <p>Artwork by the wide internet.</p>
        <p>
          <a href="https://github.com/lachlanjc/a-colorful-thing">GitHub</a>
        </p>
      </footer>
      <style>{`
        :root {
          --color-background: #f4cfff;
          --color-text: #002e50;
          --color-purple: #ba84ff;
        }

        * {
          box-sizing: border-box;
        }

        body {
          padding: 0;
          max-width: 100vw;
          overflow-x: hidden;
          display: grid;
          place-content: center;
          font-family: Syne, system-ui, sans-serif;
          line-height: 1.4;
          background-color: var(--color-background);
          color: var(--color-text);
        }

        main {
          width: clamp(100%, 66vw, ${CANVAS_SIZE}px);
          padding-block: clamp(32px, 10vh, 72px);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(24px, 5vh, 36px);
        } 
        
        h1, main > p {
            margin: 0;
        }

        input {
          font: inherit;
          color: var(--color-text);
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
        
        footer {
            max-width: 40ch;
        }
        p a {
          color: var(--color-purple);
        }
      `}</style>
    </main>
  );
}
