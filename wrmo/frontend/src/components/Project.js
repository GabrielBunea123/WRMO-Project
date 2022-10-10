import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Project = () => {
    
    const { project_name, project_id } = useParams()

    const getProject = () =>{
        
    }

    useEffect(()=>{
        getProject()
    },[])

    return (
        <div className="container">
            Project
        </div>
    )
}

export default Project