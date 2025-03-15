# System Patterns: Crash Game Graph Control

## Architecture Overview

```mermaid
flowchart TD
    A[CrashEngine] --> B[CrashGraph]
    B --> C[Canvas Rendering]
    B --> D[Animation Loop]
    A --> E[State Management]
    E --> F[Loading]
    E --> G[Active]
    E --> H[Over]
    
    B --> I[Player Management]
    I --> J[Car Images]
    I --> K[Position Calculation]
    I --> L[Visibility Control]
```

## Core Design Patterns

### 1. Engine-View Separation
- **CrashEngine**: Pure logic class handling calculations and state
  - Dual-speed rendering system for optimized performance
  - Transition point at 5x multiplier
  - Base speed for < 5x, accelerated speed for > 5x
  - Position and timing calculations for main car and police
- **CrashGraph**: React component for visualization
  - Police car follows main car with 1s delay
  - Maintains exact trajectory matching
  - Renders police car on top layer
- Clear separation of concerns between business logic and presentation

### 2. State Management
```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Active
    Active --> Over
```
- Managed through CrashEngineState enum
- Deterministic state transitions
- State affects multiplier calculations and rendering

### 3. Animation Pattern
```mermaid
flowchart LR
    A[RequestFrame] --> B[Calculate State]
    B --> C[Calculate Positions]
    C --> D[Update Police]
    D --> E[Render Frame]
    E --> F[Update Canvas]
    F --> A
```
- Uses requestAnimationFrame for optimal performance
- Continuous rendering loop while component is mounted
- Automatic cleanup on unmount

## Technical Architecture

### 1. Calculation System
- Two-phase logarithmic growth for multiplier values:
  - Base growth rate (0.00018) until 5x
  - Accelerated growth rate (0.00036) after 5x
- Smooth transition handling at 5x point
- Precise timing management for main car and police
- Lag detection and compensation
- Position tracking and trajectory replication

### 2. Rendering System
- Canvas-based drawing
- Quadratic curve interpolation
- Dynamic axis scaling and labeling
- Responsive to dimension changes
- Layer management for car overlaps
- Police car animation handling

### 3. Component Integration
- Props-based configuration
- Self-contained animation loop
- Clean mount/unmount lifecycle
- Multiple instance support
- Police car state management
- Image resource handling

## Error Handling
1. **Infinite Payout Protection**
   - Checks for infinite values
   - Throws error for invalid calculations
   - Maintains system stability

2. **Resource Management**
   - Proper cleanup of animation frames
   - Timer clearance on component unmount
   - Memory leak prevention

## Performance Optimizations
1. **Render Efficiency**
   - Canvas clearing optimization
   - Minimal state updates
   - Efficient curve calculations

2. **Memory Management**
   - Single canvas context reference
   - Cleanup of animation frames
   - Clear timeout handling

## Code Organization
- Clear separation of concerns
- TypeScript interfaces for type safety
- Encapsulated state management
- Modular component structure
