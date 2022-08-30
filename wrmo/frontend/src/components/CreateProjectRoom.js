import React, { useState } from 'react'
import QualificationsList from '../functional-components/QualificationsList'
import axios from 'axios'
import NewQualification from '../functional-components/NewQualification'

const CreateProjectRoom = () => {

    const [projectName, setProjectName] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [qualifications, setQualifications] = useState('')
    const [currentQualification, setCurrentQualification] = useState('')
    const [qualificationInDev, setQualificationInDev] = useState(true)
    const [incomplete, setIncomplete] = useState(false)
    const [enrollmentMethod, setEnrollmentMethod] = useState('')

    const handleProjectNameChange = (e) => {
        setProjectName(e.target.value)
    }
    const handleProjectDescriptionChange = (e) => {
        setProjectDescription(e.target.value)
    }
    //for the requirements section
    const handleSubmitNew = () => {
        if (currentQualification.length > 0) {
            setQualifications(prev => [...prev, currentQualification])
            setCurrentQualification('')
            setQualificationInDev(true)
        }

    }
    const handleQualificationChange = (e) => {
        setCurrentQualification(e.target.value)
    }
    //end of requirements functions

    const handleProjectEnrollmentChange = (e) => {
        setEnrollmentMethod(e.target.value)
    }

    const createRoom = () => {
        var authToken = localStorage.getItem('tokenAuth')
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${authToken}`
            },
            body: JSON.stringify({
                project_name: projectName,
                project_description: projectDescription,
                qualifications: JSON.stringify(qualifications),
                enrollment_method: enrollmentMethod
            })
        }
        fetch('/api/create-project-room', requestOptions)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
    }

    return (
        <div className="container">
            <div class="card general-card">
                <div class="card-body p-4">

                    <h5 class="card-title fw-bold">Create new project</h5>
                    <input onChange={handleProjectNameChange} className="form-control mb-3 mt-3" placeholder="Project name" />
                    <textarea onChange={handleProjectDescriptionChange} className="form-control mb-3 mt-3" placeholder="Project Description" />

                    <h6 className="pt-3">Project requirements</h6>
                    <div>
                        {qualifications.length > 0
                            ?
                            <QualificationsList requirements={qualifications} />
                            :
                            null
                        }
                        {qualificationInDev == true ?
                            <NewQualification
                                handleSubmitNew={handleSubmitNew}
                                handleQualificationChange={handleQualificationChange}
                                incomplete={incomplete}
                                value={currentQualification}
                            />
                            :
                            null
                        }
                    </div>

                    <h6 className="pt-3">Method of enrollment</h6>
                    <input onChange={handleProjectEnrollmentChange} className="form-control mb-3 mt-3" placeholder="How to get accepted ?" />

                    <button className="btn btn-primary mt-5" onClick={createRoom}>Create</button>
                </div>
            </div>

        </div>
    )
}

export default CreateProjectRoom