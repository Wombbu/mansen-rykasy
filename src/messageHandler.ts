const ApiSimulator = (messageHandler: any) => ({
  interval: 0,
  countP1: 0,
  countP2: 0,

  reset() {
    clearInterval(this.interval);
    this.countP1 = 0;
    this.countP2 = 0;
  },
  playersStartRiding() {
    // Just for debugging. Not needed in final products
    this.interval = setInterval(() => {
      this.countP1++;
      this.countP2 += 2;
      messageHandler({ p1: this.countP1, p2: this.countP2 });
    }, 20);
  },
});

const createTicksPerHourCounter = () => ({
  lastCountTimestamp: 0,
  lastCount: 0,
  ticksPerHour: 0,

  onNewTickCount(newCount: number) {
    const timeStamp = Date.now();

    if (timeStamp < (this.lastCountTimestamp || 0) + 1000) {
      return;
    }
    const hourMs = 3600000;
    const timeElapsed = timeStamp - (this.lastCountTimestamp || 0);

    this.ticksPerHour =
      (newCount - this.lastCount || 0) * (hourMs / timeElapsed);
    this.lastCountTimestamp = timeStamp;
    this.lastCount = newCount;
  },
  reset() {
    this.lastCountTimestamp = 0;
    this.lastCount = 0;
  },
  getTicksPerHour() {
    return this.ticksPerHour;
  },
});

export interface Ticks {
  p1TickCount: number;
  p2TickCount: number;
  p1TicksPerHour: number;
  p2TicksPerHour: number;
  p1FinishingTime: number | null;
  p2FinishingTime: number | null;
}

export class MessageHandler {
  p1TickCount = 0;
  p2TickCount = 0;
  p1TickPerHourCounter: any = undefined;
  p2TickPerHourCounter: any = undefined;
  apiSimulator: any = undefined;
  tickCountToFinish: number = 0;
  p1FinishingTime: number | null = null;
  p2FinishingTime: number | null = null;
  reset() {
    this.apiSimulator.reset();
    this.p1TickPerHourCounter.reset();
    this.p2TickPerHourCounter.reset();
    this.p1FinishingTime = null;
    this.p2FinishingTime = null;
  }
  playersStartRiding() {
    // Just for debugging. Not needed in final product
    this.apiSimulator.playersStartRiding();
  }
  setTickCountToFinish(tickCountToFinish: number) {
    this.tickCountToFinish = tickCountToFinish
  }
  getTicks() {
    return {
      p1TickCount: this.p1TickCount,
      p2TickCount: this.p2TickCount,
      p1TicksPerHour: this.p1TickPerHourCounter.getTicksPerHour(),
      p2TicksPerHour: this.p2TickPerHourCounter.getTicksPerHour(),
      p1FinishingTime: this.p1FinishingTime,
      p2FinishingTime: this.p2FinishingTime
    };
  }
  constructor() {
    this.p1TickPerHourCounter = createTicksPerHourCounter();
    this.p2TickPerHourCounter = createTicksPerHourCounter();
    var that = this;
    function messageHandler({ p1, p2 }: { p1: number; p2: number }) {
      that.p1TickPerHourCounter.onNewTickCount(p1);
      that.p2TickPerHourCounter.onNewTickCount(p2);
      that.p1TickCount = p1;
      that.p2TickCount = p2;
      if (p1 >= that.tickCountToFinish && !that.p1FinishingTime) {
        that.p1FinishingTime = Date.now();
      }
      if (p2 >= that.tickCountToFinish && !that.p2FinishingTime) {
        that.p2FinishingTime = Date.now();
      } 
    }
    this.apiSimulator = ApiSimulator(messageHandler);
  }
}