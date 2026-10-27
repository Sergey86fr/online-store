import Link from 'next/link'

const ProductNotFound = () => {
  return (
    <div>
        <h2>Такой товар не найден!</h2>
         <Link href={"/catalog"}>Перейти в категории товара</Link>
    </div>
  )
}

export default ProductNotFound