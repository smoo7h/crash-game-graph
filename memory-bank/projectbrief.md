# Project Brief: Crash Game Graph Control

## Overview
A React TypeScript application that provides a visual representation of crash game multiplier curves. The application renders interactive graphs that show the progression of multipliers over time until they "crash" at predetermined points.

## Core Components
1. **CrashEngine** (src/CrashEngine.ts)
   - Core logic for crash game calculations
   - Handles state management and multiplier calculations
   - Manages timing and animation state
   - Provides position calculations for cars

2. **CrashGraph** (src/CrashGraph.tsx)
   - React component for rendering crash graphs
   - Uses HTML Canvas for drawing
   - Implements real-time animation and visual feedback
   - Manages police chase mechanics and overlays

## Technical Requirements
- React 18.2.0
- TypeScript 4.9.5
- Canvas-based rendering
- Real-time animation (60 FPS target)
- Responsive graph sizing

## Project Goals
1. Provide clear visual representation of crash game progressions
2. Support multiple simultaneous graph instances
3. Maintain smooth animations and accurate timing
4. Enable customizable crash points and graph dimensions
5. Enhance visual engagement through police chase mechanics

## Implementation Details
- Uses requestAnimationFrame for smooth animations
- Implements quadratic curve rendering for multiplier visualization
- Provides dynamic axis scaling and labeling
- Supports customizable graph dimensions and crash points
- Features police car with exact trajectory following
- Maintains consistent layer ordering for overlapping elements
