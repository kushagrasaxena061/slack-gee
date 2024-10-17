import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: number;
  name?: string;
  onClick?: () => void;
}

export const ThreadBar = ({
  count,
  image,
  timestamp,
  name = "Member",
  onClick,
}: ThreadBarProps) => {
  if (!count || !timestamp) {
    return null;
  }

  const avatarFallback = name.charAt(0).toLowerCase();

  return (
    <button onClick={onClick}>
      <div>
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span>
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span>
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span>View Thread</span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
    </button>
  );
};
