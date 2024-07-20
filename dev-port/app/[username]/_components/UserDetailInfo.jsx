"use client"
import { TwicPicture } from '@twicpics/components/react'
import { MapPin, Share } from 'lucide-react'
import React from 'react'

function UserDetailInfo({userDetail}) {
    console.log("--",userDetail)
  return userDetail?.name&&(
    <div className='flex flex-col md:justify-center  md:h-screen overflow-hidden'>
        <div className='w-full flex items-center justify-between'>
            <div className='flex md:flex-col items-center md:items-start gap-4'>
                <TwicPicture src={userDetail?.profileImage}
                    className='w-[70px] h-[70px] md:w-[130px] md:h-[130px] rounded-full'
                />
                <div className='flex flex-col gap-2 lg:gap-4 mt-3'>
                    <h2 className='font-bold text-lg md:text-2xl'>{userDetail.name}</h2>
                    <h2 className='flex gap-2 text-sm md:text-md items-center text-gray-500'> <MapPin/> {userDetail.location}</h2>
                    <div>
                    <button className='md:hidden btn btn-primary btn-sm'>
                        <Share className='h-3 w-3'/> Share</button>
                </div>
                </div>
                
            </div>
            
        </div>
        <h2 className='my-7 '>{userDetail.bio}</h2>
        <div className='flex gap-2'>
        <input type="text" placeholder="Add your email" className="input input-bordered w-full max-w-xs" />
        <button className='btn btn-primary'>Connect</button>
        </div>
    </div>
  )
}

export default UserDetailInfo