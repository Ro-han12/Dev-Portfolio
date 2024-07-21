"use client"
import { dummyUniqueVisitor } from '../../../_data/GraphData'
import { db } from '../../../../utils'
import { ProjectClicks, project, userInfo } from '../../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq, sql } from 'drizzle-orm'
import { months } from 'moment'
import React, { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function UniqueVisitors() {

    const {user}=useUser();
    const [data,setData]=useState();
    useEffect(()=>{
        user&&GetTotalVisitors();
    },[user])
    const GetTotalVisitors=async()=>{
        const result=await db.select({
            totalClick:sql`count(${ProjectClicks.id})`.mapWith(Number),
            month:ProjectClicks.month,
           
        }).from(ProjectClicks)
        .rightJoin(project,eq(ProjectClicks.projectRef,project.id ))
        .innerJoin(userInfo,eq(project.userRef,userInfo.id))
        .where(eq(userInfo.email,user?.primaryEmailAddress.emailAddress))
        .groupBy(ProjectClicks.month)
        
        const finalResult=[...dummyUniqueVisitor,...result]
        console.log(finalResult)
        setData(finalResult);
    }
  return (
    <div className='border rounded-lg p-7'>
        <h2 className='font-bold text-lg my-3'>Unique Visitors</h2>
           <ResponsiveContainer width={'100%'} height={250}>
                <AreaChart data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                       
                    </defs>
                    <XAxis dataKey="month" style={{fontSize:10}} />
                    <YAxis style={{fontSize:10}} />
                
                    <Tooltip />
                    <Area type="monotone" dataKey="totalClick"
                     stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
            </ResponsiveContainer>
    </div>
  )
}

export default UniqueVisitors