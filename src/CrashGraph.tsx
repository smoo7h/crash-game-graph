import * as React from "react";
import { CrashEngine, CrashEngineState } from "./CrashEngine";

interface PlayerData {
  name: string;
  crashPoint: number;
}

interface CrashGraphProps {
  crashPoint: number; // Multiplier at which the game crashes
  width?: number;     // Canvas width (default: 600)
  height?: number;    // Canvas height (default: 400)
  players?: PlayerData[]; // Array of players with their crash points
  overlayColor?: string; // Color of the semi-transparent overlay (default: rgba(0, 0, 0, 0.3))
}

export class CrashGraph extends React.Component<CrashGraphProps> {
  private canvasReference = React.createRef<HTMLCanvasElement>();
  private engine: CrashEngine = new CrashEngine();
  private timer?: number;
  private isComponentMounted = false;
  private xTickWidth = 2;
  
  // Car image properties
  // Background image properties
  private backgroundImage = new Image();
  private backgroundLoaded = false;

  // Car image properties
  private carImage = new Image();
  private carLoaded = false;
  private originalCarWidth = 193;
  private originalCarHeight = 50;
  private carScale = 0.3;
  private carWidth = this.originalCarWidth * this.carScale;
  private carHeight = this.originalCarHeight * this.carScale;
  
  // Police car properties
  private policeImage = new Image();
  private policeLoaded = false;
  private policeVisible = false;
  private policeTimer: number | null = null;
  private positionHistory: Array<{time: number, x: number, y: number, angle: number}> = [];
  
  // Siren animation properties
  private sirenState = false;
  private sirenLastToggle = 0;
  private readonly sirenRadius = 3;
  private sirenToggleInterval = 400; // Toggle every 500ms
  
  // Player cars
  private playerCars: Map<string, { image: HTMLImageElement, loaded: boolean }> = new Map();
  
  // Car rotation constants
  private readonly angleCutOff = 300;
  private readonly angleCalcConstant = 150;
  private lastMainCarAngle = -Math.PI / 4; // Track previous angle for smoothing
  private readonly angleSmoothingFactor = 0.3; // Higher = smoother (0.0-1.0)

  public componentDidMount() {
    this.isComponentMounted = true;
    const canvas = this.canvasReference.current;
    if (!canvas) return;

    // Load background image
    this.backgroundImage.src = `/assets/background_1.png`;
    this.backgroundImage.onload = () => {
      this.backgroundLoaded = true;
    };
    
    this.carImage.src = `/assets/tonicar.png`;
    this.carImage.onload = () => {
      this.carLoaded = true;
      this.carWidth = this.originalCarWidth * this.carScale;
      this.carHeight = this.originalCarHeight * this.carScale;
    };
    
    // Load police car image
    this.policeImage.src = "/assets/police.svg";
    this.policeImage.onload = () => {
      this.policeLoaded = true;
    };
    
    // Set timer to show police car after 1 second
    this.policeTimer = window.setTimeout(() => {
      this.policeVisible = true;
    }, 1000);
    
    // Load player car images
    if (this.props.players && this.props.players.length > 0) {
      this.props.players.forEach((player, index) => {
        if (player.crashPoint <= this.props.crashPoint) {
          const playerCarNumber = Math.floor(Math.random() * 7);
          const playerCarImage = new Image();
          playerCarImage.src = `/assets/car${playerCarNumber}.png`;
          
          this.playerCars.set(player.name, {
            image: playerCarImage,
            loaded: false
          });
          
          playerCarImage.onload = () => {
            const playerCarData = this.playerCars.get(player.name);
            if (playerCarData) {
              playerCarData.loaded = true;
              this.playerCars.set(player.name, playerCarData);
            }
          };
        }
      });
    }

    this.engine.onResize(canvas.width, canvas.height);
    this.engine.setCrashPoint(this.props.crashPoint);
    this.engine.startTime = Date.now();
    this.engine.state = CrashEngineState.Active;
    this.timer = requestAnimationFrame(() => this.tick()) as any as number;
  }

  public componentWillUnmount() {
    this.isComponentMounted = false;
    if (this.timer) {
      cancelAnimationFrame(this.timer);
    }
    if (this.policeTimer) {
      clearTimeout(this.policeTimer);
    }
    this.engine.destroy();
  }

