import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ProjectApplication = () => {

    const { id } = useParams()

    const [project, setProject] = useState({})
    const [user, setUser] = useState({})
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState(null)
    const [cv, setCv] = useState(null)
    const socket = new WebSocket(`ws://${window.location.host}/ws/notification`)

    const handleNameChange = (e) => {
        setName(e.target.value)

    }
    const handleEmailChange = (e) => {
        setEmail(e.target.value)

    }
    const handleNumberChange = (e) => {
        setNumber(e.target.value)
    }
    const handleCVInputChange = (e) => {
        setCv(e.target.files[0])

    }

    const getProject = () => {
        fetch("/api/get-project-info" + "?id=" + id)
            .then(res => res.json())
            .then(data => {
                data.qualifications = JSON.parse(data.qualifications)
                setProject(data)
            })
    }

    const getUser = () => {
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
                if (data.username) {
                    setUser(data)
                    setName(data.username)
                    setEmail(data.email)
                }
                else setUser({ id: 'Anonymous' })
            })
    }

    const submitApplication = () => {
        const formData = new FormData()

        formData.append('user', user.id)
        formData.append('email', email)
        formData.append('contact_number', number)
        formData.append('project_id', id)
        formData.append('cv', cv)
        formData.append('accepted', false)
        formData.append('name', name)

        axios.post('/api/create-join-project-request', formData, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            }
        })
            .then(res => {
                console.log(res.data)
                RunNotificationWebSocket()
            })
            .catch(err => console.log(err))


    }

    const RunNotificationWebSocket = () => {
        socket.send(JSON.stringify({
            "user": project.host,  //the user who needs to receive the notification,
            "type_of_notification": "Project application",
            "message": `${user.username} just applied for your project !`,
            "project_id":id
        }))
    }

    useEffect(() => {
        getUser()
        getProject()
    }, [])


    return (
        <div className="container">
            <div class="card shadow-sm rounded create-project-card">
                <div class="card-body p-4">
                    <h5 class="card-title fw-bold">Job application</h5>
                    {/* name */}
                    <div>
                        <div className="pt-3">
                            <label for="exampleFormControlInput1" class="form-label">Name</label>
                            <input value={name} onChange={handleNameChange} className="form-control" placeholder="Name" />
                        </div>
                        {/* email */}
                        <div className="pt-4">
                            <label for="exampleFormControlInput1" class="form-label">Email address</label>
                            <input value={email} onChange={handleEmailChange} type="email" className="form-control" placeholder="Email" />
                        </div>
                        {/* contact_number */}
                        <div className="pt-4">
                            <label for="exampleFormControlInput1" class="form-label">Phone number</label>
                            <input value={number} type="number" onChange={handleNumberChange} className="form-control" placeholder="Contact number"></input>
                        </div>

                        {/* cv */}
                        <div className="pt-4">
                            <label for="formFile" class="form-label">Attach your CV</label>
                            <input onChange={handleCVInputChange} class="form-control" type="file" id="formFile" />
                        </div>
                        <button className="btn btn-primary mt-5" onClick={submitApplication}>Apply</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ProjectApplication