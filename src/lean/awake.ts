// Keeps a Mac awake while a run goes, and says so when it cannot.
//
// caffeinate -i stops idle sleep; -s stops system sleep, but macOS honours it only on power. On battery the Mac
// still sleeps (always with the lid closed), and a run then gets a minute now and then: on 2026-11-23 a run did 7
// rounds in 12 hours that way. So a run on battery warns at the start, and again whenever the Mac moves to
// battery, on screen and by text message to OSO_TEXT_TO (a phone number in .env, which is never committed).
import { execFileSync, spawn } from 'node:child_process';

const onBattery = () => {
  try { return /Battery Power/.test(execFileSync('pmset', ['-g', 'batt'], { encoding: 'utf8' })); } catch { return false; }
};

/** Sends a desktop notification, and a text message when OSO_TEXT_TO is set. Never throws. */
export function notify(text: string) {
  if (process.platform !== 'darwin') return;
  const q = (s: string) => `"${s.replace(/["\\]/g, '\\$&')}"`;
  try { execFileSync('osascript', ['-e', `display notification ${q(text)} with title "OSO run"`], { stdio: 'ignore' }); } catch { /* no notification */ }
  const to = process.env.OSO_TEXT_TO;
  if (to) try { execFileSync('osascript', ['-e', `tell application "Messages" to send ${q(text)} to participant ${q(to)} of (1st account whose service type = iMessage)`], { stdio: 'ignore' }); } catch { /* no text */ }
}

/** For the life of this process: no sleep while on power, and a warning whenever the Mac is on battery. */
export function stayAwake(run: string) {
  if (process.platform !== 'darwin') return;
  spawn('caffeinate', ['-i', '-s', '-w', String(process.pid)], { detached: true, stdio: 'ignore' }).unref();
  const warn = () => {
    const text = `${run}: this Mac is on battery, so it can sleep and the run will stall. Plug it in.`;
    console.warn(`\nWarning: ${text}\n`);
    notify(text);
  };
  let was = onBattery();
  if (was) warn();
  setInterval(() => { const now = onBattery(); if (now && !was) warn(); was = now; }, 5 * 60_000).unref();
}
