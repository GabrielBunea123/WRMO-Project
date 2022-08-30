import React, { useState } from 'react'

const Register = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [incorrectCredentials, setIncorrectCredentials] = useState(false)

    function usernameChange(e) {
        setUsername(e.target.value)
    }
    function emailChange(e) {
        setEmail(e.target.value)
    }
    function passwordChange(e) {
        setPassword(e.target.value)
    }
    function submit(e) {
        e.preventDefault()
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            })
        }
        fetch("/users/register", requestOptions)
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
                else {
                    setIncorrectCredentials(true)
                }
            })
            .then()
    }

    return (
        <form className="container auth-container" onSubmit={submit}>
            <div className="card card-auth shadow rounded p-5">
                <h3 className="pt-3 pb-3 fw-bold" style={{ color: "#24305E" }}>Sign up</h3>
                {incorrectCredentials == true ?
                    <label className="fw-bold" style={{ color: "#f7636c" }}>Your username or password is incorrect</label>
                    :
                    null
                }
                <input onChange={usernameChange} className="form-control m-2 ms-0 mt-3" placeholder="Username" type="username" />
                <input onChange={emailChange} className="form-control m-2 ms-0 mt-3" placeholder="Email" type="email" />
                <input onChange={passwordChange} className="form-control m-2 ms-0 mt-3" placeholder="Password" type="password" />
                {/* <MainButton variant="contained" className="mt-5" type="submit">Sign up</MainButton> */}
                <button className="btn btn-primary mt-5" type="submit">Sign up</button>
                <div className="pt-5">
                    <small>
                        <a style={{ textDecoration: "none" }} href="/login">Already have an account? Sign in here</a>
                    </small>
                </div>
            </div>
        </form>
    )
}

export default Register