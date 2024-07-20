import { db } from '../../../utils';
import { project} from '../../../utils/schema';
import { storage } from '../../../utils/firebaseConfig'
import { TwicPicture } from '@twicpics/components/react'
import { and, eq } from 'drizzle-orm'
import { ref, uploadBytes } from 'firebase/storage'
import { GripVertical, Image, LayoutGrid, LineChart, Link2, SquareStack, Trash2 } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useUser } from '@clerk/nextjs'
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext'
function ProjectListEdit({ projectList, refreshData }) {
    const [selectedOption, setSelectedOption] = useState()
    const [projectListData,setProjectListData]=useState([]);
    // const {updatePreview,setUpdatePreview}=useContext(PreviewUpdateContext)

    let timeoutId;
    const {user}=useUser();
    useEffect(()=>{
        projectList&&setProjectListData(projectList);
    },[projectList])

    /**
     * Used to Save user Info
     * @param {*} event 
     * @param {*} fieldName 
     */
    const onInputChange = (value, fieldName, projectId) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(async () => {
            const result = await db.update(project)
                .set({
                    [fieldName]: value
                }).where(eq(project.id, projectId))

            if (result) {
                toast.success('Saved!', {
                    position: 'top-right'
                })
                setUpdatePreview(updatePreview+1)
            }
            else {
                toast.error('Error!', {
                    position: 'top-right'
                })
            }
        }, 1000)
    }

    const handleFileUploadForProject = (event, projectId, fieldName) => {
        const file = event.target.files[0];
        console.log("IN PROJECT")
        const fileName = Date.now().toString() + '.' + file.type.split('/')[1];
        console.log(fileName)
        const storageRef = ref(storage, fileName);
        uploadBytes(storageRef, file).then(async (snapshot) => {
            console.log('file uploaded!');
            const result = await db.update(project).set({
                [fieldName]: fileName + "?alt=media"
            }).where(eq(project.id, projectId))

            console.log('RESULT', result)
            if (result) {

                refreshData()
                toast.success('Saved!', {
                    position: 'top-right'
                })
                setUpdatePreview(updatePreview+1)

            }
        }, (e) => console.log(e));
    }

    const OnProjectDelete = (projectId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await db.delete(project).where(eq(project.id, projectId))
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                refreshData();
                toast.error('Deleted!', {
                    position: 'top-right'
                })
                setUpdatePreview(updatePreview+1)

            }
        });
    }

    const handleOnDragEnd=async(result)=>{

        if(!result.destination) return;
        const newList=Array.from(projectListData);
        const [reorderList]=newList.splice(result.source.index,1);
        newList.splice(result.destination.index,0,reorderList);
        setProjectListData(newList);
        console.log(newList)

        console.log(result);

        //Updating the source to Destination
        const result1=await db.update(project)
        .set({
            order:result?.destination.index
        }).where(eq(project.order,result.source.index))
        .where(eq(project.id,result?.draggableId))
       
        ;

        if(result)
        {
            setUpdatePreview(updatePreview+1)

        }
        console.log(result1);
        // const result2=await db.update(project)
        // .set({
        //     order:result?.source.index
        // })
        // .where( eq(project?.emailRef,user?.primaryEmailAddress.emailAddress))
        // .where(eq(project.order,result.destination.index))

     
    }

    return (
        <div className='  mt-10'>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='droppable'>
                    {(provided)=>(
                        <div ref={provided.innerRef} {...provided.droppableProps} >
                    {projectListData.map((project, index) => (
                        <Draggable draggableId={(project.id).toString()} index={index}>
                            {(provided)=>(
                                 <div 
                                    key={project.id}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                   
                                 className='my-7 bg-gray-800 p-5 rounded-lg flex items-center gap-4' >
                                   
                                    <div  {...provided.dragHandleProps}>
                                        <GripVertical/>
                                    </div>
                                    <div className='flex flex-col w-full'>
                                 <div className='flex items-center gap-3 '>
                                     <label htmlFor={'project-file-input' + project.id} className='cursor-pointer'>
                                         <TwicPicture
                                             src={project.logo} className='w-[50px] h-[50px]
                                 rounded-full'></TwicPicture>
                                     </label>
                                     <input type="file" id={'project-file-input' + project.id}
                                         onChange={(event) => handleFileUploadForProject(event, project.id, 'logo')} accept="image/png, image/gif, image/jpeg"
                                         style={{ display: 'none' }} />
                                     <input type="text" placeholder="Project / Startup Name"
                                         defaultValue={project.name}
                                         className="input input-bordered w-full my-2"
                                         onChange={(event) => onInputChange(event.target.value, 'name', project.id)}
                                     />
                                 </div>
                                 <input type="text" placeholder="Tell me about your project"
                                     className="input input-bordered w-full text-sm"
                                     defaultValue={project.desc}
                                     onChange={(event) => onInputChange(event.target.value, 'desc', project.id)} />
 
                                 <div>
 
                                     <div className='flex gap-3 mt-3 items-center justify-between' >
 
                                         <div className='flex gap-3 mt-3'>
                                             <Link2 className={`h-12 w-12 p-3 
                                             rounded-md hover:bg-gray-600
                                             ${selectedOption == 'link' + index && 'bg-gray-600'}
                                             `}
                                                 onClick={() => setSelectedOption('link' + index)} />
 
                                             <LayoutGrid className={`h-12 w-12 p-3 
                                             rounded-md hover:bg-gray-600
                                             ${selectedOption == 'category' + index && 'bg-gray-600'}
                                             `}
                                                 onClick={() => setSelectedOption('category' + index)} />
                                             <Image className={`h-12 w-12 p-3 
                                             rounded-md hover:bg-gray-600
                                             ${selectedOption == 'banner' + index && 'bg-gray-600'}
                                             `}
                                                 onClick={() => setSelectedOption('banner' + index)} />
 
                                         <LineChart className={`h-12 w-12 p-3 
                                             rounded-md hover:bg-gray-600
                                             ${selectedOption == 'linechart' + index && 'bg-gray-600'}
                                             `}
                                                 onClick={() => setSelectedOption('linechart' + index)} />
                                         </div>
                                         <div className='flex gap-3 items-center'>
                                             <button className='btn btn-error btn-sm'
                                                 onClick={() => OnProjectDelete(project.id)}
                                             ><Trash2 /></button>
                                             <input type="checkbox" className="toggle toggle-secondary"
                                                 defaultChecked={project.active}
                                                 onChange={(event) => onInputChange(event.target.checked, 'active', project.id)} />
 
 
                                         </div>
                                     </div>
 
                                     {selectedOption == 'link' + index ?
                                         <div className='mt-2' >
                                                     <label className='my-2'>Project Link</label>
 
                                             <label className="input input-bordered flex items-center gap-2">
                                                 <Link2 />
                                                 <input type="text" className="grow"
                                                     placeholder="Url"
 
                                                     defaultValue={project?.url}
                                                     onChange={(event) => onInputChange(event.target.value, 'url', project.id)}
                                                 />
                                             </label>
                                         </div> :
                                         selectedOption == 'category' + index ?
                                             <div className='mt-2' >
                                                 {/* <label className="input input-bordered flex items-center gap-2"> */}
                                                     <label className='my-2'>Category</label>
                                                 
                                                     <select className="select select-bordered w-full " onChange={(event) => onInputChange(event.target.value, 'category', project.id)}>
                                                     <option disabled selected>{project.category}</option>
                                                     <option>🤖 AI</option>
                                                     <option>📚 Educational</option>
                                                     <option>🔭 Technology</option>
                                                     <option>🤝 Services</option>
                                                     <option>💬 Chatbot</option>
                                                     <option>⚡ Dev Tools</option>
                                                     <option>🌐 Web App</option>
                                                     <option>📱 Mobile Apps</option>
                                                     <option>🎨 Design Tool</option>
                                            
 
 
 
 
 
                                                     </select>
                                                 {/* </label> */}
                                             </div> :
                                             selectedOption == 'banner' + index ?
                                                 <div className='mt-2' >
                                                     <label>Add Banner</label>
                                                     <label className="flex items-center gap-2 cursor-pointer" htmlFor={'project-banner-file-input' + index}>
                                                         <TwicPicture
                                                             src={project?.banner} className='w-[100px] rounded-md
                                                     '></TwicPicture>
                                                     </label>
                                                     <input type="file" id={'project-banner-file-input' + index}
                                                         onChange={(event) => handleFileUploadForProject(event, project.id, 'banner')} accept="image/png, image/gif, image/jpeg"
                                                         style={{ display: 'none' }} />
                                                 </div> :
                                                 selectedOption == 'linechart' + index ?
                                                 <div className='mt-2 flex justify-between items-center border p-4 rounded-lg' >
                                                     <label>Show Project Visitors Graph</label>
                                                     <input type="checkbox" className="toggle toggle-secondary"
                                                 defaultChecked={project?.showGraph}
                                                 onChange={(event) => onInputChange(event.target.checked, 'showGraph', project.id)} />
                                                 </div>: null}
 
 
                                 </div>
                             </div>
                             </div>
                            )}
                           
                       </Draggable>
                    ))}
                        </div>
                    )}
                   
                </Droppable>
            </DragDropContext>

        </div>
    )
}

export default ProjectListEdit
