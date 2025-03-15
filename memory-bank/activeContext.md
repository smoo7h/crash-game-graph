# Active Context: Crash Game Graph Control

## Current Status
The project is in an enhanced state with player visualization features:
- CrashEngine calculation system
- CrashGraph visualization component with player integration
- Multiple instance demonstration with player tracking
- Dynamic car and name display based on crash points

## Recent Changes
- Added player visualization system to CrashGraph
- Implemented dynamic car image loading for players
- Added player name display with background for readability
- Enhanced multiplier tracking to control player visibility
- Updated demo examples with player scenarios

## Active Work
The project now supports player visualization in crash scenarios:
- Player data integration through props interface
- Random car assignment from available assets
- Conditional rendering based on crash points
- Real-time animation with player position tracking:
  - Original speed for multipliers under 5x
  - Accelerated speed for multipliers over 5x
  - Players appear when multiplier reaches their crash point

## Current Focus Areas
1. **Player Integration**
   - Dynamic player data handling
   - Random car image assignment
   - Position calculation on curve
   - Visibility control based on current multiplier

2. **Visualization**
   - Player car rendering with proper rotation
   - Name label positioning and readability
   - Background handling for text clarity
   - Purple curve rendering with dynamic scaling

3. **Component Integration**
   - Player props interface
   - Multiple instance handling with player support
   - Memory management for car images
   - Efficient player data updates

## Active Decisions

### Technical Choices
1. **Canvas vs SVG**
   - Using Canvas for better performance with animations
   - Direct pixel manipulation for smooth curves
   - Efficient updates for real-time changes

2. **State Management**
   - Class-based CrashEngine for encapsulation
   - React component state for UI updates
   - Enum-based game state tracking

### Implementation Approaches
1. **Animation**
   - requestAnimationFrame for optimal performance
   - Quadratic curve interpolation
   - Dynamic frame updates

2. **Rendering**
   - Manual canvas context management
   - Explicit cleanup on unmount
   - Responsive to size changes

## Next Steps
1. **Potential Improvements**
   - Performance optimization for multiple instances
   - Enhanced error handling
   - Additional customization options

2. **Future Considerations**
   - Mobile device optimization
   - Additional graph customization
   - Integration with betting systems
