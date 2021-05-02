import moment from 'moment';
import 'moment-duration-format';

export function formatSubscriptionCount(num: number | string) {
  num = Number(num);

  if (num === 0) return 0;

  const types = [
    { value: 1e9, unit: 'T' },
    { value: 1e6, unit: 'Tr' },
    { value: 1e3, unit: 'N' },
    { value: 1, unit: '' },
  ];
  const index = types.findIndex((type) => num >= type.value);

  const decimalNum = num / types[index].value;
  if (Number.isInteger(decimalNum)) return decimalNum + ' ' + types[index].unit;

  const integerNum = Math.trunc(decimalNum);
  const intNumLength = integerNum.toString().length;

  if (intNumLength === 1)
    return decimalNum.toFixed(2).replace('.', ',') + ' ' + types[index].unit;
  if (intNumLength === 2)
    return decimalNum.toFixed(1).replace('.', ',') + ' ' + types[index].unit;
  if (intNumLength === 3)
    return Math.round(decimalNum) + ' ' + types[index].unit;
}

export function formatVideoViews(num: number) {
  num = Number(num);

  if (num === 0) return 0;

  const types = [
    { value: 1e9, unit: 'T' },
    { value: 1e6, unit: 'Tr' },
    { value: 1e3, unit: 'N' },
    { value: 1, unit: '' },
  ];
  const index = types.findIndex((type) => num >= type.value);

  const decimalNum = num / types[index].value;
  if (Number.isInteger(decimalNum)) return decimalNum + ' ' + types[index].unit;

  const integerNum = Math.trunc(decimalNum);
  const intNumLength = integerNum.toString().length;

  if (intNumLength === 1)
    return decimalNum.toFixed(1).replace('.', ',') + ' ' + types[index].unit;
  if (intNumLength === 2 || intNumLength === 3)
    return Math.round(decimalNum) + ' ' + types[index].unit;
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

export function formatDuration(duration: string) {
  return moment.duration(duration).format(customTemplate, { trim: false });
}

export function formatPublishAt(date: string) {
  const format = 'D [thg] M, YYYY';
  return moment(date).format(format);
}

export function formatChannelViews(num: number | string) {
  return Number(num).toLocaleString();
}
