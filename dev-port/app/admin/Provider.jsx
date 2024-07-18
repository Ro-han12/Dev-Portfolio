"use client"
import React, { useEffect, useState } from 'react'
import { PreviewUpdateContext } from '../_context/PreviewUpdateContext'
import { useUser } from '@clerk/clerk-react'
import { UserDetailContext } from '../_context/UserDetailContext';
import { db } from '../../utils';
import { userInfo } from '../../utils/schema';
import { eq } from 'drizzle-orm';
function Provider({children}) {
    const {user}=useUser();
    const [userDetail,setUserDetail]=useState([]);
    useEffect(()=>{
        user&&GetUserDetails();
    },[user])
    const GetUserDetails=async()=>{
        const result=await db.select().from(userInfo)
        .where(eq(userInfo.email,user?.primaryEmailAddress.emailAddress))

        setUserDetail(result[0]);
    }
    return (
        <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
        <div>
            {children}
        </div>
        </UserDetailContext.Provider>
      )
    }
    
    export default Provider