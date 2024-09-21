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
export default { generateUniqueToken, otpGenerate };

