import React, { useState, useEffect } from 'react'
import { Modal } from '@mui/material'
import Navigation from './Navigation'

const Home = () => {

    const [projects, setProjects] = useState([])
    const [currentProject, setCurrentProject] = useState({})
    const [projectId, setProjectId] = useState(null)
    const [user, setUser] = useState({})

    const getAllProjects = () => {
        fetch('/api/all-projects')
            .then(res => res.json())
            .then(data => {
                data.map(item => {
                    item.qualifications = JSON.parse(item.qualifications)
                })
                setProjects(data)
            })
            .catch(err => console.log(err))
    }

    function getUser() {
        var authToken = localStorage.getItem('tokenAuth')
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${authToken}`
            }
        }
        fetch("/users/get-user", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data.username)
                    setUser(data)
                else setUser({ id: 'Anonymous' })
            })
    }


    const handleProjectCardClick = (id) => {
        for (var i = 0; i < projects.length; i++) {
            if (projects[i].id == id) {
                setCurrentProject(projects[i])
            }
        }
    }


    useEffect(() => {
        getUser()
        getAllProjects()
    }, [])

    return (
        <div>
            {/* <Navigation /> */}
            <div className="container">
                <a href="/create-project-room" className="btn btn-outline-primary mt-4"><i class="fa-solid fa-plus"></i> Create</a>
                <div class="row row-cols-1 row-cols-lg-2 mt-3">
                    {projects.length > 0 && projects.map((item, index) => (
                        <div class="col-sm-6">

                            {/* MODAL */}
                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-xl">
                                    <div class="modal-content p-2">
                                        <div class="modal-header">
                                            <div className="py-1">
                                                <h4>{currentProject.project_name}</h4>
                                                <div className="p-1 pt-2">
                                                    <div><small><i class="fa-solid fa-location-dot"></i> {currentProject.project_location}</small></div>
                                                    <div><small><i class="fa-solid fa-calendar"></i> Posted {new Date(currentProject.created_at).toDateString()}</small></div>
                                                    <div><small>Type: {currentProject.work_field}</small></div>
                                                    <div><small>Method of enrollment: {currentProject.enrollment_method}</small></div>
                                                </div>
                                            </div>
                                            <div className="btn-close-modal">
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <hr></hr>
                                        </div>
                                        <div className="modal-body">
                                            <div className="p-1 pb-5">
                                                <div className="pt-3">
                                                    <div><small className="fw-bold">Project description</small></div>
                                                    <div className="pt-2">
                                                        {currentProject.project_description}
                                                    </div>
                                                </div>
                                                <div className="pt-4">
                                                    <div><small className="fw-bold">Project requirements</small></div>
                                                    <div className="pt-2">
                                                        <ul>
                                                            {currentProject.qualifications && currentProject.qualifications.map(requirement => (
                                                                <li>{requirement}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="pt-4">
                                                    <div><small className="fw-bold">Other aspects of the project</small></div>
                                                    <div className="pt-2">
                                                        Members needed: {currentProject.members_needed}
                                                    </div>
                                                    <div>
                                                        Experience: {currentProject.work_experience}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-footer justify-content-start p-0 pt-3">
                                                <a href={user.username ? `/project-application/${currentProject.id}` : '/login'} class="btn btn-primary mr-auto">Apply</a>
                                                {user.id == currentProject.host && <a href={`/applications/${currentProject.id}`} class="btn btn-outline-primary mr-auto">Users applications</a>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PAGE CONTENT */}
                            <div class="card project-card mt-3 shadow p-3 mb-5 bg-body rounded pb-3">
                                <a data-bs-toggle="modal" data-bs-target="#exampleModal" className="project-href" onClick={() => { handleProjectCardClick(item.id) }}>
                                    <div class="card-body project-href-content">
                                        <div className="d-flex justify-content-between flex-wrap mb-2">
                                            <div>
                                                <h5 class="card-title fw-bold">{item.project_name}</h5>
                                            </div>
                                            <div>
                                                <i class="fa-solid fa-location-dot"></i> {item.project_location}
                                            </div>
                                        </div>

                                        <small>{new Date(item.created_at).toDateString()} {new Date(item.created_at).toLocaleTimeString()}</small>
                                        <div style={{ minHeight: 100 }}>
                                            <p class="card-text pt-3">{item.project_description && item.project_description.slice(0, 200) + "..."}</p>
                                        </div>
                                        <div className="pt-2" style={{ fontWeight: 480 }}>
                                            Experience level: {item.work_experience}
                                        </div>
                                        <div style={{ fontWeight: 480 }}>
                                            Members needed: {item.members_needed}
                                        </div>
                                        <div class="chip mt-5">
                                            <small className="px-3">{item.work_field}</small>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home