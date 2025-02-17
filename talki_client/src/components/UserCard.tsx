const UserCard = ({
  isOnline,
  conversationId,
  receiverUserId,
  img,
  userName,
  about,
  onClick,
}: {
  isOnline: boolean;
  conversationId: string | null;
  receiverUserId: string;
  img: string;
  userName: string;
  about: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex flex-col cursor-pointer hover:bg-bg-200 text-text-200"
      onClick={onClick}
    >
      <div className="flex justify-start gap-4 my-2 ml-2 relative">
        {/* User image container */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-accent-100">
            <img
              src={img}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online/offline dot */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-bg-200 rounded-full"></span>
          )}
        </div>
        {/* User details */}
        <div className="flex flex-col -mt-1">
          <div className="font-bold text-accent-100 text-xl">{userName}</div>
          <div className="text-sm">{about}</div>
        </div>
      </div>
      <hr className="w-full border-t-[1px] border-t-text-200" />
    </div>
  );
};

export default UserCard;
