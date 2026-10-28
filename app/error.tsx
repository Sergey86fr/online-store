'use client'

import { useEffect } from 'react'

const ErrorPage = ({error, retry}:{ error: Error & { digest?: string }; retry: () => void }) => {
  
    useEffect(() => {
    console.error(error);
  }, [error]);

    return (
     <div className='flex flex-col gap-10 items-center mt-20 '>
      <h2 className='text-2xl  xl:text-[40px] font-semibold'>Произошла ошибка!</h2>
      <button className='bg-(--color-secondary) cursor-pointer text-white px-2.5 py-3 rounded-sm text-sm md:text-base xl:text-lg' type="button" onClick={() => retry()}>Попробовать снова</button>
    </div>
  )
}

export default ErrorPage