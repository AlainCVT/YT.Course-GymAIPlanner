export const isCurrentDay = (day: string): boolean => {
  const normalizedDay = day.trim().toLowerCase();
  const currentDate = new Date();
  const formats: Intl.DateTimeFormatOptions['weekday'][] = ['long', 'short'];

  for (const langue of navigator.languages || [navigator.language]) {
    for (const format of formats) {
      const formatter = new Intl.DateTimeFormat(langue, { weekday: format });
      const formattedDay = formatter.format(currentDate).toLowerCase();

      if (normalizedDay === formattedDay || normalizedDay === formattedDay.replace('.', '')) {
        return true;
      }
    }
  }

  return false;
};
