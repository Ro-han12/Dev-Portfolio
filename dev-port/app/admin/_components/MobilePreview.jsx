"use client"
import  { useContext } from 'react'

function MobilePreview() {


  return (
    <div className='p-5  md:fixed'>
        <div className='border-[13px]  lg:w-[330px] xl:w-[350px] w-full border-black 
        max-h-[650px]
        h-screen rounded-[40px] m-2 shadow-md shadow-primary'>
        </div>
    </div>
  )
}

export default MobilePreview