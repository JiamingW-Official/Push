import crypto from "crypto";

const DEMO_SALT = process.env.DEMO_SALT ?? "push-demo-salt-2026";
const STEP = 15; // 15 second windows for demo

function getCounter(offsetSteps = 0): number {
  return Math.floor(Date.now() / 1000 / STEP) + offsetSteps;
}

function counterToCode(token: string, counter: number): string {
  const key = crypto
    .createHmac("sha256", DEMO_SALT)
    .update(token)
    .digest("hex");
  const hmac = crypto
    .createHmac("sha256", key)
    .update(String(counter))
    .digest("hex");
  // Take last 6 digits
  const num = parseInt(hmac.slice(-8), 16) % 1_000_000;
  return String(num).padStart(6, "0");
}

export function generateCode(token: string): string {
  return counterToCode(token, getCounter());
}

export function verifyCode(token: string, inputCode: string): boolean {
  const cleaned = inputCode.replace(/\D/g, "");
  if (cleaned.length !== 6) return false;
  // Accept current window and previous window (up to 30s grace)
  return (
    counterToCode(token, getCounter()) === cleaned ||
    counterToCode(token, getCounter(-1)) === cleaned
  );
}

export function secondsUntilNextCode(): number {
  const now = Math.floor(Date.now() / 1000);
  return STEP - (now % STEP);
}
