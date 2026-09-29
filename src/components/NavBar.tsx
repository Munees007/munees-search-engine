import React from 'react'
import Link from 'next/link'

export const NavBar = () => {
  return (
    <div className='border-b p-4 border-gray-800 w-full flex justify-between items-center'>
        <Link href="/" className='font-bold text-xl tracking-widest'>MW</Link>

        <div>
          <Link href="/crawler" className='text-sm text-gray-300 hover:text-white border border-gray-700 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors'>
            Add Website
          </Link>
        </div>
    </div>
  )
}
