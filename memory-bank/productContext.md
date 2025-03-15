# Product Context: Crash Game Graph Control

## Purpose
The Crash Game Graph Control provides a crucial visual component for crash-style betting games, where players bet on when they think a multiplier curve will crash. This visualization helps players understand the game mechanics and make informed decisions.

## Problems Solved
1. **Real-time Visualization**
   - Shows the live progression of multiplier values
   - Provides immediate visual feedback of crash points
   - Helps players understand game progression
   - Displays player crash points with cars and names
   - Shows player outcomes as they occur

2. **Multi-instance Display**
   - Allows comparison of different crash scenarios
   - Demonstrates how different crash points affect curve behavior
   - Enables side-by-side analysis of game mechanics
   - Shows multiple player scenarios simultaneously

3. **Clear Data Representation**
   - Dynamic axis scaling for different multiplier ranges
   - Clear labeling of time and multiplier values
   - Smooth curve animation for better comprehension
   - Visual player identification through cars and names
   - Player outcomes appear at correct multiplier points

## User Experience Goals
1. **Intuitive Understanding**
   - Clear visual representation of multiplier progression
   - Easy-to-read axis labels and values
   - Smooth animations for natural progression feeling

2. **Performance**
   - Consistent 60 FPS animation
   - No visual lag or stuttering
   - Responsive to window/container size changes

3. **Clarity**
   - Purple curve for good visibility against light background
   - Bold multiplier display in center of graph
   - Clear tick marks and value labels

## Integration Context
- Designed to be embedded in larger game applications
- Supports customizable dimensions for flexible layout integration
- Multiple instances can run simultaneously for comparison purposes
- Component accepts crash point as prop for easy configuration
