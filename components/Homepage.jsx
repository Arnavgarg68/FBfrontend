import './componentsCss/homepage.css'
import { React, useState, useRef } from 'react'
import Logo from "./materials/live-job-high-resolution-logo.png"
import employee from "./materials/icons8-employee.png"
import about from "./materials/icons8-about.png"
import background from "./materials/man-scroll-removebg-preview.png"
import { useNavigate } from 'react-router-dom'
import states from './materials/countries+states-simplified.json'
import { ToastContainer, toast } from 'react-toastify'
export default function Homepage() {
    // to manage login/signup box appear
    const [login, setLogin] = useState(false);
    const [l, setL] = useState(false);
    const [s, setS] = useState(true);

    // function to show or hide login/signupbox
    const loginswitchnavbar = () => {
        setLogin(true);
    }

    // function to close login/signup box if clicked outside
    const loginswitch = (eve) => {
        const outer = document.querySelector('.homepage-login-box');
        const inner = document.querySelector('.homepage-login-box-inner-1');
        if (outer.contains(eve.target) && !inner.contains(eve.target)) {
            setLogin(false);
        }
    }

    // fucntion to switch between singup and login
    const switchlogin = () => {
        setL((e) => !e);
        setS((e) => !e);
    }

    // function to show or hide password on hover
    const passwordshow = () => {
        const element = document.getElementById("password");
        element.type = 'text';
    }
    const passwordhide = () => {
        const element = document.getElementById("password");
        element.type = 'password';
    }

    // variables and states for controlled rendering
    const loginUsername = useRef(null);
    const loginPassword = useRef(null);
    const signupUsername = useRef(null);
    const signupState = useRef(null);
    const signupPassword = useRef(null);

    // user login handle submit function
    const loginsubmit = async(e) => {
        e.preventDefault();
        const username = loginUsername.current.value.trim(' ').toLowerCase();
        const password = loginPassword.current.value.trim(' ');
        if(!username||!password){
            toast.error("Invalid form fields")
            return;
        }
        if(password.indexOf(' ')>0){
            toast.warning("password cannot contain spaces")
            return;
        }
        try {
            const response = await fetch('https://fbbackend-b4v6.onrender.com/login',{
                method:"POST",
                headers:{
                    "content-type":"application/json"                },
                body:JSON.stringify({
                    username:username,
                    password:password
                })
            })
            if(!response){
                toast.error("Server is booting try after 2-3 min");
                return;
            }
            const data = await response.json();
            if(data.errormsg){
                toast.error(data.errormsg);
                return;
            }
            if(response.ok){
                localStorage.setItem('token',data.token);
                navigate('/landing');
            }
            else{
                toast.warning("server loading")
            }
        } catch (error) {
            toast.error("failed try after sometime");
        }
        
    }

    // function to handle signup of user 
    const signupsubmit = async(e) => {
        e.preventDefault();
        const username = signupUsername.current.value.trim(' ').toLowerCase();
        const password = signupPassword.current.value.trim(' ');
        const state = signupState.current.value;
        if(!username||!password||!state){
            toast.error("Invalid form fields")
            return;
        }
        if(password.length<6){
            toast.warning("password length too short");
            return;
        }
        if(password.indexOf(' ')>0){
            toast.warning("password cannot contain spaces");
            return;
        }
        try {
            const response = await fetch('https://fbbackend-b4v6.onrender.com/create',{
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    username:username,
                    password:password,
                    state:state
                })
            })
            if(!response){
                toast.error("Server is booting wait for sometime");
                return;
            }
            const data = await response.json();
            if(data.errormsg){
                toast.error(data.errormsg);
                return;
            }
            if(response.ok){
                console.log(data);
                localStorage.setItem('token',data.token);
                navigate('/landing');
            }
            else{
                toast.warning("server loading")
            }
        } catch (error) {
            toast.error("Issue in sending request try aftersometime")
        }

    }
    const navigate = useNavigate();
    return (
        <div id='homepage-main'>
            <ToastContainer/>
            <div id="homepage-inner">
                <div className="homepage-navbar">
                    <div className="homepage-navbar-imageHandler">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="homepage-login-set">
                        <div className="homepage-login-signup" onClick={loginswitchnavbar}>
                            <div className="homepage-login-img">
                                <img src={employee} alt="" />
                            </div>
                            <div className="homepage-login-text">Login/Signup</div>
                        </div>
                        <div className="homepage-login-signup">
                            <div className="homepage-login-img">
                                <img src={about} alt="" />
                            </div>
                            <div className="homepage-login-text">About us</div>
                        </div>
                    </div>
                </div>
                <div className="homepage-content">
                    <div className="homepage-content-set">
                        <div className="homepage-content-text">
                            "FriendsBook: A web application for all your socializing"
                        </div>
                        <div className="homepage-content-img">
                            <img src={background} alt="" />
                        </div>
                    </div>
                </div>
                {login && (<div className="homepage-login-box" onClick={loginswitch}>
                    {s && (<form className="homepage-login-box-inner-1" onSubmit={signupsubmit}>
                        <div className="homepage-login-input-set">
                            <label htmlFor="">Username</label>
                            <input type="text" ref={signupUsername} />
                        </div>
                        <div className="homepage-login-input-set">
                            <label htmlFor="">State</label>
                            <select className='homepage-states-select' ref={signupState}>
                                <option value=""></option>
                                {states ? states.states.map((e, idx) => (
                                    <option value={e.name} key={idx}>{e.name}</option>
                                )) : (<></>)}
                            </select>
                        </div>
                        <div className="homepage-login-input-set">
                            <label htmlFor="">Password (6+ characters)</label>
                            <input type="password" id='password' ref={signupPassword} onMouseOver={passwordshow} onMouseOut={passwordhide} />
                        </div>
                        <div className="homepage-login-agreement">
                            By clicking Agree & Join or Continue, you agree to the LiveJob User Agreement, Privacy Policy, and Cookie Policy.
                        </div>
                        <button className="homepage-login-button" type="submit" >
                            Agree & SignUp
                        </button>
                        <hr className='homepage-hr' />
                        <div className="homepage-login-switch">
                            Already on LiveJob? <span onClick={switchlogin}>Login.</span>
                        </div>
                    </form>)}
                    {l && (<form className="homepage-login-box-inner-1" onSubmit={loginsubmit}>
                        <div className="homepage-login-input-set">
                            <label htmlFor="">Username</label>
                            <input type="text" ref={loginUsername} />
                        </div>
                        <div className="homepage-login-input-set">
                            <label htmlFor="">Password</label>
                            <input type="password" id='password' onMouseOver={passwordshow} onMouseOut={passwordhide} ref={loginPassword} />
                        </div>
                        <button className="homepage-login-button" type="submit">
                            Login
                        </button>
                        <hr className='homepage-hr' />
                        <div className="homepage-login-switch">
                            New to LiveJob? <span onClick={switchlogin}>SignUp.</span>
                        </div>
                    </form>)}
                </div>)}
            </div>
        </div>
    )
}
