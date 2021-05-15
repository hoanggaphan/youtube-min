export function getFirstWord(s: string) {
  return s.trim().split(' ')[0];
}

export function getLastWord(s: string) {
  return s.trim().split(' ').slice(-1)[0];
}
