import { format } from "date-fns";
import React from "react";

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
  return (
    <div>
      <p># {name}</p>
      <p>This channel was created on {format(creationTime, "MMMM d, yyyy")}.</p>
    </div>
  );
};

export default ChannelHero;
