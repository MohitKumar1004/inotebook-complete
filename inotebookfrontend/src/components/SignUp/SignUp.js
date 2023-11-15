import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignUp(props) {
    const [credentials, setCredentials] = useState({email: '', password: '', cpassword: ''})
    
    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const {name, email, password, cpassword} = credentials

        if(password!==cpassword)
        {
            props.showAlert('Account Created Successfully','success')
            return;
        }

        const response = await fetch(`http://localhost:5001/api/auth/createuser`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, email, password})
        })

        const json = await response.json()
        if(json.success) {
            // save the auth token and redirect
            localStorage.setItem('token',json.authToken)
            navigate('/')
            props.showAlert('Account Created Successfully','success')
        }
        else {
            props.showAlert('Invalid Details','danger')
        }
    }

    const onChange = (e) => {
        setCredentials({...credentials,[e.target.name]: e.target.value})
    }

    return (
        <div className="container mt-2">
            <h2>Create an account to use iNoteBook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Password</label>
                    <input type="name" className="form-control" id="name" name="name" onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={onChange}/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={6} maxLength={20} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={6} maxLength={20} required/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
