import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div>
        <h2>Такой страницы не существует! Ошибка 404!</h2>
        <Link href={"/"}>На главную</Link>
    </div>
  )
}

export default NotFound