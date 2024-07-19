
import React from 'react'
import { db } from '../../../utils';
import { userInfo } from '../../../utils/schema';
import { Camera, Link2, MapPin } from 'lucide-react'
import Image from 'next/image';
import { TwicImg, TwicPicture } from '@twicpics/components/react';
import { useUser } from '@clerk/nextjs';
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { eq } from 'drizzle-orm';
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext';
import { UserDetailContext } from '../../_context/UserDetailContext';
import { storage } from '../../../utils/firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';
function BasicDetail() {

    let timeoutId;
    const {user}=useUser();

    // const {updatePreview,setUpdatePreview}=useContext(PreviewUpdateContext)
    const {userDetail,setUserDetail}=useContext(UserDetailContext);
    const [selectedOption,setSelectedOption]=useState();
    const [profileImage,setProfileImage]=useState();
    useEffect(()=>{
        userDetail&&setProfileImage(userDetail?.profileImage)

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

    const handleFileUpload=(event)=>{
        const file=event.target.files[0];
        
        // type= image/png
        const fileName=Date.now().toString()+'.'+file.type.split('/')[1];
        console.log(fileName)
        const storageRef = ref(storage, fileName);
            uploadBytes(storageRef, file).then(async(snapshot) => {
                    console.log('Uploaded a blob or file!');
                    const result=await db.update(userInfo).set({
                        profileImage:fileName+"?alt=media"
                    }).where(eq(userInfo.email,user?.primaryEmailAddress.emailAddress))

                    if(result)
                    {
                        setProfileImage(fileName+"?alt=media")
                        toast.success('Saved!',{
                            position:'top-right'
                        }) 
                    //  setUpdatePreview(updatePreview+1)

                    }
            },(e)=>console.log(e));
    }
  return (
    <div className='p-7 rounded-lg bg-gray-800 my-7'>
        <div className='flex gap-6 items-center'>
          
            {profileImage?
            <label htmlFor='file-input' className='cursor-pointer'>
                {/* <Image src={BASE_URL+profileImage} width={40} 
                height={40} alt='profileImage'  /> */}
                <TwicPicture src={profileImage} className='w-[50px] h-[50px]
                rounded-full'></TwicPicture>
                  {/*\\ <TwicImg src={profileImage}/> */}

                </label>

            :<div>
                <label htmlFor='file-input'>
                <Camera className='p-3 h-12 w-12 bg-gray-500 rounded-full cursor-pointer' />
                </label>
            </div>}
            <input type="file" id='file-input' 
                onChange={handleFileUpload}  accept="image/png, image/gif, image/jpeg"
                style={{display:'none'}} />

            <input type="text" placeholder="Username" 
            defaultValue={userDetail?.name}
            onChange={(event)=>onInputChange(event,'name')}
            className="input input-bordered w-full font-medium" />
        </div>
        <textarea className="textarea textarea-bordered mt-3 w-full"
         placeholder="Start writing about yourself"
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