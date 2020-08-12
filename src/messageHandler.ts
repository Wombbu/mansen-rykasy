const createApiSimulator = (messageHandler: any) => ({
    interval: null,
    countP1: 0,
    countP2: 0,

    reset() {
        clearInterval(this.interval);
        this.countP1 = 0;
        this.countP2 = 0;
    },
    playersStartRiding() { // Just for debugging. Not needed in final products
        this.interval = setInterval(() => {
            this.countP1++;
            this.countP2 += 2;
            messageHandler({p1: this.countP1, p2: this.countP2});
        }, 13);
    }
});

const createTicksPerHourCounter = () => ({
    lastCountTimestamp: null,
    lastCount: 0,
    ticksPerHour: 0,

    onNewTickCount(newCount: number) {
        const timeStamp = Date.now();
        if (timeStamp > (this.lastCountTimestamp || 0) + 1000) {
            return;
        }
        const hourMs = 3600000;
        const timeElapsed = timeStamp - (this.lastCountTimestamp || 0);
        this.ticksPerHour = (newCount - this.lastTickMeasured || 0) * (hourMs / timeElapsed);
        this.lastCountTimestamp = timeStamp;
        
    },
    reset() {
        this.lastCountMeasured = 0;
        this.lastCount = 0;
    },
    getTicksPerHour() {
        return this.ticksPerHour;
    }
})

export const messageHandler = {
    p1TickCount: 0,
    p2TickCount: 0,
    p1TickPerHourCounter: createTicksPerHourCounter(),
    p2TickPerHourCounter: createTicksPerHourCounter(),
    apiSimulator: createApiSimulator(this.messageHandler),
    messageHandler({p1, p2}: {p1: number, p2: number}) {
        this.p1TickPerHourCounter.onNewTickCount(p1);
        this.p2TickPerHourCounter.onNewTickCount(p2);
        this.p1TickCount = p1;
        this.p2TickCount = p2;
    },
    reset() {
        this.apiSimulator.reset();
        this.p1TickPerHourCounter.reset();
        this.p2TickPerHourCounter.reset();
    },
    playersStartRiding() { // Just for debugging. Not needed in final product
        this.apiSimulator.playersStartRiding();
    },
    getLatest() {
        return {
            p1TickCount,
            p2TickCount,
            p1TicksPerHour: this.p1TickPerHourCounter.getTicksPerHour(),
            p2TicksPerHour: this.p2TickPerHourCounter.getTicksPerHour(),
        }
    }
}