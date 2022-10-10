import React, { useState } from 'react'
import QualificationsList from '../functional-components/QualificationsList'
import axios from 'axios'
import NewQualification from '../functional-components/NewQualification'

const CreateProjectRoom = () => {

    const [projectName, setProjectName] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [projectField, setProjectField] = useState('Graphics & Design')
    const [qualifications, setQualifications] = useState('')
    const [currentQualification, setCurrentQualification] = useState('')
    const [qualificationInDev, setQualificationInDev] = useState(true)
    const [incomplete, setIncomplete] = useState(false)
    const [enrollmentMethod, setEnrollmentMethod] = useState('CV')
    const [experience, setExperience] = useState('Beginner')
    const [projectLocation, setProjectLocation] = useState('')
    const [projectMembers, setProjectMembers] = useState(0)

    const handleProjectNameChange = (e) => {
        setProjectName(e.target.value)
    }
    const handleProjectDescriptionChange = (e) => {
        setProjectDescription(e.target.value)
    }
    const handleProjectFieldChange = (e) => {
        setProjectField(e.target.value)
        // console.log(e.target.value)
    }
    const handleProjectExperienceChange = (e) => {
        setExperience(e.target.value)
    }
    const handleProjectLocationChange = (e) => {
        setProjectLocation(e.target.value)
    }
    const handleProjectMembersChange = (e) => {
        setProjectMembers(e.target.value)
    }
    const handleRadioChange = (e) => {
        setEnrollmentMethod(e.target.value)
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
                enrollment_method: enrollmentMethod,
                work_field: projectField,
                project_location: projectLocation,
                members_needed: projectMembers,
                work_experience: experience,
            })
        }
        fetch('/api/create-project-room', requestOptions)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
    }

    return (
        <div className="container">
            <div class="card shadow-sm rounded create-project-card">
                <div class="card-body p-4">

                    <h5 class="card-title fw-bold">Create new project</h5>
                    <input onChange={handleProjectNameChange} className="form-control mb-3 mt-3" placeholder="Project name" />
                    <textarea onChange={handleProjectDescriptionChange} className="form-control mb-3 mt-3" placeholder="Project Description" />

                    <h6 className="pt-3">Field</h6>
                    <select onChange={handleProjectFieldChange} class="form-select mb-3 mt-3" aria-label="Default select example">
                        <option value="Graphics & Design">Graphics & Design</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Video & Animation">Video & Animation</option>
                        <option value="Programming & Tech">Programming & Tech</option>
                    </select>

                    <h6 className="pt-3">Experience</h6>
                    <select onChange={handleProjectExperienceChange} class="form-select mb-3 mt-3" aria-label="Default select example">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>

                    <h6 className="pt-3">Location</h6>
                    <input onChange={handleProjectLocationChange} className="form-control mb-3 mt-3" placeholder="Location of the project" />

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
                    <div class="form-check mt-3">
                        <input onClick={handleRadioChange} value="CV" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                        <label class="form-check-label" for="flexRadioDefault1">
                            Resume
                        </label>
                    </div>
                    <div class="form-check mb-3">
                        <input onClick={handleRadioChange} value="Profile lookover" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                        <label class="form-check-label" for="flexRadioDefault2">
                            Profile look-over
                        </label>
                    </div>
                    {/* <input onChange={handleProjectEnrollmentChange} className="form-control mb-3 mt-3" placeholder="How to get accepted ?" /> */}

                    <h6 className="pt-3">Members</h6>
                    <input onChange={handleProjectMembersChange} type="number" className="form-control mb-3 mt-3" placeholder="Members needed" />

                    <button className="btn btn-primary mt-5" onClick={createRoom}>Create</button>
                </div>
            </div>

        </div>
    )
}

export default CreateProjectRoom