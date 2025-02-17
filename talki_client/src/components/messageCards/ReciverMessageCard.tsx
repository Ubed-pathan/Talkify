import { formatMessageDate } from '../../utils/dateUtils';

export const ReciverMessageCard = ({
  message,
  senderId,
  date,
}: {
  message: string;
  senderId: string;
  date?: string;
}) => {
  const formattedDate = formatMessageDate(date);

  return (
    <div className="flex justify-start w-full mt-1 mb-1">
      <div className="relative flex justify-end min-w-[35%] md:min-w-[10%] max-w-[55%] bg-text-200 text-bg-300 p-1 rounded-tr-lg rounded-bl-lg rounded-br-xl ml-2 break-words">
        <div className='flex flex-col'>
        <span className="break-all">{message}</span>
        <span className="text-xs text-accent-200 flex justify-end">{formattedDate}</span>
        </div>
        <div className="absolute top-0 left-0 -ml-2 w-0 h-0 border-t-8 border-t-text-200 border-l-8 border-l-transparent"></div>
      </div>
    </div>
  );
};
