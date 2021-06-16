export function convertQueryTimeToSeconds(time: string) {
  let p = time.split(/h|m|s/);
  p = p.filter(Boolean);
  let seconds = 0;
  let m = 1;

  while (p.length > 0) {
    seconds += Number(p.pop()) * m;
    m *= 60;
  }

  return seconds;
}
