import React from "react";
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
    <div>
      <div>
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <p>{name}</p>
      </div>
      <p>
        This conversation is between you and <strong>{name}</strong>
      </p>
    </div>
  );
};

export default ConversationHero;
