import moment from 'moment';
import 'moment-duration-format';

const types = [
  { value: 1e9, unit: 'T' },
  { value: 1e6, unit: 'Tr' },
  { value: 1e3, unit: 'N' },
  { value: 1, unit: '' },
];

export function formatSubscriptionCount(num: number | string) {
  num = Number(num);
  if (num === 0) return 0;

  const index = types.findIndex((type) => num >= type.value);

  const decimalNum = num / types[index].value;

  const integerNum = Math.trunc(decimalNum);
  const intNumLength = integerNum.toString().length;

  if (intNumLength === 1) {
    const roundedNum = Math.trunc(decimalNum * 100) / 100; // 2,899 = 2,89
    return roundedNum.toString().replace('.', ',') + ' ' + types[index].unit;
  }

  if (intNumLength === 2) {
    const roundedNum = Math.trunc(decimalNum * 10) / 10; // 2,89 = 2,8
    return roundedNum.toString().replace('.', ',') + ' ' + types[index].unit;
  }

  return Math.trunc(decimalNum) + ' ' + types[index].unit;
}

export function formatVideoViews(num: number | string) {
  num = Number(num);
  if (num === 0) return 0;

  const index = types.findIndex((type) => num >= type.value);

  const decimalNum = num / types[index].value;

  const integerNum = Math.trunc(decimalNum);
  const intNumLength = integerNum.toString().length;

  if (intNumLength === 1) {
    const roundedNum = Math.trunc(decimalNum * 10) / 10; // 2,899 = 2,8
    return roundedNum.toString().replace('.', ',') + ' ' + types[index].unit;
  }

  return Math.trunc(decimalNum) + ' ' + types[index].unit;
}

export function formatLikeCount(num: number | string) {
  num = Number(num);

  if (num === 0) return 0;

  const index = types.findIndex((type) => num >= type.value);

  const decimalNum = num / types[index].value;
  const integerNum = Math.trunc(decimalNum);
  const intNumLength = integerNum.toString().length;

  if (intNumLength === 1) {
    const roundedNum = Math.trunc(decimalNum * 10) / 10; // 2,85 = 2,8
    return roundedNum.toString().replace('.', ',') + ' ' + types[index].unit;
  }

  return Math.trunc(decimalNum) + ' ' + types[index].unit;
}

moment.updateLocale('vi', {
  relativeTime: {
    future: '%s tới',
    past: '%s trước',
    s: 'vài giây',
    ss: '%d giây',
    m: '%d phút',
    mm: '%d phút',
    h: '%d giờ',
    hh: '%d giờ',
    d: '%d ngày',
    dd: '%d ngày',
    w: '%d tuần',
    ww: '%d tuần',
    M: '%d tháng',
    MM: '%d tháng',
    y: '%d năm',
    yy: '%d năm',
  },
});

// Set new thresholds
moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 24);
moment.relativeTimeThreshold('d', 7);
moment.relativeTimeThreshold('w', 5); // enables weeks
moment.relativeTimeThreshold('M', 12);

export function formatDateView(date: string) {
  return moment(date).fromNow();
}

function customTemplate(this: any) {
  if (this.duration.asSeconds() >= 3600) {
    return 'h:mm:ss';
  }

  return 'm:ss';
}

export function formatHHMMSStoSeconds(duration: string) {
  const p = duration.split(':');
  let seconds = 0;
  let m = 1;

  if (!p.length) return p;

  while (p.length > 0) {
    seconds += Number(p.pop()) * m;
    m *= 60;
  }

  return seconds;
}

export function formatDuration(duration: string) {
  return moment.duration(duration).format(customTemplate, { trim: false });
}

export function formatPublishAt(date: string) {
  const format = 'D [thg] M, YYYY';
  return moment(date).format(format);
}

export function formatNumberWithDots(num: number | string) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
