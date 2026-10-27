'use client'

import React, { useEffect } from 'react'

const ErrorPage = ({error, retry}:{ error: Error & { digest?: string }; retry: () => void }) => {
  
    useEffect(() => {
    console.error(error);
  }, [error]);

    return (
     <div>
      <h2>Произошла ошибка!</h2>
      <button type="button" onClick={() => retry()}>Попробовать снова</button>
    </div>
  )
}

export default ErrorPage