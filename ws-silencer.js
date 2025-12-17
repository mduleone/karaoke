// Suppress noisy WebSocket close-code errors that appear during dev HMR.
const shouldSilence = (err) =>
  err && (err.code === 'WS_ERR_INVALID_CLOSE_CODE' || err.code === 'WS_ERR_INVALID_UTF8');

// Block the uncaughtException event from reaching any other listeners when the
// invalid close-code error bubbles up from ws internals (HarperDB logs it).
const originalEmit = process.emit;
process.emit = function emitWithSilencer(event, ...args) {
  if (
    (event === 'uncaughtException' || event === 'uncaughtExceptionMonitor') &&
    shouldSilence(args[0])
  ) {
    return true; // treated as handled
  }
  return originalEmit.call(this, event, ...args);
};

// Patch ws Receiver to ignore invalid close codes thrown from the parser.
try {
  const Receiver = require('ws/lib/receiver');
  const origProcessClose = Receiver.prototype.processClose;
  Receiver.prototype.processClose = function patchedProcessClose(...args) {
    try {
      return origProcessClose.apply(this, args);
    } catch (err) {
      if (shouldSilence(err)) {
        return;
      }
      throw err;
    }
  };
} catch {
  // If ws internals aren’t found, just continue; the uncaught handler above will still guard.
}
