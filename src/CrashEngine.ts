interface CrashEngineConfig {
  baseCrashSpeed: number;
  acceleratedCrashSpeed: number;
  transitionPoint: number;
  predictingLapse: number;
  defaultXAxisMinimum: number;
  defaultYAxisMinimum: number;
  defaultYAxisMultiplier: number;
}

interface Position {
  x: number;
  y: number;
}

interface GraphDimensions {
  width: number;
  height: number;
  plotOffsetX: number;
  plotOffsetY: number;
  plotWidth: number;
  plotHeight: number;
}

export enum CrashEngineState {
  Loading = "loading",
  Active = "active",
  Over = "over",
}

export class CrashEngine {
  private static readonly CONFIG: CrashEngineConfig = {
    baseCrashSpeed: 0.00018,
    acceleratedCrashSpeed: 0.00036,
    transitionPoint: 5,
    predictingLapse: 300,
    defaultXAxisMinimum: 5000,
    defaultYAxisMinimum: -1,
    defaultYAxisMultiplier: 1.5
  };

  private dimensions: GraphDimensions = {
    width: 0,
    height: 0,
    plotOffsetX: 50,
    plotOffsetY: 40,
    plotWidth: 0,
    plotHeight: 0
  };

  private startTime = 0;
  private elapsedTime = 0;
  private finalElapsed = 0;
  private finalMultiplier = 0;
  private crashPoint: number | null = null;
  private crashTime: number | null = null;
  private multiplier = 1;
  private elapsedOffset = 0;
  private xAxis = 0;
  private yAxis = 0;
  private xIncrement = 0;
  private yIncrement = 0;
  private yAxisMultiplier = CrashEngine.CONFIG.defaultYAxisMultiplier;

  // Lag handling properties
  private tickTimeout: number | null = null;
  private lag = false;
  private lastGameTick: number | null = null;
  private lagTimeout: number | null = null;

  public state = CrashEngineState.Loading;

  private checkForLag = () => {
    this.lag = true;
  };

  public onResize(width: number, height: number): void {
    this.dimensions = {
      width,
      height,
      plotOffsetX: 50,
      plotOffsetY: 40,
      plotWidth: width - 50,
      plotHeight: height - 40
    };
  }

  private calculateCrashTime(crashPoint: number): number {
    if (crashPoint <= CrashEngine.CONFIG.transitionPoint) {
      return Math.log(crashPoint) / CrashEngine.CONFIG.baseCrashSpeed;
    }
    
    const timeToTransition = Math.log(CrashEngine.CONFIG.transitionPoint) / CrashEngine.CONFIG.baseCrashSpeed;
    const remainingMultiplier = crashPoint / CrashEngine.CONFIG.transitionPoint;
    const timeAfterTransition = Math.log(remainingMultiplier) / CrashEngine.CONFIG.acceleratedCrashSpeed;
    
    return timeToTransition + timeAfterTransition;
  }

  public setCrashPoint(crashPoint: number): void {
    this.crashPoint = crashPoint;
    this.crashTime = this.calculateCrashTime(crashPoint);
  }

  public getMultiplierElapsed(multiplier: number): number {
    if (multiplier <= CrashEngine.CONFIG.transitionPoint) {
      return 100 * Math.ceil(Math.log(multiplier) / Math.log(Math.E) / CrashEngine.CONFIG.baseCrashSpeed / 100);
    }

    const timeToTransition = Math.log(CrashEngine.CONFIG.transitionPoint) / CrashEngine.CONFIG.baseCrashSpeed;
    const remainingMultiplier = multiplier / CrashEngine.CONFIG.transitionPoint;
    const timeAfterTransition = Math.log(remainingMultiplier) / CrashEngine.CONFIG.acceleratedCrashSpeed;
    
    return 100 * Math.ceil((timeToTransition + timeAfterTransition) / 100);
  }

  private validatePayout(payout: number): number {
    if (!isFinite(payout)) {
      throw new Error("Infinite payout calculated");
    }
    return Math.max(payout, 1);
  }

