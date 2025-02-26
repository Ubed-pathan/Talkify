import React from "react";
import { formatMessageDate } from "../../utils/dateUtils";

interface ReciverImageCardProps {
  image: string;
  senderId: string;
  date?: string;
}

const ReciverImageCard: React.FC<ReciverImageCardProps> = ({ image, senderId, date }) => {
  const formattedDate = formatMessageDate(date);

  return (
    <div className="flex justify-start w-[70%] mt-1 mb-1">
      <div className="relative flex flex-col bg-gray-200 p-1 rounded-tr-lg rounded-bl-lg rounded-br-xl shadow-md ml-2 max-w-xs">
        { image &&
        <img
          src={image}
          alt="Received"
          className="w-full h-auto rounded-md object-cover"
        />
        }
        {/* Date */}
        <div className="mt-1 flex justify-end">
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        {/* Triangle pointer on the left */}
        <div className="absolute top-0 left-0 -ml-2 w-0 h-0 border-t-8 border-t-text-200 border-l-8 border-l-transparent"></div>
      </div>
    </div>
  );
};

export default ReciverImageCard;
