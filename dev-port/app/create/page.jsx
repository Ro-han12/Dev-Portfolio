"use client"
import { db } from '../../utils';
import { userInfo } from '../../utils/schema';
import React from 'react'
import { useUser } from '@clerk/nextjs';
import { eq, ne } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';


function CreateUsername() {
    const [username,setUsername]=useState();
    const {user}=useUser();

    const router=useRouter();

    useEffect(()=>{
        user&&CheckUser();
    },[user])

     /**
     * Used to check user already exist of not
     */
     const CheckUser=async()=>{
        const result=await db.select().from(userInfo)
        .where(eq(userInfo.email,user?.primaryEmailAddress?.emailAddress))
        
       
        if(result?.length>0)
        {
            router.replace('/admin')
        }
       
    }

    const OnCreateBtnClick=async()=>{
        if(username.length>10)
        {
            toast.error("No More than 10 Charater !", {
                position: "top-right"
              });
            return ;
        }
        const username_=username.toLowerCase().replace(' ','');
        
        const result_=await db.select().from(userInfo)
        .where(eq(userInfo.username,username_));

        if(result_.length==0)
        {
        const result=await db.insert(userInfo)
        .values({
            name:user?.fullName,
            email:user?.primaryEmailAddress?.emailAddress,
            username:username_
        });

        if(result)
        {
            toast.success("Username created succesfully!", {
                position: "top-right"
              });
            router.replace('/admin');
        }
       
    }
    else{
        toast.error("Duplicate Username",{
            position:'top-right'
        })
    }

    }
  return (
    <div className='flex items-center justify-center h-screen '>
        <div className='p-10 border rounded-lg flex flex-col '>
            <h2 className='font-bold text-2xl py-5 text-center'>Create Username for Portfolio</h2>
            <label className='py-2'>Add Username for your porfolio</label>
            <input type="text" placeholder="Type here" 
                onChange={(event)=>setUsername(event.target.value)}
            className="input input-bordered py-2 w-full max-w-xs" />
            <button disabled={!username} 
            onClick={()=>OnCreateBtnClick()}
            className='btn btn-primary mt-3'>Create</button>
        </div>
    </div>
  )
}

export default CreateUsername