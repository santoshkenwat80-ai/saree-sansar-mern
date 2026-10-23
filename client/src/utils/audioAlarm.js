let audioCtx = null;
let alarmInterval = null;
let isAlarmRunning = false;
function getAudioContext() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx || audioCtx.state === "closed") {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (err) {
    console.warn("AudioContext initialization warning:", err);
    return null;
  }
}
function playChimePulse(ctx) {
  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1100, now + 0.15);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.2);
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(1320, now + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.38);
    gain2.gain.setValueAtTime(0.35, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.45);
  } catch (err) {
    console.warn("Audio playback error:", err);
  }
}
export function startOrderAlertAlarm() {
  if (isAlarmRunning) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  isAlarmRunning = true;
  playChimePulse(ctx);
  alarmInterval = setInterval(() => {
    if (!isAlarmRunning) return;
    const c = getAudioContext();
    if (c) playChimePulse(c);
  }, 750);
}
export function stopOrderAlertAlarm() {
  isAlarmRunning = false;
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
}
export function playTestChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  playChimePulse(ctx);
  setTimeout(() => {
    const c = getAudioContext();
    if (c) playChimePulse(c);
  }, 500);
}
export function isOrderAlarmActive() {
  return isAlarmRunning;
}
