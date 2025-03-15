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
}

export class CrashGraph extends React.Component<CrashGraphProps> {
  private canvasReference = React.createRef<HTMLCanvasElement>();
  private engine: CrashEngine = new CrashEngine();
  private timer?: number;
  private isComponentMounted = false;
  private yTickWidth = 2;
  private xTickWidth = 2;
  
  // Car image properties
  private carImage = new Image();
  private carLoaded = false;
  private originalCarWidth = 193;
  private originalCarHeight = 50;
  private carScale = 0.25;
  private carWidth = this.originalCarWidth * this.carScale;
  private carHeight = this.originalCarHeight * this.carScale;
  
  // Player cars
  private playerCars: Map<string, { image: HTMLImageElement, loaded: boolean }> = new Map();
  
  // Car rotation constants
  private readonly angleCutOff = 350;
  private readonly angleCalcConstant = 145;

  public componentDidMount() {
    this.isComponentMounted = true;
    const canvas = this.canvasReference.current;
    if (!canvas) return;
    
    // Load main car image
    const carNumber = Math.floor(Math.random() * 7);
   
    this.carImage.src = `/assets/car${carNumber}.png`;
    this.carImage.onload = () => {
      this.carLoaded = true;
      this.carWidth = this.originalCarWidth * this.carScale;
      this.carHeight = this.originalCarHeight * this.carScale;
    };
    
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

    ctx.clearRect(0, 0, this.engine.graphWidth, this.engine.graphHeight);

    // Draw the multiplier curve
    ctx.beginPath();
    ctx.strokeStyle = "#853278"; // Purple curve
    ctx.lineWidth = 2;
    ctx.moveTo(0, this.engine.plotHeight);
    const a = this.engine.getElapsedPosition(this.engine.elapsedTime);
    const b = this.engine.getElapsedPosition(this.engine.elapsedTime / 2);
    ctx.quadraticCurveTo(b.x, b.y, a.x, a.y);
    ctx.stroke();
    
    // Draw car at the front of the curve
    if (this.carLoaded) {
      // Get current position (front of curve)
      const currentPoint = a;
      
      // Always use a fixed angle pointing up and to the right
      // -45 degrees or -Math.PI/4 (-0.785 radians)
      let angle = -Math.PI / 4;
      
      if(currentPoint.x >= this.angleCutOff) {
        // Rotate car to the right
        const angleAdjustment = (this.angleCalcConstant - currentPoint.y) / 333;
        angle = angle - angleAdjustment;
      }
     
      // Save current canvas state
      ctx.save();
      
      // Translate to current position (front of the curve)
      ctx.translate(currentPoint.x, currentPoint.y);
      
      // Rotate canvas to fixed angle (up and right)
      ctx.rotate(angle);

      // Draw the car image
      ctx.drawImage(
        this.carImage,
        -this.carWidth / 2,  // Center horizontally
        -this.carHeight / 2, // Center vertically
        this.carWidth,
        this.carHeight
      );
      
      // Restore canvas state
      ctx.restore();
    }
    
    // Draw player cars and names at their crash points
    if (this.props.players && this.props.players.length > 0) {
      this.props.players.forEach(player => {
        // Skip players whose crash point is greater than the game's crash point
        if (player.crashPoint > this.props.crashPoint) {
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
        
        // Draw the player's car
        // Set angle for car based on position
        let angle = -Math.PI / 4; // Default angle (up and right)
        
        if(playerPosition.x >= this.angleCutOff) {
          const angleAdjustment = (this.angleCalcConstant - playerPosition.y) / 333;
          angle = angle - angleAdjustment;
        }
        
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

    // Draw the current multiplier label
    ctx.font = "bold 50px sans-serif";
    ctx.fillStyle = "red";
    const labelText = this.engine.multiplier.toFixed(2) + "x";
    const textSize = ctx.measureText(labelText);
    ctx.fillText(
      labelText,
      this.engine.plotWidth / 2 - textSize.width / 2,
      this.engine.plotHeight / 2 -
        (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) / 2
    );

    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#222";
    ctx.strokeStyle = "#777";

    // Draw Y-axis with ticks and labels
    const yStepOffset = this.stepValues(this.engine.multiplier || 1);
    const yStepScale = this.engine.plotHeight / this.engine.yAxis;
    const ySubStepOffset = yStepOffset * yStepScale;
    const ySubSteps =
      Math.max(
        2,
        Math.min(16, ~~(ySubStepOffset / Math.max(3, this.engine.yAxis / yStepOffset)))
      ) +
      (Math.max(
        2,
        Math.min(16, ~~(ySubStepOffset / Math.max(3, this.engine.yAxis / yStepOffset)))
      ) % 2);

    for (
      let offset = yStepOffset, step = 0;
      offset < this.engine.yAxis + yStepOffset && step <= 100;
      offset += yStepOffset, step++
    ) {
      const positionX = 0.5 + ~~this.engine.plotWidth + 15;
      const positionY = this.engine.plotHeight - offset * yStepScale;

      // Draw tick
      ctx.strokeStyle = "#444";
      ctx.lineWidth = this.yTickWidth;
      ctx.beginPath();
      ctx.moveTo(positionX - this.yTickWidth, positionY);
      ctx.lineTo(positionX, positionY);
      ctx.stroke();
      ctx.strokeStyle = "#777";

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

      // Draw sub-ticks
      for (let o = 1; o < ySubSteps; o++) {
        const isMiddleSubStep = o === ySubSteps / 2;
        const subStepWidth = isMiddleSubStep ? 12 : 7;
        const subStepPositionY = 0.5 + ~~(positionY + (ySubStepOffset / ySubSteps) * o);
        ctx.beginPath();
        ctx.moveTo(positionX - subStepWidth, subStepPositionY);
        ctx.lineTo(positionX, subStepPositionY);
        ctx.stroke();
      }
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
      ctx.strokeStyle = "#444";
      ctx.lineWidth = this.xTickWidth;
      ctx.beginPath();
      ctx.moveTo(positionX, positionY - this.xTickWidth / 2);
      ctx.lineTo(positionX, positionY + this.xTickWidth);
      ctx.stroke();
      ctx.strokeStyle = "#777";

      // Draw label
      const xLabelText = seconds.toFixed(0) + "s";
      const xTextSize = ctx.measureText(xLabelText);
      ctx.fillText(xLabelText, positionX - xTextSize.width / 2, positionY + 15);
    }

    this.timer = requestAnimationFrame(() => this.tick()) as any as number;
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
        style={{ background: "#e2e2e2" }}
        ref={this.canvasReference}
        width={width}
        height={height}
      />
    );
  }
}
