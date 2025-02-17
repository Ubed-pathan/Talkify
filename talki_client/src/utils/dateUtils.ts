import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

export const formatMessageDate = (isoDate: string | undefined): string => {
  if (!isoDate) return '';

  const date = parseISO(isoDate);

  if (isToday(date)) {
    return format(date, 'h:mm a'); // e.g., "1:30 PM"
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return formatDistanceToNow(date, { addSuffix: true }); // e.g., "2 days ago"
  }
};
