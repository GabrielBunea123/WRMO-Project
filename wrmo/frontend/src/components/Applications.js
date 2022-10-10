import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Applications = () => {
    const { id } = useParams()

    const [filterBool, setFilterBool] = useState(false)
    const [projectDetails, setProjectDetails] = useState({})
    const [projectApplications, setProjectApplications] = useState([])
    const socket = new WebSocket(`ws://${window.location.host}/ws/notification`)

    const getProject = () => {
        fetch('/api/get-project-info' + "?id=" + id)
            .then(res => res.json())
            .then(data => {
                setProjectDetails(data)
            })
            .catch(err => console.log(err))
    }

    const getProjectApplications = () => {
        fetch("/api/get-project-applications" + "?id=" + id)
            .then(res => res.json())
            .then(data => {
                setProjectApplications(data)
                setApplicationNotificationRead()
            })
            .catch(err => console.log(err))
    }

    const handleAcceptApplication = (application_id) => {
        fetch('/api/accept-project-application' + "?id=" + application_id)
            .then(res => res.json())
            .then(data => {
                console.log(data)
            })
            .catch(err => console.log(err))
    }

    const setApplicationNotificationRead = () => {

        socket.send(JSON.stringify({
            "project_id": id,
            "type_of_notification": 'Status update'
        }))
    }


    useEffect(() => {
        getProjectApplications()
        getProject()
    }, [])

    const loopAllApplications = () => {
        return (
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">User</th>
                            <th scope="col">Email</th>
                            <th scope="col">CV</th>
                            <th scope="col">Accept</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectApplications.length > 0 ? projectApplications.map((item, index) => (
                            <tr>
                                <th scope="col">{index + 1}</th>
                                <td>{item.name}</td>
                                <td><a>{item.email}</a></td>
                                <td><a href="#">See file</a></td>
                                <td><button data-bs-toggle="modal" data-bs-target="#acceptModal" className="btn"><i style={{ color: "#26d483" }} class="fa-solid fa-check"></i></button></td>
                                <div class="modal fade" id="acceptModal" tabindex="-1" aria-labelledby="acceptModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="acceptModalLabel">Accept application</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body text-center py-4">
                                                Are you sure you want to accept {item.name}'s project application ?
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button onClick={()=>handleAcceptApplication(item.id)} type="button" class="btn btn-primary">Accept</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </tr>
                        )) : <h3>There are no activities</h3>}
                    </tbody>
                </table>
            </div>
        )

    }


    return (
        <div style={{ paddingTop: 50 }} className="container">
            <h2 style={{ paddingBottom: 30 }}>{projectDetails.project_name} applications</h2>

            {/* APPLICATIONS TABLE */}
            {loopAllApplications()}

            {/* <h4 style={{ paddingTop: 30 }}>{filteredActivities.length} Activities</h4> */}

        </div>
    )
}

export default Applications