  public tick() {
    const canvas = this.canvasReference.current;
    if (!canvas || !this.isComponentMounted) {
      return;
    }

    this.engine.tick();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Enable high quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.clearRect(0, 0, this.engine.graphWidth, this.engine.graphHeight);

    // Draw background image
    if (this.backgroundLoaded) {
      const scale = canvas.height / this.backgroundImage.height;
      const scaledWidth = this.backgroundImage.width * scale;
      const xOffset = (canvas.width - scaledWidth) / 2;
      
      ctx.drawImage(
        this.backgroundImage,
        xOffset, 0,
        scaledWidth, canvas.height
      );

      // Draw semi-transparent overlay
      ctx.fillStyle = this.props.overlayColor || 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw the multiplier curve
    ctx.beginPath();
    ctx.strokeStyle = "#853278"; // Purple curve
    ctx.lineWidth = 2;
    ctx.moveTo(0, this.engine.plotHeight);
    const a = this.engine.getElapsedPosition(this.engine.elapsedTime);
    const b = this.engine.getElapsedPosition(this.engine.elapsedTime / 2);
    ctx.quadraticCurveTo(b.x, b.y, a.x, a.y);
    ctx.stroke();
    
    // Calculate main car angle
    const currentPoint = a;
    const mainCarAngle = this.calculateCarAngle(currentPoint);
    
    // Store current angle for next frame
    this.lastMainCarAngle = mainCarAngle;

    // Calculate police car position and angle
    let policeCarData = null;
    if (this.policeLoaded && this.policeVisible) {
      const policeElapsedTime = Math.max(0, this.engine.elapsedTime - 1000);
      const policePosition = this.engine.getElapsedPosition(policeElapsedTime);
     
      
      if (this.engine.state === CrashEngineState.Over) {
        const timeSinceGameOver = Date.now() - (this.engine.startTime + this.engine.finalElapsed);
        const policeTimeAfterCrash = Math.max(0, policeElapsedTime + timeSinceGameOver);
        const targetTime = Math.min(policeTimeAfterCrash, this.engine.finalElapsed);
        
        const policeCatchUpPosition = this.engine.getElapsedPosition(targetTime);
      
        // Use the same angle calculation for police car

        policeCarData = {
          position: policeCatchUpPosition,
          angle: mainCarAngle
        };
      } else {
        
        policeCarData = {
          position: policePosition,
          angle: mainCarAngle
        };
      }
    }
    
    // Draw the main car
    if (this.carLoaded) {
      ctx.save();
      ctx.translate(currentPoint.x, currentPoint.y);
      ctx.rotate(mainCarAngle);
      ctx.drawImage(
        this.carImage,
        -this.carWidth / 2,
        -this.carHeight / 2,
        this.carWidth,
        this.carHeight
      );
      ctx.restore();
    }
    
    // Save the main car position for any needed calculations
    if (this.carLoaded) {
      this.positionHistory.push({
        time: this.engine.elapsedTime,
        x: currentPoint.x,
        y: currentPoint.y,
        angle: mainCarAngle
      });
      
      if (this.positionHistory.length > 1000) {
        this.positionHistory.shift();
      }
    }
    
    // Draw player cars and names at their crash points (before police car)
    if (this.props.players && this.props.players.length > 0) {
      this.props.players.forEach(player => {
        // Skip players whose crash point is greater than the game's crash point
        if (player.crashPoint > this.props.crashPoint) {
          return;
        }
        
        // Only show players whose crash point has been reached by the current multiplier
        if (this.engine.multiplier < player.crashPoint) {
          return;
        }
        
        // Get player car data
        const playerCarData = this.playerCars.get(player.name);
        if (!playerCarData || !playerCarData.loaded) {
          return;
        }
        
        // Calculate elapsed time for player's crash point using engine's method
        // We're using the multiplier elapsed time calculation to get the time for this crash point
        const playerCrashTime = this.engine.getMultiplierElapsed(player.crashPoint);
        
        // Calculate position on the curve
        const playerPosition = this.engine.getElapsedPosition(playerCrashTime);
        
        // Calculate player car angle
        const angle = this.calculateCarAngle(playerPosition);
        
        // Save canvas state
        ctx.save();
        
        // Translate to player's position
        ctx.translate(playerPosition.x, playerPosition.y);
        
        // Rotate canvas for car
        ctx.rotate(angle);
        
        // Draw the player's car
        ctx.drawImage(
          playerCarData.image,
          -this.carWidth / 2,  // Center horizontally
          -this.carHeight / 2, // Center vertically
          this.carWidth,
          this.carHeight
        );
        
        // Restore canvas to draw player name
        ctx.restore();
        
        // Draw player name
        ctx.save();
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#000000";
        
        // Add a background for better readability
        const textMeasure = ctx.measureText(player.name);
        const textHeight = textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent;
        const padding = 4;
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillRect(
          playerPosition.x - textMeasure.width/2 - padding,
          playerPosition.y - textHeight - this.carHeight/2 - padding*2,
          textMeasure.width + padding*2,
          textHeight + padding*2
        );
        
        // Draw the text
        ctx.fillStyle = "#000000";
        ctx.fillText(
          player.name,
          playerPosition.x - textMeasure.width/2,
          playerPosition.y - this.carHeight/2 - padding
        );
        
        ctx.restore();
      });
    }
    
    // Draw police car last (on top of everything)
    if (policeCarData && this.policeLoaded) {
      ctx.save();
      ctx.translate(policeCarData.position.x, policeCarData.position.y);
      ctx.rotate(policeCarData.angle);
      ctx.drawImage(
        this.policeImage,
        -this.carWidth / 2,
        -this.carHeight / 2,
        this.carWidth,
        this.carHeight
      );

      // Draw siren lights
      const currentTime = Date.now();
      if (currentTime - this.sirenLastToggle >= this.sirenToggleInterval) {
        this.sirenState = !this.sirenState;
        this.sirenLastToggle = currentTime;
      }

      // Position siren lights at the top center of the police car
      const yOffset = -this.carHeight / 2 - this.sirenRadius + 3;
      const xOffset = this.sirenRadius * 2;

      // Draw red siren (left)
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 0, 0, ${this.sirenState ? 1 : 0.2})`;
      ctx.arc(-xOffset, yOffset, this.sirenRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw blue siren (right)
      ctx.beginPath();
      ctx.fillStyle = `rgba(0, 0, 255, ${this.sirenState ? 0.2 : 1})`;
      ctx.arc((-xOffset - 4), yOffset, this.sirenRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Draw the current multiplier label
    ctx.font = "bold 50px sans-serif";
    ctx.fillStyle = "#FF6EC7"; // Florescent pink
    const labelText = this.engine.multiplier.toFixed(2) + "x";
    const textSize = ctx.measureText(labelText);
    ctx.fillText(
      labelText,
      this.engine.plotWidth / 2 - textSize.width / 2,
      this.engine.plotHeight / 2 -
        (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) / 2
    );

    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#FF6EC7";
    // ctx.strokeStyle = "#777";

    // Draw Y-axis with ticks and labels
    const yStepOffset = this.stepValues(this.engine.multiplier || 1);
    const yStepScale = this.engine.plotHeight / this.engine.yAxis;
 
    for (
      let offset = yStepOffset, step = 0;
      offset < this.engine.yAxis + yStepOffset && step <= 100;
      offset += yStepOffset, step++
    ) {
      const positionX = 0.5 + ~~this.engine.plotWidth + 15;
      const positionY = this.engine.plotHeight - offset * yStepScale;

      // Draw label
      const yLabelText =
        this.engine.getYMultiplier(positionY).toFixed(this.engine.multiplier > 2 ? 0 : 1) +
        "x";
      const yTextSize = ctx.measureText(yLabelText);
      ctx.fillText(
        yLabelText,
        positionX + 10,
        positionY + (yTextSize.actualBoundingBoxAscent + yTextSize.actualBoundingBoxDescent) / 2
      );

    }

    // Draw X-axis with ticks and labels
    const xStepOffset = this.stepValues(this.engine.xAxis, 5, 2);
    const xStepScale = this.engine.plotWidth / this.engine.xAxis;

    for (
      let offset = 0;
      offset < this.engine.xAxis + xStepOffset && offset / 1000 <= 100;
      offset += xStepOffset
    ) {
      const seconds = offset / 1000;
      const positionX = offset * xStepScale;
      const positionY = this.engine.plotHeight + 10;

      // Draw tick
      ctx.strokeStyle = "#FF6EC7";
      ctx.lineWidth = this.xTickWidth;
      ctx.beginPath();
      ctx.moveTo(positionX, positionY - this.xTickWidth / 2);
      ctx.lineTo(positionX, positionY + this.xTickWidth);
      ctx.stroke();
      ctx.strokeStyle = "#777";

      // Draw label
      const xLabelText = seconds.toFixed(0) + "s";
      const xTextSize = ctx.measureText(xLabelText);
      // ctx.fillText(xLabelText, positionX - xTextSize.width / 2, positionY + 15);
    }

    this.timer = requestAnimationFrame(() => this.tick()) as any as number;
  }

  private calculateCarAngle(position: { x: number; y: number }): number {
    let angle = -Math.PI / 4; // Default angle
    
    if (position.x >= this.angleCutOff) {
      
      if(this.sirenToggleInterval === 400){
        this.sirenToggleInterval = 200; // Toggle every 200ms
      }else{
        if(this.sirenToggleInterval > 50){
          this.sirenToggleInterval = this.sirenToggleInterval - 0.1;
        } 
      }
     

      const angleAdjustment = (this.angleCalcConstant - position.y) / 300;
      const calculatedAngle = angle - angleAdjustment;
      
      // Apply smoothing to prevent jiggling at higher multipliers
      const smoothedAngle = this.lastMainCarAngle * this.angleSmoothingFactor + 
                           calculatedAngle * (1 - this.angleSmoothingFactor);
      
      // Apply smoothed angle with dynamic threshold based on multiplier
      const maxAngleChange = 0.2 + (this.engine.multiplier / 100);
      const angleDifference = Math.abs(smoothedAngle - this.lastMainCarAngle);
      
      if (angleDifference > maxAngleChange) {
        // If change is too large, interpolate towards the target angle
        const direction = smoothedAngle > this.lastMainCarAngle ? 1 : -1;
        angle = this.lastMainCarAngle + (direction * maxAngleChange);
      } else {
        angle = smoothedAngle;
      }
    }
    
    return angle;
  }

  private stepValues(multiplier: number, e: number = 5, n: number = 2): number {
    for (let i = 0.4, r = 0.1; ; ) {
      if (multiplier < i) return r;
      r *= n;
      i *= e;
      if (multiplier < i) return r;
      r *= e;
      i *= n;
    }
  }

  public render() {
    const { width = 600, height = 400 } = this.props;
    return (
      <canvas
        ref={this.canvasReference}
        width={width}
        height={height}
      />
    );
  }
}
