const dateFormats = {
  date: 'YYYY-MM-DD',
  time: 'HH:mm',
  'date-time': 'YYYY-MM-DD HH:mm',
  'time-sec': 'HH:mm:ss',
  'date-time-sec': 'YYYY-MM-DD HH:mm:ss',
  'question-id': 'YYMMDDHHmmss',
};

const formatRules: Record<string, (date: Date) => string | number> = {
  YYYY: (date) => date.getFullYear(),
  YY: (date) => String(date.getFullYear()).slice(-2),
  MM: (date) => String(date.getMonth() + 1).padStart(2, '0'),
  DD: (date) => String(date.getDate()).padStart(2, '0'),
  HH: (date) => String(date.getHours()).padStart(2, '0'),
  mm: (date) => String(date.getMinutes()).padStart(2, '0'),
  ss: (date) => String(date.getSeconds()).padStart(2, '0'),
};

const regexSrc = Object.keys(formatRules)
  .map((key) => `${key}`)
  .join('|');
const regex = new RegExp(regexSrc, 'g');

export type DateFormat = keyof typeof dateFormats;

export function formatDate(date: Date, format: DateFormat | string) {
  const dateFormat = dateFormats[format as DateFormat] ?? format;
  const convertedDate = new Date(date.toLocaleString('en-US', { timeZone: 'EST' }));
  return dateFormat.replace(regex, (match) => String(formatRules[match](convertedDate)));
}
