'use client'

import {useFavorites} from "@/hooks/useFavorites";
import { IProduct } from "@/types/product";
// import { useState } from "react";
import ProductCard from "../product-card/product-card";

const FavoritesList = ({initialItems}:{initialItems:IProduct[]}) => {
    // const[items, setItems] = useState(initialItems)

    const{favoriteIds} = useFavorites();
    const isFavorite = (product:IProduct) => favoriteIds?.has(product.id) ?? true
    
  const visibleItems = initialItems.filter(isFavorite)
  return (
   <div>
          {visibleItems.map((i) => (
            <ProductCard product={i} key={i.id} />
          ))}
        </div>
  )
}

export default FavoritesList