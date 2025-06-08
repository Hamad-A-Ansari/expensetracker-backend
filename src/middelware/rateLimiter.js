import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    // const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // const result = await ratelimit.limit(ip);

    // if (!result.success) {
    //   return res.status(429).json({ error: 'Too many requests, please try again later.' });
    // }

    // TODO -> Using a fixed key for demonstration purposes, replace with dynamic key as needed using user ID or IP address
    const {success} = await ratelimit.limit("my-rate-limiter");

    if (!success) {
      return res.status(429).json({ error: 'Too many requests, please try again later.' });
    }

    next();
  } catch (error) {
    console.error('Rate Limiter Error:', error);
    next(error);
  }
}

export default ratelimiter;