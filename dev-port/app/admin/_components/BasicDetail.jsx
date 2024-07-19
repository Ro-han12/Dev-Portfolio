
import React from 'react'
import { db } from '../../../utils';
import { userInfo } from '../../../utils/schema';
import { Camera, Link2, MapPin } from 'lucide-react'
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { eq } from 'drizzle-orm';
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext';
import { UserDetailContext } from '../../_context/UserDetailContext';
function BasicDetail() {

    let timeoutId;
    const {user}=useUser();

    // const {updatePreview,setUpdatePreview}=useContext(PreviewUpdateContext)
    const {userDetail,setUserDetail}=useContext(UserDetailContext);
    const [selectedOption,setSelectedOption]=useState();
    // const [profileImage,setProfileImage]=useState();
    useEffect(()=>{
        userDetail&&console.log(userDetail)

    },[userDetail])
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

                // setUpdatePreview(updatePreview+1)
                
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
        defaultValue={userDetail?.name}
        onChange={(event)=>onInputChange(event,'name')}
        className='input input-bordered w-full '/>
    </div>
    <textarea className='textarea textarea-bordered mt-3 w-full'
     placeholder='Bio'
     defaultValue={userDetail?.bio}
     onChange={(event)=>onInputChange(event,'bio')}
     ></textarea>
    
    <div>
            <div className='flex gap-3 mt-3'>
                <MapPin className={`h-12 w-12 p-3 
                text-blue-500
                rounded-md hover:bg-gray-600
                ${selectedOption=='location'&&'bg-gray-600'}
                `}
                onClick={()=>setSelectedOption('location')}
                />
                 <Link2 className={`h-12 w-12 p-3 
                text-yellow-500
                rounded-md hover:bg-gray-600
                ${selectedOption=='link'&&'bg-gray-600'}
                `}
                onClick={()=>setSelectedOption('link')} />
            </div>

           {selectedOption=='location'? 
           <div className='mt-2'>
                <label className="input input-bordered flex items-center gap-2">
                <MapPin/>
                <input type="text" className="grow" 
                placeholder="Location"
                // key prompt  is used to represnt same event but in different ways
                key={1} 
                defaultValue={userDetail?.location}
                onChange={(event)=>onInputChange(event,'location')} />
                </label>
            </div>:
            selectedOption=='link'?
            <div className='mt-2'>
            <label className="input input-bordered flex items-center gap-2">
                <Link2/>
                <input type="text" className="grow" 
                placeholder="Url"
                key={2}
                defaultValue={userDetail?.link}
                onChange={(event)=>onInputChange(event,'link')} />
            </label>
        </div>:null}


         </div>
    </div>
  )
}

export default BasicDetail