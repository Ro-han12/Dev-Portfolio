import { db } from '../../../utils'; // Adjust the path if utils is in a different location
import { ProjectClicks, project,userInfo } from '../../../utils/schema';
import { TwicPicture } from '@twicpics/components/react'
// import moment from 'moment/moment'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import AnalyticChart from './AnalyticChart'
import { asc, eq, sql } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import { UserDetailContext } from '../../_context/UserDetailContext'

function ProjectList({ projectList }) {

    const {user}=useUser();
    const [projectClickData,setProjectClickData]=useState([]);
    const {userDetail,setUserDetail}=useContext(UserDetailContext);
    useEffect(()=>{
        userDetail&&ProjectAnalyticData()
       
    },[userDetail])

    const OnProjectClick=async(project)=>{

        const result=await db.insert(ProjectClicks)
        .values({
            month: moment().format('MMM'),
            projectRef:project.id
        });

        window.open(project.url,'_blank')
    }


    const ProjectAnalyticData=async()=>{
        const result=await db.select({
            totalClick:sql`count(${ProjectClicks.id})`.mapWith(Number),
            month:ProjectClicks.month,
            projectId:ProjectClicks.projectRef
        }).from(ProjectClicks)
        .rightJoin(project,eq(ProjectClicks.projectRef,project.id ))
        .innerJoin(userInfo,eq(project.userRef,userInfo.id))
        .where(eq(userInfo.username,userDetail.username))
        .groupBy(ProjectClicks.projectRef,ProjectClicks.month)
     
        
        setProjectClickData(result);
        console.log(result);
    }

    const GetProjectWiseAnalyticData=(projectId)=>{
        console.log(projectId)
        let resp=projectClickData?.filter((project)=>project.projectId==projectId)
        let result=[];

        result.push({
            month:'March',
            totalClick:0,
            projectId:0
        },
        {
            month:'April',
            totalClick:0,
            projectId:0
        }
    )
      const finalResult=[...result,...resp];


        return finalResult;
    }



    return (
        <div className=' grid grid-cols-1 lg:grid-cols-2 gap-7 my-8 overflow-auto'>
            {projectList?.map((project, index) => (
                <div 
                onClick={()=>OnProjectClick(project)}
                 key={project.id} 
                
                className='border shadow-sm
            rounded-lg p-5 hover:scale-105 transition-all 
            align-top
            cursor-pointer hover:shadow-md'>
                    <div className='flex gap-2 items-center w-full'>
                        <TwicPicture src={project?.logo} 
                            className='w-[60px] h-[50px] rounded-full object-contain' />
                        <h2 className='font-bold text-lg justify-between w-full flex items-center'>{project?.name}
                        <div className="hidden md:block badge badge-accent text-xs font-normal truncate ">{project.category}</div>
                        </h2>
                    </div>
                    <h2 className='text-base-content/80 text-sm md:text-[16px]  my-3'>{project.desc}</h2>
                    
                    {project?.showGraph&& <AnalyticChart
                       data={GetProjectWiseAnalyticData(project.id)} 
                    />
                    }
                </div>
            ))}
        </div>
    )
}

export default ProjectList