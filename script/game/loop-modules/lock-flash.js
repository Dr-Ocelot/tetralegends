export default function lockFlash(arg) {
  const stack = arg.stack;
  if (stack.flashTime < stack.flashLimit || arg.piece.inAre) {
    stack.flashTime += arg.ms;
    stack.isDirty = true;
  }
}
