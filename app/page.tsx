import Articles from "@/components/articles/articles";
import Banner from "@/components/banner/banner";
import NewProducts from "@/components/new-products/new-products";
import OurStores from "@/components/our-stores/our-stores";
import Promotions from "@/components/promotions/promotions";
import Purchases from "@/components/purchases/purchases";
import SpecialOffers from "@/components/special-offers/special-offers";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

const sectionSkeleton = (
  <div className="w-full h-[420px] rounded-sm bg-[#F3F2F1] animate-pulse" />
);

export default function MainPage() {
  return (
    <main className="flex flex-col items-center">
      <Banner />
      <div className="w-[clamp(300px,95vw,1208px)] p-0 mobile:p-3 flex flex-col gap-20 md:gap-25 xl:gap-30 ">

        <Suspense fallback={sectionSkeleton}>
          <Promotions />
        </Suspense>

        <Suspense fallback={sectionSkeleton}>
          <NewProducts />
        </Suspense>

        <Suspense fallback={sectionSkeleton}>
          <Purchases />
        </Suspense>

        <SpecialOffers />
        <OurStores />

        <Suspense fallback={sectionSkeleton}>
          <Articles />
        </Suspense>
        
      </div>
    </main>
  );
}
