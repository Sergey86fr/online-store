import Link from 'next/link'

const NotFound = () => {
  return (
    <div className='flex flex-col gap-10 items-center mt-20 '>
        <h2 className='text-2xl  xl:text-[40px] font-semibold text-center'>Такой страницы не существует!<span className='text-red-700 block'>Ошибка 404!</span></h2>
        <Link className='text-sm md:text-base xl:text-lg text-[#606060] hover:text-[#bfbfbf]' href={"/"}>На главную</Link>
    </div>
  )
}

export default NotFound