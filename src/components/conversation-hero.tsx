import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

const ConversationHero = ({
  name = "Member",
  image,
}: ConversationHeroProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();
  return (
      <div >
        <Avatar className="size-14 mr-2">
          <AvatarImage src={image} />
          <AvatarFallback className="text-white rounded-md bg-sky-500">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold text-[#A64D79]">{name}</p>
     
      <p className="font-normal text-white mn-4">
        This conversation is between you and <strong>{name}</strong>
      </p>
    </div>
  );
};

export default ConversationHero;
