
import React from 'react'
import { db } from '../../../utils';
import { userInfo } from '../../../utils/schema';
import { Camera, Link2, MapPin } from 'lucide-react'
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { eq } from 'drizzle-orm';
function BasicDetail() {
    let timeoutId;
    const {user}=useUser();
    /**
     * Used to Save user Info
     * @param {*} event 
     * @param {*} fieldName 
     */
    const onInputChange=(event,fieldName)=>{
        clearTimeout(timeoutId)
        timeoutId=setTimeout(async()=>{
            const result=await db.update(userInfo)
            .set({
                [fieldName]:event.target.value
            }).where(eq(userInfo.email,user?.primaryEmailAddress.emailAddress))

            if(result)
            {
                toast.success('Saved!',{
                    position:'top-right'
                })
                
            }
            else{
                toast.error('Error!',{
                    position:'top-right'
                })
            }
        },1000)
    }
       
  return (
    <div>
    <div className='p-7 rounded-lg bg-gray-800 my-7 '></div>
    <div className='flex gap-6 items-center'>
        <Camera className='p-3 h-12 w-12 bg-gray-500 rounded-full cursor-pointer' />
        <input type="text" placeholder='Username'
        onChange={(event)=>onInputChange(event,'name')}
        className='input input-bordered w-full '/>
    </div>
    <textarea className='textarea textarea-bordered mt-3 w-full'
     placeholder='Bio'
     onChange={(event)=>onInputChange(event,'bio')}
     ></textarea>
        
    </div>
  )
}

export default BasicDetail