import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from 'react-router-dom'
import CreateProjectRoom from './CreateProjectRoom'
import Home from './Home'
import Login from './Login'
import Register from './Register'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/create-project-room" element={<CreateProjectRoom/>} />
            </Routes>
        </Router>
    )
}

export default App
