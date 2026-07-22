import { useState } from "react";

import "./App.css";

function App() {
  const [text, setText] = useState("");

  return (
    <main className="application">
      <textarea
        className="editor"
        value={text}
        onChange={(event) => setText(event.currentTarget.value)}
        aria-label="本文"
        wrap="soft"
      ></textarea>
    </main>
  );
}

export default App;
