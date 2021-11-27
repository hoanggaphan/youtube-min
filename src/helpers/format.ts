import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import 'dayjs/locale/vi';
dayjs.locale('vi');

const config = {
  thresholds: [
    { l: 's', r: 1 },
    { l: 'ss', r: 59, d: 'second' },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 6, d: 'day' },
    { l: 'w', r: 1 },
    { l: 'ww', r: 4, d: 'week' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y', r: 1 },
    { l: 'yy', d: 'year' },
  ],
};
dayjs.extend(duration);
dayjs.extend(relativeTime, config);
dayjs.extend(updateLocale);

dayjs.updateLocale('vi', {
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

export function formatDateView(date: string) {
  return dayjs(date).fromNow();
}

export function formatDuration(duration: string) {
  if (dayjs.duration(duration).asSeconds() >= 3600) {
    return dayjs.duration(duration).format('H:mm:ss');
  }

  return dayjs.duration(duration).format('m:ss');
}

export function formatPublishAt(date: string) {
  const format = 'D [thg] M, YYYY';
  return dayjs(date).format(format);
}

export function formatNumberWithDots(num: number | string) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// User for moment npm
// moment.updateLocale('vi', {
//   relativeTime: {
//     future: '%s tới',
//     past: '%s trước',
//     s: 'vài giây',
//     ss: '%d giây',
//     m: '%d phút',
//     mm: '%d phút',
//     h: '%d giờ',
//     hh: '%d giờ',
//     d: '%d ngày',
//     dd: '%d ngày',
//     w: '%d tuần',
//     ww: '%d tuần',
//     M: '%d tháng',
//     MM: '%d tháng',
//     y: '%d năm',
//     yy: '%d năm',
//   },
// });

// // Set new thresholds
// moment.relativeTimeThreshold('s', 60);
// moment.relativeTimeThreshold('m', 60);
// moment.relativeTimeThreshold('h', 24);
// moment.relativeTimeThreshold('d', 7);
// moment.relativeTimeThreshold('w', 5); // enables weeks
// moment.relativeTimeThreshold('M', 12);
