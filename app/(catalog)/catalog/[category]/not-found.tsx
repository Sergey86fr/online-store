import Link from 'next/link'
import React from 'react'

const CatalogNotFound = () => {
  return (
    <div>
        <h2>Такой категории нет!</h2>
         <Link href={"/catalog"}>Перейти в категории</Link>
    </div>
  )
}

export default CatalogNotFound