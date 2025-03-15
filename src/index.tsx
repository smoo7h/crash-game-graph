import * as React from "react";
import { createRoot } from "react-dom/client";
import { CrashGraph } from "./CrashGraph";

const App = () => (
  <div>
    <h1>Crash Game Graph</h1>
   
    {/* Example with players */}
    <h2>Crash Graphs with Players</h2>
    <CrashGraph 
      crashPoint={2.0} 
      width={400} 
      height={400}
      players={[
        { name: "Alice", crashPoint: 1.3 },
        { name: "Bob", crashPoint: 1.8 },
        { name: "Charlie", crashPoint: 2.2 } // This won't show (exceeds game's crash point)
      ]}
    />
    
    <CrashGraph 
      crashPoint={5.0} 
      width={400} 
      height={400}
      players={[
        { name: "David", crashPoint: 1.5 },
        { name: "Eva", crashPoint: 2.4 },
        { name: "Frank", crashPoint: 3.9 },
        { name: "Grace", crashPoint: 5.5 } // This won't show (exceeds game's crash point)
      ]}
    />
    
    <CrashGraph 
      crashPoint={10.0} 
      width={400} 
      height={400}
      players={[
        { name: "Henry", crashPoint: 2.1 },
        { name: "Ivy", crashPoint: 4.3 },
        { name: "Jack", crashPoint: 6.8 },
        { name: "Kate", crashPoint: 9.2 }
      ]}
    />
  </div>
);

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
