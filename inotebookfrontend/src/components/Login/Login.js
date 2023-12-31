import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(props) {
    
    const host = process.env.REACT_APP_SERVER_HOST
    
    const [credentials, setCredentials] = useState({email: '', password: ''})
    
    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch(`${host}/api/auth/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        })
        
        const json = await response.json()
        if(json.success) {
            // save the auth token and redirect
            localStorage.setItem('token',json.authToken)
            navigate('/')
            props.showAlert('Logged in Successfully','success')
        }
        else {
            props.showAlert('Invalid Credentials','danger')
        }
    }

    const onChange = (e) => {
        setCredentials({...credentials,[e.target.name]: e.target.value})
    }

    return (
        <div className="mt-3">
            <h2>Login to continue to iNoteBook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={credentials.email} aria-describedby="emailHelp" onChange={onChange}/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