  public getElapsedPayout(elapsedTime: number): number {
    const transitionTime = Math.log(CrashEngine.CONFIG.transitionPoint) / CrashEngine.CONFIG.baseCrashSpeed;
    
    if (elapsedTime <= transitionTime) {
      const payout = ~~(100 * Math.pow(Math.E, CrashEngine.CONFIG.baseCrashSpeed * elapsedTime)) / 100;
      return this.validatePayout(payout);
    }

    const remainingTime = elapsedTime - transitionTime;
    const payout = ~~(100 * CrashEngine.CONFIG.transitionPoint * 
      Math.pow(Math.E, CrashEngine.CONFIG.acceleratedCrashSpeed * remainingTime)) / 100;
    return this.validatePayout(payout);
  }

  public onGameTick(serverTick: number): void {
    this.lastGameTick = Date.now();
    this.handleLagUpdate(serverTick);
  }

  private handleLagUpdate(serverTick: number): void {
    if (this.lag) {
      this.lag = false;
    }

    const lag = this.lastGameTick! - serverTick;
    if (this.startTime > lag) {
      this.startTime = lag;
    }

    if (this.lagTimeout) {
      clearTimeout(this.lagTimeout);
    }

    this.lagTimeout = (setTimeout(
      this.checkForLag,
      CrashEngine.CONFIG.predictingLapse
    ) as any) as number;
  }

  public tick(): void {
    if (this.shouldFinishGame()) {
      this.finishGame();
    }

    this.updateGameState();
  }

  private shouldFinishGame(): boolean {
    return this.state === CrashEngineState.Active && 
           this.crashTime !== null && 
           (Date.now() - this.startTime) >= this.crashTime;
  }

  private finishGame(): void {
    this.state = CrashEngineState.Over;
    this.finalElapsed = this.crashTime!;
    this.finalMultiplier = this.crashPoint!;
  }

  private updateGameState(): void {
    this.elapsedTime = this.getElapsedTime();
    this.multiplier = this.state !== CrashEngineState.Over
      ? this.getElapsedPayout(this.elapsedTime)
      : this.finalMultiplier;

    this.updateAxisValues();
  }

  private updateAxisValues(): void {
    this.xAxis = Math.max(this.elapsedTime + this.elapsedOffset, CrashEngine.CONFIG.defaultXAxisMinimum);
    this.yAxis = Math.max(this.multiplier, this.yAxisMultiplier);
    this.xIncrement = this.dimensions.plotWidth / this.xAxis;
    this.yIncrement = this.dimensions.plotHeight / this.yAxis;
  }

  public destroy(): void {
    if (this.tickTimeout) {
      clearTimeout(this.tickTimeout);
    }
    if (this.lagTimeout) {
      clearTimeout(this.lagTimeout);
    }
  }

  // Public getters for properties needed by CrashGraph
  public getStartTime(): number {
    return this.startTime;
  }

  public setStartTime(time: number): void {
    this.startTime = time;
  }

  public getElapsedTime(): number {
    if (this.state === CrashEngineState.Over) {
      return this.finalElapsed;
    }
    if (this.state !== CrashEngineState.Active) {
      return 0;
    }
    return Date.now() - this.startTime;
  }

  public getFinalElapsed(): number {
    return this.finalElapsed;
  }

  public getGraphHeight(): number {
    return this.dimensions.height;
  }

  public getGraphWidth(): number {
    return this.dimensions.width;
  }

  public getPlotHeight(): number {
    return this.dimensions.plotHeight;
  }

  public getPlotWidth(): number {
    return this.dimensions.plotWidth;
  }

  public getXAxis(): number {
    return this.xAxis;
  }

  public getYAxis(): number {
    return this.yAxis;
  }

  public getMultiplier(): number {
    return this.multiplier;
  }

  public getXIncrement(): number {
    return this.xIncrement;
  }

  public getYIncrement(): number {
    return this.yIncrement;
  }

  public getElapsedPosition(elapsedTime: number): Position {
    const elapsedPayout = this.getElapsedPayout(elapsedTime) - 1;
    
    return {
      x: elapsedTime * this.xIncrement,
      y: this.dimensions.plotHeight - elapsedPayout * this.yIncrement,
    };
  }

  public getYMultiplier(yPosition: number): number {
    return Math.ceil(1000 * (this.yAxis - (yPosition / this.dimensions.plotHeight) * this.yAxis + 1)) / 1000;
  }

  public getMultiplierY(multiplier: number): number {
    return this.dimensions.plotHeight - (multiplier - 1) * this.yIncrement;
  }
}
