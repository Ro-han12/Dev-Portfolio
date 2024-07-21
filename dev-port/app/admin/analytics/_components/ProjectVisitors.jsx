"use client"
import { db } from '../../../../utils';
import { ProjectClicks, project, userInfo } from '../../../../utils/schema'
import { useUser } from '@clerk/nextjs';
import { eq, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function ProjectVisitors() {
    const { user } = useUser();
    const [data, setData] = useState([]);
    useEffect(() => {
        user && ProjectAnalyticData()
    }, [user])
    const ProjectAnalyticData = async () => {
        const result = await db.select({
            totalClick: sql`count(${ProjectClicks.id})`.mapWith(Number),
            name: project.name,
            projectId: ProjectClicks.projectRef
        }).from(ProjectClicks)
            .rightJoin(project, eq(ProjectClicks.projectRef, project.id))
            .innerJoin(userInfo, eq(project.userRef, userInfo.id))
            .where(eq(userInfo.email, user?.primaryEmailAddress.emailAddress))
            .groupBy(ProjectClicks.projectRef, project.name)

        setData(result);
        //setProjectClickData(result);
        console.log(result);
    }
    return (
        <div className='p-7 border rounded-lg'>
        <h2 className='font-bold text-lg my-3'>Project Visitors</h2>

            <ResponsiveContainer width={'100%'} height={250}>
            <BarChart width={730} height={250} data={data}>

                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalClick" fill="#8884d8"  />

            </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ProjectVisitors