import Link from 'next/link'
import React from 'react'

const CatalogNotFound = () => {
  return (
    <div>
        <h2>Такой категории нет!</h2>
         <Link href={"/"}>На главную</Link>
    </div>
  )
}

export default CatalogNotFound