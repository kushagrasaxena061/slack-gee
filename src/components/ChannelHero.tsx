import { format } from "date-fns";
import React from "react";

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
  return (
    <div >
      <p className="text-2xl font-bold  mb-2"># {name}</p>
      <p className="font-normal text-gray-100 mb-4">
        This channel was created on {format(creationTime, "MMMM d, yyyy")}.
      </p>
    </div>
  );
};

export default ChannelHero;
