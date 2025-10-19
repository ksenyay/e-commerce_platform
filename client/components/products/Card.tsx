"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";

interface CardProps {
  card: {
    id: string;
    title: string;
    description: string;
    price: number;
    likes: number;
    imageUrl: string;
  };
}

const Card = ({ card }: CardProps) => {
  const router = useRouter();

  function handleClick() {
    router.push(`/product/${card.id}`);
  }

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-sm transition-all duration-200 cursor-pointer flex flex-col hover:scale-[1.03] hover:shadow-md hover:bg-white/10"
      onClick={handleClick}
    >
      <Image
        src={card.imageUrl}
        alt={card.title}
        width={300}
        height={200}
        className="w-full h-[200px] object-cover"
        priority={false}
        loading="lazy"
      />

      <div className="flex flex-col justify-between flex-1 px-3 py-3 w-full gap-2">
        <div>
          <h2 className="font-bold text-base text-foreground leading-tight line-clamp-1 mb-1">
            {card.title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {card.description}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center pt-2 border-t border-white/10">
          <span className="font-bold text-primary text-lg">${card.price}</span>
          <span className="flex flex-row items-center gap-1.5 text-muted-foreground">
            <Download className="w-4 h-4" />
            <span className="text-sm">{card.likes}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
