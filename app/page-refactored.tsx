import Articles from "@/components/articles/articles";
import Banner from "@/components/banner/banner";
import OurStores from "@/components/our-stores/our-stores";
import ProductsSection from "@/components/products-section/products-section2";
import SpecialOffers from "@/components/special-offers/special-offers";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

// Заглушка, пока секция загружает данные
const sectionSkeleton = <div className="w-full h-[420px] rounded-sm bg-[#F3F2F1] animate-pulse" />;

export default function MainPageRefactored() {
  return (
    <main className="flex flex-col items-center">
      <Banner />
      <div className="w-[clamp(336px,95vw,1208px)] p-3 flex flex-col gap-20 md:gap-25 xl:gap-30">
        <Suspense fallback={sectionSkeleton}>
          <ProductsSection section="promotions" variant="preview" className="mt-10 md:mt-15 xl:mt-20" />
        </Suspense>
        <Suspense fallback={sectionSkeleton}>
          <ProductsSection section="newProducts" variant="preview" />
        </Suspense>
        <Suspense fallback={sectionSkeleton}>
          <ProductsSection section="purchases" variant="preview" />
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
