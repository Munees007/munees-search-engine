import Image from 'next/image'
import React from 'react'
import { FaSearch } from 'react-icons/fa'
import Logo from '../../public/images/Logo.png'
export const SearchBar = () => {
  return (
    <div className='flex items-center gap-2 border border-gray-200 py-2 px-2 rounded-full'>
        <Image src={Logo} width={30} height={30} className='rounded-full border border-white' alt='MW Logo'></Image>
        <input className='outline-none w-90 text-xl'></input>
        <FaSearch size={22} className='mr-1 select-none cursor-pointer hover:scale-105 active:scale-95'/>
    </div>
  )
}
