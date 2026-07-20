type Status = 'idle' | 'loading' | 'success' | 'error';
function render(status: Status): string {
  switch (status) {
    case 'idle':    return 'Idle';
    case 'loading': return 'Loading';
    case 'success': return 'Done';
    case 'error':   return 'Error';
  }
}
function label(status: Status): string {
  switch (status) {
    case 'idle':    return 'Idle';
    case 'loading': return 'Loading';
    case 'success': return 'Done';
    case 'error':   return 'Error';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
const point2 = { x: 10, y: 20 } as const;
// @ts-expect-error read-only
point2.x = 5;
const colors2 = ['red', 'green', 'blue'] as const;
type Color = (typeof colors2)[number];
const cc: Color = 'red';
type Width = number | 'auto';
let w: Width; w = 200; w = 'auto';
let exact: 'red' = 'red';
let anyColor: string = exact;
// @ts-expect-error narrow
let back: 'red' = anyColor;
console.log(render('idle'), label('idle'), cc, w, back);
