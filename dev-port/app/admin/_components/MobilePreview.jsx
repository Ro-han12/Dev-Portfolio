"use client"
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext'
import { UserDetailContext } from '../../_context/UserDetailContext'
import { useContext } from 'react'

function MobilePreview() {

  // const {updatePreview,setUpdatePreview}=useContext(PreviewUpdateContext)
  const {userDetail,setUserDetail}=useContext(UserDetailContext)
  return (
    <div className='p-5  md:fixed'>
        <div className='border-[13px]  lg:w-[330px] xl:w-[350px] w-full border-black 
        max-h-[650px]
        h-screen rounded-[40px] m-2 shadow-md shadow-primary'>
          <iframe
            title='Profile'
            // key={updatePreview}
            src={process.env.NEXT_PUBLIC_BASE_URL+userDetail?.username}
            width="100%"
            height="100%"
            className='rounded-[25px]'
          />
        </div>
    </div>
  )
}

export default MobilePreview