
export const PREVIEW_LIMIT=4;
const CACHE_HOUR:RequestInit= {next:{revalidate:3600}}
const NO_CACHE:RequestInit= {cache:"no-store"}

interface IProductSectionConfig {
     title: string,
        href: string,
        linkLabel:string,
        previewPath:string,
        fullPath: string  ,
        fetchOptions: RequestInit,
}

export const PRODUCT_SECTIONS = {
    newProducts: {
        title:"Новинки",
        href: "/newProducts",
        linkLabel:"Все новинки",
        previewPath:`/api/products?sort=new&limit=${PREVIEW_LIMIT}`,
        fullPath:   `/api/products?new=true`,
        fetchOptions: CACHE_HOUR,
     },
    promotions: {
        title:"Акции",
        href: "/promotions",
        linkLabel:"Все акции",
        previewPath:`/api/products?discount=true&limit=${PREVIEW_LIMIT}`,
        fullPath:   `/api/products?discount=true`,
        fetchOptions: CACHE_HOUR,
     },
    purchases: {
        title:"Покупали раньше",
        href: "/purchases",
        linkLabel:"Все покупки",
        previewPath:`/api/purchases?limit=${PREVIEW_LIMIT}`,
        fullPath:   `/api/purchases`,
        fetchOptions: NO_CACHE,
     }
} satisfies Record<string, IProductSectionConfig>

export type ProductSectionName = keyof typeof PRODUCT_SECTIONS