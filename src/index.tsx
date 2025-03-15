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
        overlayColor="rgba(0, 0, 0, 0.2)"  // Light overlay
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
      overlayColor="rgba(0, 0, 0, 0.4)"  // Medium overlay
      players={[
        { name: "David", crashPoint: 1.5 },
        { name: "Eva", crashPoint: 2.4 },
        { name: "Frank", crashPoint: 3.9 },
        { name: "Grace", crashPoint: 5.5 } // This won't show (exceeds game's crash point)
      ]}
    />
    
    <CrashGraph 
      crashPoint={100} 
      width={400} 
      height={400}
      overlayColor="rgba(0, 0, 0, 0.6)"  // Dark overlay
      players={[
        { name: "Henry", crashPoint: 2.1 },
        { name: "Ivy", crashPoint: 4.3 },
        { name: "Rise", crashPoint: 2 },
        { name: "Jack", crashPoint: 69.8 },
        { name: "Kate", crashPoint: 92.2 }
      ]}
    />
  </div>
);

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
