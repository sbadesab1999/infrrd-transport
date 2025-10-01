/** Utility functions: convert time string (HH:MM) to today's ISO, same-day check, buffer match */
export function todayIsoFromHHMM(hhmm: string): string {
  const [hhStr, mmStr] = hhmm.split(':');
  const hh = Number(hhStr || 0);
  const mm = Number(mmStr || 0);
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
}

export function isSameDayIso(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate();
}

/** Returns true if rideIso is within +/- bufferMinutes of targetIso */
export function isWithinBufferMinutes(rideIso: string, targetIso: string, bufferMinutes = 60): boolean {
  const rideMs = new Date(rideIso).getTime();
  const targetMs = new Date(targetIso).getTime();
  const diffMin = Math.abs(rideMs - targetMs) / (60 * 1000);
  return diffMin <= bufferMinutes;
}
