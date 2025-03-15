export enum CrashEngineState {
    Loading = "loading",
    Active = "active",
    Over = "over",
  }
  
  export class CrashEngine {
    public static BaseCrashSpeed = 0.00018; // Base multiplier growth rate per millisecond
    public static AcceleratedCrashSpeed = 0.00036; // Accelerated multiplier growth rate per millisecond
    private static TransitionPoint = 5; // Point at which acceleration kicks in
    public static PredictingLapse = 300;

    public startTime = 0;
    public elapsedTime = 0;
    public finalElapsed = 0;
    public finalMultiplier = 0;
    public crashPoint: number | null = null;
    private crashTime: number | null = null; // Time when crash occurs
    public betAmount = 0;
    public graphWidth = 0;
    public graphHeight = 0;
    public plotWidth = 0;
    public plotHeight = 0;
    public plotOffsetX = 0;
    public plotOffsetY = 0;
    public xAxis = 0;
    public yAxis = 0;
    public xIncrement = 0;
    public yIncrement = 0;
    public xAxisMinimum = 5000;
    public yAxisMinimum = -1;
    public elapsedOffset = 0;
    public yAxisMultiplier = 1.5;
    public multiplier = 1;
    public tickTimeout: number | null = null;
    public lag = false;
    public lastGameTick: number | null = null;
    public lagTimeout: number | null = null;
    public state = CrashEngineState.Loading;
    public checkForLag = (() => {
      this.lag = true;
    });
  
    public onResize(width: number, height: number) {
      this.graphWidth = width;
      this.graphHeight = height;
      this.plotOffsetX = 50;
      this.plotOffsetY = 40;
      this.plotWidth = width - this.plotOffsetX;
      this.plotHeight = height - this.plotOffsetY;
    }
  
    public setCrashPoint(crashPoint: number) {
      this.crashPoint = crashPoint;
      
      // Calculate crash time based on whether we'll hit the transition point
      if (crashPoint <= CrashEngine.TransitionPoint) {
        this.crashTime = Math.log(crashPoint) / CrashEngine.BaseCrashSpeed;
      } else {
        // Time to reach transition point + time to reach final point from there
        const timeToTransition = Math.log(CrashEngine.TransitionPoint) / CrashEngine.BaseCrashSpeed;
        const remainingMultiplier = crashPoint / CrashEngine.TransitionPoint;
        const timeAfterTransition = Math.log(remainingMultiplier) / CrashEngine.AcceleratedCrashSpeed;
        this.crashTime = timeToTransition + timeAfterTransition;
      }
    }
  
    public getMultiplierElapsed(multiplier: number) {
      if (multiplier <= CrashEngine.TransitionPoint) {
        return 100 * Math.ceil(Math.log(multiplier) / Math.log(Math.E) / CrashEngine.BaseCrashSpeed / 100);
      } else {
        // Calculate time to transition point
        const timeToTransition = Math.log(CrashEngine.TransitionPoint) / CrashEngine.BaseCrashSpeed;
        
        // Calculate remaining time using accelerated speed
        const remainingMultiplier = multiplier / CrashEngine.TransitionPoint;
        const timeAfterTransition = Math.log(remainingMultiplier) / CrashEngine.AcceleratedCrashSpeed;
        
        return 100 * Math.ceil((timeToTransition + timeAfterTransition) / 100);
      }
    }
  
    public getElapsedPayout(elapsedTime: number) {
      // For payouts up to transition point, use base speed
      const transitionTime = Math.log(CrashEngine.TransitionPoint) / CrashEngine.BaseCrashSpeed;
      
      if (elapsedTime <= transitionTime) {
        const payout = ~~(100 * Math.pow(Math.E, CrashEngine.BaseCrashSpeed * elapsedTime)) / 100;
        if (!isFinite(payout)) {
          throw new Error("Infinite payout");
        }
        return Math.max(payout, 1);
      }

      // For payouts above transition point, use accelerated speed
      const remainingTime = elapsedTime - transitionTime;
      const payout = ~~(100 * CrashEngine.TransitionPoint * Math.pow(Math.E, CrashEngine.AcceleratedCrashSpeed * remainingTime)) / 100;
      if (!isFinite(payout)) {
        throw new Error("Infinite payout");
      }
      return Math.max(payout, 1);
    }
  
    public onGameTick(serverTick: number) {
      this.lastGameTick = Date.now();
      if (this.lag) {
        this.lag = false;
      }
      const lag = this.lastGameTick - serverTick;
      if (this.startTime > lag) {
        this.startTime = lag;
      }
      if (this.lagTimeout) {
        clearTimeout(this.lagTimeout);
      }
      this.lagTimeout = (setTimeout(
        this.checkForLag,
        CrashEngine.PredictingLapse
      ) as any) as number;
    }
  
    public tick() {
      if (this.state === CrashEngineState.Active && this.crashTime !== null) {
        const currentElapsed = Date.now() - this.startTime;
        if (currentElapsed >= this.crashTime) {
          this.state = CrashEngineState.Over;
          this.finalElapsed = this.crashTime;
          this.finalMultiplier = this.crashPoint!;
        }
      }
  
      this.elapsedTime = this.getElapsedTime();
      this.multiplier =
        this.state !== CrashEngineState.Over
          ? this.getElapsedPayout(this.elapsedTime)
          : this.finalMultiplier;
      this.yAxisMinimum = this.yAxisMultiplier;
      this.xAxis = Math.max(this.elapsedTime + this.elapsedOffset, this.xAxisMinimum);
      this.yAxis = Math.max(this.multiplier, this.yAxisMinimum);
      this.xIncrement = this.plotWidth / this.xAxis;
      this.yIncrement = this.plotHeight / this.yAxis;
    }
  
    public destroy() {
      if (this.tickTimeout) {
        clearTimeout(this.tickTimeout);
      }
      if (this.lagTimeout) {
        clearTimeout(this.lagTimeout);
      }
    }
  
    public getElapsedTime() {
      if (this.state === CrashEngineState.Over) {
        return this.finalElapsed;
      }
      if (this.state !== CrashEngineState.Active) {
        return 0;
      }
      return Date.now() - this.startTime;
    }
  
    public getElapsedPosition(elapsedTime: number) {
      const elapsedPayout = this.getElapsedPayout(elapsedTime) - 1;
      return {
        x: elapsedTime * this.xIncrement,
        y: this.plotHeight - elapsedPayout * this.yIncrement,
      };
    }
  
    public getYMultiplier(yPosition: number) {
      return (
        Math.ceil(1000 * (this.yAxis - (yPosition / this.plotHeight) * this.yAxis + 1)) /
        1000
      );
    }
  
    public getMultiplierY(multiplier: number) {
      return this.plotHeight - (multiplier - 1) * this.yIncrement;
    }
  }
