export function convertHHMMSSToSeconds(time: string) {
  const p = time.split(':');
  let seconds = 0;
  let m = 1;

  while (p.length > 0) {
    seconds += Number(p.pop()) * m;
    m *= 60;
  }

  return seconds;
}
