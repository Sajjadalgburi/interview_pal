import { getTechLogos } from "@/lib/utils";
import React from "react";
import Image from "next/image";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const logos = await getTechLogos(techStack);

  return (
    <div className="flex flex-row gap-1">
      {logos.slice(0, 3).map(({ tech, url }, i) => (
        <div
          key={i}
          className="group bg-dark-300 flex-center relative rounded-full p-2"
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
