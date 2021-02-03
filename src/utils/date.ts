/**
 * return d0 is afterOrEqual d1
 * @param d0
 * @param d1
 */
export const isAfter = (d0: string, d1: string): boolean => {
  return new Date(d0).getTime() - new Date(d1).getTime() >= 0;
};

/**
 * 将 YYYY-MM-DD 增加一天, 返回 YYYY-MM-DD
 * @param date
 */
export function addDates(date: Date | string, offset: number = 1): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  // 加上一天
  d.setDate(d.getDate() + offset);
  return d;
}

/**
 * 将格式化为 `YYYY-MM-DD`
 */
export function formatDate(date?: Date): string {
  if (date.toDateString() === 'Invalid Date') {
    // console.error(date);
    return new Date().toISOString().slice(0, 10);
  } else {
    return (date || new Date()).toISOString().slice(0, 10);
  }
}
