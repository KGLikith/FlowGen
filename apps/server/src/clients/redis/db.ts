import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL || "", {
  maxRetriesPerRequest: null, 
  reconnectOnError: (err) => {
    console.error("Redis reconnecting due to error:", err);
    return true;
  },
  retryStrategy: (times) => {
    if (times > 10) {
      console.error("Redis retry limit reached");
      return null;
    }
    return Math.min(times * 200, 2000); // Exponential backoff
  },
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// redisClient.on("connect", () => {
//   console.log("Connected to Redis successfully!");
// });

export default redisClient;
