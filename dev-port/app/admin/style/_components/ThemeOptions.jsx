"use client"
import { PreviewUpdateContext } from '../../../_context/PreviewUpdateContext'
import { UserDetailContext } from '../../../_context/UserDetailContext'
import Themes from '../../../_data/Themes'
import { db } from '../../../../utils'
import { userInfo } from '../../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import  { useContext, useState } from 'react'
import { toast } from 'react-toastify'


function ThemeOptions() {

    const {updatePreview,setUpdatePreview}=useContext(PreviewUpdateContext)
    const {user}=useUser();
    const {userDetail,setUserDetail}=useContext(UserDetailContext)
    const [selectedTheme,setSelectedTheme]=useState();
    const onThemeSelect=async(themeName)=>{
        setSelectedTheme(themeName)
        const result=await db.update(userInfo)
        .set({
            theme:themeName
        }).where(eq(userInfo.email,user?.primaryEmailAddress?.emailAddress))
        
        if(result)
        {
            toast.success('Saved',{
                position:'top-right'
            })
            setUpdatePreview(updatePreview+1)
        }
    }
  return (
    <div>
        <h2 className='font-bold text-3xl py-10'>Select Your Page Theme</h2>
   
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        gap-5
        '>
            {Themes.map((theme,index)=>(
                <div 
                className={`flex p-3 bg-gray-900 rounded-lg
                hover:scale-105 transition-all cursor-pointer
                tooltip
                
                ${(userDetail.theme==theme.theme||selectedTheme==theme.theme)&&'border rounded-lg'}
                ` }
                onClick={()=>onThemeSelect(theme?.theme)}
                data-tip={theme.theme.toUpperCase()}
                >
                    <div className='w-full h-[40px] rounded-l-lg'
                    style={{backgroundColor:theme.primary}}>
                    </div>
                    <div className='w-full h-[40px]'
                    style={{backgroundColor:theme.secondary}}>
                    </div>
                    <div className='w-full h-[40px]'
                    style={{backgroundColor:theme['base-100']}}>
                    </div>
                    <div className='w-full h-[40px] rounded-r-lg'
                    style={{backgroundColor:theme.accent}}>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ThemeOptions