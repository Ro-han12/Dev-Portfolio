"use client"
import { db } from '@/utils'
import { project, userInfo } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import {  asc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { UserDetailContext } from './_context/UserDetailContext'
function Provider({children}) {

    const {user}=useUser();
    const [userDetail,setUserDetail]=useState([]);
    useEffect(()=>{
        user&&GetUserDetails();
    },[user])

    const GetUserDetails=async()=>{
        // const result=await db.select().from(userInfo)
        // .where(eq(userInfo.email,user?.primaryEmailAddress.emailAddress));
        // console.log(result)
        // setUserDetail(result[0]);
        const result=await db.query.userInfo.findMany({
          with:{
            project:true
          },
          where:eq(userInfo.email,user?.primaryEmailAddress.emailAddress),
          
        })
    
        console.log(result[0])
        setUserDetail(result[0]);
        
    }
  return (
    <UserDetailContext.Provider 
    value={{userDetail,setUserDetail}}>

    <div>{children}</div>
    </UserDetailContext.Provider>
  )
}

export default Provider