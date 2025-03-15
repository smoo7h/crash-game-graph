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
  ├── CrashGraph.tsx     # Graph visualization component
  ├── index.tsx         # Application entry point
  ├── react-app-env.d.ts # TypeScript declarations
  ├── reportWebVitals.ts # Performance monitoring
  └── setupTests.ts      # Test configuration
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

## Technical Constraints

### Canvas Rendering
- Uses HTML5 Canvas API
- 2D context for drawing
- Manual frame management
- Quadratic curve interpolation

### State Management
- Class-based state handling
- Enum-based state machine
- Time-based calculations
- Lag compensation system

### Testing Infrastructure
- Jest for unit testing
- React Testing Library
- DOM testing utilities
- User event simulation

## Build Process
- Create React App based
- TypeScript compilation
- Asset optimization
- Development hot reload
- Production minification
