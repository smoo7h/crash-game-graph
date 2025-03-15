import * as React from "react";
import { createRoot } from "react-dom/client";
import { CrashGraph } from "./CrashGraph";

const App = () => (
  <div>
    <h1>Crash Game Graph</h1>
    <CrashGraph crashPoint={1.2} width={600} height={400} />
    <CrashGraph crashPoint={2.5} width={600} height={400} />
    <CrashGraph crashPoint={5.0} width={600} height={400} />
    <CrashGraph crashPoint={10.0} width={600} height={400} />
  </div>
);

const root = createRoot(document.getElementById("root")!);
root.render(<App />);