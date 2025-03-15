# Technical Context: Crash Game Graph Control

## Development Environment

### Core Technologies
- **React**: v18.2.0
- **TypeScript**: v4.9.5
- **Node.js**: Compatible with current LTS
- **Package Manager**: npm

### Key Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^4.9.5"
}
```

### Development Dependencies
```json
{
  "@testing-library/dom": "^10.4.0",
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/react": "^16.2.0",
  "@testing-library/user-event": "^13.5.0",
  "@types/jest": "^27.5.2",
  "@types/node": "^16.18.126",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "ajv": "^8.17.1",
  "ajv-keywords": "^5.1.0"
}
```

## Project Structure
```
src/
  ├── CrashEngine.ts     # Core game logic and calculations
  ├── CrashGraph.tsx     # Graph visualization component with player support
  ├── index.tsx         # Application entry point and demo configurations
  ├── react-app-env.d.ts # TypeScript declarations
  ├── reportWebVitals.ts # Performance monitoring
  └── setupTests.ts      # Test configuration

public/
  └── assets/
      ├── car0.png      # Player car image assets
      ├── car1.png
      ├── car2.png
      ├── car3.png
      ├── car4.png
      ├── car5.png
      └── car6.png
```

## Interface Definitions

### Core Configuration Types
```typescript
interface CrashEngineConfig {
  baseCrashSpeed: number;        // Base multiplier growth rate
  acceleratedCrashSpeed: number; // Accelerated growth rate
  transitionPoint: number;       // Point at which acceleration kicks in
  predictingLapse: number;       // Lag prediction window
  defaultXAxisMinimum: number;   // Minimum X-axis value
  defaultYAxisMinimum: number;   // Minimum Y-axis value
  defaultYAxisMultiplier: number;// Default Y-axis multiplier
}

interface GraphDimensions {
  width: number;        // Total graph width
  height: number;       // Total graph height
  plotOffsetX: number; // X-axis offset
  plotOffsetY: number; // Y-axis offset
  plotWidth: number;   // Actual plotting area width
  plotHeight: number;  // Actual plotting area height
}

interface Position {
  x: number;  // X coordinate
  y: number;  // Y coordinate
}
```

### Component Props
```typescript
interface CrashGraphProps {
  crashPoint: number;          // Crash multiplier value
  width?: number;             // Canvas width
  height?: number;            // Canvas height
  players?: PlayerData[];     // Player information
  overlayColor?: string;      // Overlay color
}

interface PlayerData {
  name: string;
  crashPoint: number;
}
```

## Technical Requirements

### Browser Support
```javascript
{
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ]
}
```

### Performance Constraints
- Target: 60 FPS animation
- Smooth curve rendering
- Efficient canvas updates
- Minimal memory footprint
- Optimized getter/setter access

## Development Setup

### Scripts
```json
{
  "start": "react-scripts start",    // Development server
  "build": "react-scripts build",    // Production build
  "test": "react-scripts test",      // Run tests
  "eject": "react-scripts eject"     // Eject from CRA
}
```

### TypeScript Configuration
- Strict mode enabled
- DOM and ES6+ lib support
- React JSX support
- Module resolution: Node
- Interface-driven development
- Private field protection

## Technical Implementation

### Canvas Rendering
- Uses HTML5 Canvas API
- 2D context for drawing
- Manual frame management
- Quadratic curve interpolation
- Type-safe dimension handling

### State Management
- Class-based state handling
- Enum-based state machine
- Protected internal state
- Getter-based access patterns
- Interface-driven configuration
- Time-based calculations
- Lag compensation system

### Engine Architecture
- Private field encapsulation
- Public getter methods
- Interface-driven configuration
- Type-safe position tracking
- Protected state management
- Efficient property access

### Testing Infrastructure
- Jest for unit testing
- React Testing Library
- DOM testing utilities
- User event simulation
- Interface mocking support

## Build Process
- Create React App based
- TypeScript compilation
- Asset optimization
- Development hot reload
- Production minification
- Type checking
- Interface validation
