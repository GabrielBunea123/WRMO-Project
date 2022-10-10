import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from 'react-router-dom'
import CreateProjectRoom from './CreateProjectRoom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Navigation from './Navigation'
import ProjectApplication from './ProjectApplication'
import Applications from './Applications'
import UserProjects from './UserProjects'
import Project from './Project'

const App = () => {

    const [isAuth, setIsAuth] = useState(false)

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }//csrftoken
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    const getUser = () => {
        const authToken = localStorage.getItem("tokenAuth")
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${authToken}`
            }
        }
        fetch("/users/get-user", requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.username) {
                    setIsAuth(true)
                }
            })
            .catch(err => {
                setIsAuth(false)
            })

    }

    useEffect(() => {
        getUser()
    }, [localStorage.getItem('tokenAuth')])

    return (
        <Router>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-project-room" element={<CreateProjectRoom />} />
                <Route path="/project-application/:id" element={<ProjectApplication />} />
                <Route path="/applications/:id" element={<Applications />} />
                <Route path="/projects/:user_id" element={<UserProjects/>}/>
                <Route path="/:project_name/:project_id" element={<Project/>}/>

                {isAuth === false &&
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </>
                }
            </Routes>
        </Router>
    )
}

export default App
