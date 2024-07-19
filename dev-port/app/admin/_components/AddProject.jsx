import { UserDetailContext } from '../../_context/UserDetailContext';
import { db } from '../../../utils';
import { project} from '../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { Link2 } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';

function AddProject({refreshData}) {

    const [openUrlInput, setOpenUrlInput] = useState(false);
    const { user } = useUser();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target[0].value)
        setLoading(true);
        const result = await db.insert(project)
            .values({
                url: e.target[0].value,
                emailRef: user?.primaryEmailAddress.emailAddress,
                userRef: userDetail?.id
            })

        setOpenUrlInput(false);
        
        if (result) {
            refreshData()
            setLoading(false);
            toast.success('New Project Created', {
                position: 'top-right'
            })
        }
        else {
            setLoading(false);

        }
    }

    return (
        <div>

            {!openUrlInput ?
                <button className='btn btn-secondary w-full'
                    onClick={() => setOpenUrlInput(true)}
                >
                    + Add New Project / Startup</button>
                :

                <form onSubmit={handleSubmit} className='p-3 rounded-lg bg-gray-800'>
                    <label className="input input-bordered flex items-center gap-2 my-3">
                        <Link2 />
                        <input type="url" className="grow" defaultValue={'https://'}
                            placeholder="Project Url" />
                    </label>
                    <button type="submit"
                        disabled={loading}
                        className='btn btn-secondary w-full'>
                        + Add New Project / Startup</button>
                </form>}
        </div>
    )
}

export default AddProject