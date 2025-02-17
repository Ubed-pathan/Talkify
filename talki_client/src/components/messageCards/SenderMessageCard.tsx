import { formatMessageDate } from '../../utils/dateUtils';

export const SenderMessageCard = ({
  message,
  senderId,
  date,
}: {
  message: string;
  senderId: string;
  date: string;
}) => {
  const formattedDate = formatMessageDate(date);

  return (
    <div className="flex justify-end w-full mt-1 mb-1">
      <div className="relative flex justify-start min-w-[35%] md:min-w-[10%] max-w-[55%] bg-accent-100 text-bg-200 p-1 rounded-tl-lg rounded-bl-lg rounded-br-xl mr-2 break-words">
        <div className='flex flex-col'>
        <span className="break-all">{message}</span>
        <span className="text-xs text-text-100">{formattedDate}</span>
        </div>
        <div className="absolute top-0 right-0 -mr-2 w-0 h-0 border-t-8 border-t-accent-100 border-r-8 border-r-transparent"></div>
      </div>
    </div>
  );
};
