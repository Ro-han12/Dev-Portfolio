"use client"
import { db } from '../../utils'
import { userInfo } from '../../utils/schema';

import { eq } from 'drizzle-orm';
import { useContext, useEffect } from 'react'
import { UserDetailContext } from '../_context/UserDetailContext';
import { usePathname } from 'next/navigation';

function Provider({children}) {

  
  
 const USERNAME=usePathname().replace('/','');
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  useEffect(()=>{
 
    USERNAME&&GetUserDetails();
  },[USERNAME])

  /**
   * used to get user detail with Project details
   */
  const GetUserDetails=async()=>{
    const result=await db.query.userInfo.findMany({
      with:{
        project:true
      },
      where:eq(userInfo.username,USERNAME)
    })
    console.log("Updating...",result)
    result.length>0? setUserDetail(result[0]):setUserDetail([])
  }
  return (
    <div data-theme={userDetail?.theme}>
        {children}
    </div>
  )
}

export default Provider