import ProductsSection from "@/components/products-section/products-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новинки",
  description: "Новые товары в Северяночке",
};

const AllNewProducts = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page } = await searchParams;

  return (
    <ProductsSection
      sectionName="newProducts"
      variant="full"
      newPage={Number(page) || undefined}
    />
  );
};

export default AllNewProducts;
