"use client";

import { useContext, useEffect, useState } from 'react';
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext';
import { UserDetailContext } from '../../_context/UserDetailContext';

function MobilePreview() {
  const { updatePreview } = useContext(PreviewUpdateContext);
  const { userDetail } = useContext(UserDetailContext);
  const [iframeUrl, setIframeUrl] = useState('');

  useEffect(() => {
    if (userDetail && userDetail.username) {
      setIframeUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/${userDetail.username}`);
    }
  }, [userDetail]);

  return (
    <div className='p-5 md:fixed'>
      <div className='border-[13px] lg:w-[330px] xl:w-[350px] w-full border-black max-h-[650px] h-screen rounded-[40px] m-2 shadow-md shadow-primary'>
        {iframeUrl ? (
          <iframe
            title='Profile'
            key={updatePreview}
            src={iframeUrl}
            width="100%"
            height="100%"
            className='rounded-[25px]'
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default MobilePreview;
