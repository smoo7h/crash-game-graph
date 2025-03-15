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
The project now features a police chase mechanic alongside player visualization:
- Police car follows main car with 1-second delay
- Police maintains exact trajectory of main car
- Consistent layering with police car on top
- Real-time animation with advanced tracking:
  - Original speed for multipliers under 5x
  - Accelerated speed for multipliers over 5x
  - Police car follows crash trajectory

## Current Focus Areas
1. **Police Chase Integration**
   - Police car appears 1 second after start
   - Follows exact trajectory of main car
   - Maintains consistent 1-second delay
   - Proper handling of crash scenarios

2. **Player Integration**
   - Dynamic player data handling
   - Random car image assignment
   - Position calculation on curve
   - Visibility control based on current multiplier

3. **Visualization**
   - Police car always renders on top layer
   - Proper car rotation on curves
   - Name label positioning and readability
   - Purple curve rendering with dynamic scaling

4. **Component Integration**
   - Police car state management
   - Multiple instance handling with police support
   - Memory management for car images
   - Efficient position tracking and updates

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
