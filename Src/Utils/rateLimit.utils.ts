class RateLimiter {
  private rateLimits: Map<string, Map<string, {count: number, timestamp: number;}>> = new Map();

  constructor(private limit: number, private limitWindow: number) {}

  public checkRateLimit(room: string, userName: string): boolean {
    const currentTime = Date.now();
    
    // Check if room exist 
    if (!this.rateLimits.has(room)) {
      this.rateLimits.set(room, new Map <string, { count: number, timestamp: number}>);
      const roomRateLimits = this.rateLimits.get(room)!;
      roomRateLimits.set(userName, { count: 1, timestamp: currentTime});

      return true;
    };

    const roomRateLimits = this.rateLimits.get(room)!;

    // check if user first time to hit this endpoint
    if (!roomRateLimits.has(userName)) {
      roomRateLimits.set(userName, { count: 1, timestamp: currentTime});
      return true;
    }

    const userLimit = roomRateLimits.get(userName)!;

    if (currentTime - userLimit.timestamp > this.limitWindow) {
      // Reset the count if the time has passed
      userLimit.timestamp = currentTime;
      userLimit.count = 1;
      return true;
    }

    if (userLimit.count < this.limit) {
      userLimit.count++;
      return true;
    }

    return false;
  }
};

export const rateLimiter = new RateLimiter(5, 60 * 1000);

