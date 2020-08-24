import Paho from "paho-mqtt";

/**
 *
 */
class Api {
  client: any = null;
  messageHandler: any = null;

  reset() {
    // This resets the back end tick counter
    this.client.send("kerhosprint_commands", "start_race");
  }

  start() {
    this.client.send("kerhosprint_commands", "start_race");
    this.client.subscribe("p1");
    this.client.subscribe("p2");
  }

  connect(url: string, port: number) {
    if(this.client != null) {
      // Disconnect old session first if possible
      this.client?.end(true);
    }

    this.client = new Paho.Client(url, port, "client_id");
    this.client.onConnectionLost = console.error;
    this.client.onMessageArrived = this.messageHandler;
    this.client.connect();
  }

  constructor(messageHandler: any) {
    this.messageHandler = messageHandler;
  }
}

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
    this.ticksPerHour = 0;
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
  api: any = undefined;
  tickCountToFinish: number = 0;
  p1FinishingTime: number | null = null;
  p2FinishingTime: number | null = null;
  reset() {
    this.p1TickCount = 0;
    this.p2TickCount = 0;
    this.api.reset();
    this.p1TickPerHourCounter.reset();
    this.p2TickPerHourCounter.reset();
    this.p1FinishingTime = null;
    this.p2FinishingTime = null;
  }
  connect(url: string, port: number) {
    this.api.connect(url, port);
  }
  start() {
    this.api.start();
  }
  setTickCountToFinish(tickCountToFinish: number) {
    this.tickCountToFinish = tickCountToFinish;
  }
  getTicks() {
    return {
      p1TickCount: this.p1TickCount,
      p2TickCount: this.p2TickCount,
      p1TicksPerHour: this.p1TickPerHourCounter.getTicksPerHour(),
      p2TicksPerHour: this.p2TickPerHourCounter.getTicksPerHour(),
      p1FinishingTime: this.p1FinishingTime,
      p2FinishingTime: this.p2FinishingTime,
    };
  }
  constructor() {
    this.p1TickPerHourCounter = createTicksPerHourCounter();
    this.p2TickPerHourCounter = createTicksPerHourCounter();
    var that = this;
    function messageHandler(message: any) {
      const topic = message.destinationName;
      const count = Number(message.payloadString);

      if (topic === "p1") {
        that.p1TickPerHourCounter.onNewTickCount(count);
        that.p1TickCount = count;

        if (
          that.p1TickCount >= that.tickCountToFinish &&
          !that.p1FinishingTime
        ) {
          that.p1FinishingTime = Date.now();
        }
      } else if (topic === "p2") {
        that.p2TickPerHourCounter.onNewTickCount(count);
        that.p2TickCount = count;

        if (count >= that.tickCountToFinish && !that.p2FinishingTime) {
          that.p2FinishingTime = Date.now();
        }
      }
    }
    this.api = new Api(messageHandler);
  }
}
