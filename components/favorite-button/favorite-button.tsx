"use client";

import { useFavorites } from "@/hooks/useFavorites";
import Heart from "../../public/images/icons/heart.svg";

const FavoriteButton = ({ productId }: { productId: string }) => {
  const { favoriteIds, setFavorite } = useFavorites();
  const isFavorite = favoriteIds?.has(productId) ?? false;

  return (
    <button
      onClick={() => setFavorite(productId, !isFavorite)}
      className={` z-10 ${isFavorite ? "bg-[#FCD5BA]" : "bg-[#F3F2F1]"} hover:bg-[#FCD5BA] opacity-50 duration-300  w-8 h-8 absolute top-3 right-3 flex justify-center items-center rounded-sm cursor-pointer`}
    >
      <Heart className="w-6 h-6" alt="добавить в избранное" />
    </button>
  );
};

export default FavoriteButton;
