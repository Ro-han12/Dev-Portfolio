import React from 'react'
import SideNav from './_components/SideNav'
import Provider from './Provider'

function AdminLayout({children}) {
  return (
    <div data-theme="dark">
        <div className='w-24 fixed'>
        <SideNav/>
        </div>
        <div className='ml-24 h-full'>
          <Provider>
            {children}
          </Provider>
      
        </div>
       
        
    </div>
  )
}

export default AdminLayout