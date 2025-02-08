import React, { useEffect, useState } from 'react'
import logo from '../src/images/logo.png'
import toast from 'react-hot-toast';
import axios from 'axios';
import Recording from './Recording';
import { Link } from 'react-router-dom';

export default function Login() {

    const [formData, setFormData] = useState({
            email: '',
            password: ''
        });
    
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const log = localStorage.getItem("verified");
        setVerified(log);
  }, [])
    
    
        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const response = await axios.post('http://localhost:6006/login', formData);
                if (response.data.success) {
                    toast.success('Login successful!');
                    setVerified(true);
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("verified", true);
                    localStorage.setItem("email", formData.email);
                    formData.password='';
                    formData.email='';
                    // navigate('/login'); 
                } else {
                    toast.error(response.data.message || 'Registration failed!');
                }
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }

  return (
    <>
    { !verified ? 
    <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="p-4 border rounded shadow" style={{ width: '350px' }}>
        <div className='d-flex justify-content-center gap-0 mb-5'>
            <img src={logo} alt="" height={"70px"}/>
            <h3 className="align-self-center mt-2">Login</h3>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control myform-input" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control myform-input" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" style={{backgroundColor:"rgb(105, 0, 167)", border:"1px solid rgb(105, 0, 167"}}>Login</button>
        </form>
        <p className="text-center mt-2">Don't have an account? 
            <Link to='/' style={{color:"rgb(105, 0, 167)"}}>Register</Link>
        </p>
    </div>
</div> :
<Recording setVerified={setVerified}></Recording>
    }
    </>
     
  )
}
