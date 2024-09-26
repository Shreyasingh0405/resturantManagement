import crypto from "crypto"
function generateUniqueToken() {
  return crypto.randomBytes(20).toString("hex");
}
const otpGenerate = () => {
  let otp = Math.random().toString().substring(2, 8);
  if (otp.length !== 6) {
    otpGenerate();
  } else {
    return otp;
  }
};
// rateLimiter.js
import rateLimit from 'express-rate-limit';
const logoutLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per minute
  message: "Too many logout requests, please try again later."
});


export default { generateUniqueToken, otpGenerate,logoutLimiter };

