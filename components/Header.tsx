import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Header() {
  return (
    <header
      className="flex items-center justify-between space-x-2 font-bold px-10 py-1">
      <div className='flex items-center space-x-2'>
        <Link href="/">
          <Image 
            className='rounded-full'
            src='/public/images/EHA Clinics.png'
            width={50}
            height={50}
            alt='logo'
          />
        </Link>
        <h1>Living Healthy</h1>
      </div>
      <div>
        <Link href="/"
          className='px-5 py-3 text-sm md: text-base bg-light-600 text-[#F7AB33] 
          flex items-center rounded-full text-center'
        > Sign up
        </Link>
      </div>
     </header> 
  )
}

export default Header