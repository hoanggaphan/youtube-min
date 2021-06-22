export const lineClamp = (num: number) => ({
  display: '-webkit-box',
  '-webkit-line-clamp': num,
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
