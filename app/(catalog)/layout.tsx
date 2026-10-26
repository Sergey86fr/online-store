import { ReactNode } from "react"

const CatalogLayout = ({children, breadcrumbs}:{children:ReactNode, breadcrumbs: ReactNode}) => {
  return (
    <main className="flex flex-col items-center">
          {breadcrumbs}
        <div className="w-[clamp(300px,95vw,1208px)] p-0 mobile:p-3 mt-10 md:mt-15 xl:mt-20">
            {children}
        </div>
    </main>
  )
}

export default CatalogLayout