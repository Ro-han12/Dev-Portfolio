"use client"
import  { useContext } from 'react'
import UserDetailInfo from './_components/UserDetailInfo'
import ProjectList from './_components/ProjectList'
import { UserDetailContext } from '../_context/UserDetailContext'

function UserPage() {
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
 
  return (
    <div className='p-3 lg:px-20
    grid grid-cols-1 lg:grid-cols-3 gap-5 overflow-hidden'>
      <div className=''>
        <UserDetailInfo userDetail={userDetail} />
      </div>
      <div className='lg:col-span-2'>
        
        <ProjectList projectList={userDetail?.project} />
      </div>
      </div>
  )
}

export default UserPage