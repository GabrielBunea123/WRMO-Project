import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";


const Navigation = () => {

    const [user, setUser] = useState({})
    const [notifications, setNotifications] = useState([])
    const [isAuth, setIsAuth] = useState(false)
    const [notificationCardActive, setNotificationCardActive] = useState(false)
    const notificationRef = useRef()
    const navigate = useNavigate()

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

    const handleLogout = (e) => {
        setIsAuth(false)
        localStorage.setItem("tokenAuth", "")
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                logout_user: isAuth
            })
        }
        fetch("/users/logout", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
            })
    }

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
                    setUser(data)
                    setIsAuth(true)
                    getUserNotifications(data.id)
                    RunNotificationWebSocket()
                }
            })
            .catch(err => {
                setIsAuth(false)
                setNotifications([])
            })

    }

    const getUserNotifications = (user_id) => {
        fetch(`/api/get-user-notifications` + "?user_id=" + user_id)
            .then(res => res.json())
            .then(data => {
                setNotifications(data)
            })
            .catch(err => console.log(err))
    }


    const RunNotificationWebSocket = () => {
        const socket = new WebSocket(`ws://${window.location.host}/ws/notification`)

        socket.onopen = function (event) {
            console.log(event)
        };
        socket.onmessage = function (event) {
            setNotifications(prev => [...prev, JSON.parse(event.data).notification])
        }
        socket.onclose = function () {
            socket.close()
        }
    }

    const handleNotificationCardToggle = () => {
        setNotificationCardActive(!notificationCardActive)
    }

    useEffect(() => {
        getUser()
    }, [localStorage.getItem('tokenAuth'), localStorage.getItem('reloadNotifications')])

    useEffect(() => {//handle when the notifications card is open and close it if an outside click is made
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationCardActive(!notificationCardActive)
            }
        };
        document.addEventListener('click', handleClickOutside, false);
        return () => {
            document.removeEventListener('click', handleClickOutside, false);
        };
    }, [notificationCardActive]);

    return (
        <nav class="navbar navbar-light">
            <div class="container-fluid">
                <div>
                    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" aria-controls="offcanvas">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <a class="navbar-brand ms-3" href="/">WRMO</a>
                </div>

                {/* NOTIFICATIONS */}
                <a style={{ marginRight: 15, color: "black" }} type="button" onClick={handleNotificationCardToggle}>
                    <h6 className="fw-bold"><i class="fa-regular fa-bell"></i></h6>
                </a>
                {notificationCardActive === true &&
                    <ul class="notifications-dropdown" ref={notificationRef}>
                        {notifications.length > 0 ?
                            <>
                                {notifications.reverse().map((item, index) => (
                                    <a className="notification-href" href={`/applications/${item.project_id}`}>
                                        <li className={`notification ${item.status === "unread" && "fw-bold"}`}>
                                            <span class="dropdown-item-text postion-relative notification-href-text">
                                                {item.status === "unread" ?
                                                    <p><i style={{ color: "#ff4444" }} class="fa-solid fa-circle me-2"></i>{item.message}</p> :
                                                    <p style={{color:"gray"}}><i style={{ color: "gray" }} class="fa-solid fa-circle-check me-2"></i>{item.message}</p>
                                                }
                                            </span>
                                        </li>
                                    </a>
                                ))}
                            </>
                            :
                            <li><span class="dropdown-item-text postion-relative" style={{ paddingTop: 15 }}>You have no notifications yet</span></li>
                        }
                    </ul>
                }

                <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasNavbarLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">WRMO</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body p-0">
                        <ul class="navbar-nav justify-content-end flex-grow-1">
                            <li class="nav-item pe-3 ps-3">
                                <a class="nav-link active" aria-current="page" href="/">Home</a>
                            </li>
                            <li class="nav-item pe-3 ps-3">
                                <a class="nav-link" href={`/projects/${user.id}`}>Projects</a>
                            </li>
                            <li class="nav-item pe-3 ps-3">
                                <a class="nav-link" href="#">Messages</a>
                            </li>
                            <li class="nav-item pe-3 ps-3">
                                <a class="nav-link" href="#">Profile</a>
                            </li>
                            {isAuth == false ?
                                <li className="nav-item pe-3 ps-3 w-100 bottom-0 end-0 pb-2">
                                    <a class="nav-link" href="/login">Sign in</a>
                                </li>
                                :
                                <li className="nav-item pe-3 ps-3 w-100 bottom-0 start-0 pb-2">
                                    <a onClick={handleLogout} class="nav-link" href="/login">Logout</a>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </nav >
    )
}

export default Navigation