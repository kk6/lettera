import { useState } from "react";

import "./App.css";
import { MarkdownPreview } from "./MarkdownPreview";

type ViewMode = "source" | "split";

function App() {
  const [text, setText] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("source");

  function toggleViewMode() {
    setViewMode((currentViewMode) =>
      currentViewMode === "source" ? "split" : "source",
    );
  }

  return (
    <main className="application">
      <div className="view-controls">
        <button
          type="button"
          aria-pressed={viewMode === "split"}
          onClick={toggleViewMode}
        >
          Split
        </button>
      </div>

      <div className={`workspace workspace--${viewMode}`}>
        <textarea
          className="editor"
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
          aria-label="text body"
          wrap="soft"
        ></textarea>

        {viewMode === "split" && (
          <section className="preview" aria-label="Markdown Preview">
            <MarkdownPreview body={text} />
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
