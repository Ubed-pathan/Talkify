import { formatMessageDate } from "../../utils/dateUtils";

interface SenderImageCard {
  image?: string | null;
  senderId: string | null;
  date: string;
}

export const SenderImageCard: React.FC<SenderImageCard> = ({
  image,
  senderId,
  date,
}) => {
  const formattedDate = formatMessageDate(date);

  return (
    <div className="flex justify-end w-[70%] ml-auto mt-1 mb-1">
      <div className="relative flex flex-col bg-accent-100 text-bg-200 p-1 rounded-tl-lg rounded-bl-lg rounded-br-xl shadow-md mr-2 max-w-xs">
        {/* Display image if available */}
        {image && (
          <img
            src={image}
            alt="Sent"
            className="w-full h-auto rounded-md object-cover"
          />
        )}
        
        {/* Date */}
        <div className="mt-1 flex justify-start">
          <span className="text-xs text-text-100">{formattedDate}</span>
        </div>

        {/* Triangle pointer for sender message */}
        <div className="absolute top-0 right-0 -mr-2 w-0 h-0 border-t-8 border-t-accent-100 border-r-8 border-r-transparent"></div>
      </div>
    </div>
  );
};
