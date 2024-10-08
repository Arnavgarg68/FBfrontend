import React, { useEffect, useRef, useState } from 'react'
import './componentsCss/landing.css'
import searchicon from './materials/icons8-search.png'
import Logo from './materials/live-job-high-resolution-logo.png'
import profile from './materials/icons8-employee.png'
import dummy from './materials/dummy.png'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Comment } from 'react-loader-spinner';
import reloadicon from './materials/reload.png'
const Landing = () => {
    // states and variables to store friends and their value
    const [Suggested, setSuggested] = useState([]);
    const [Friends, setFriends] = useState([]);
    const [Pending, setPending] = useState([]);
    const [usernameprofile,setusernameprofile] = useState("");
    // const [Requested, setRequested] = useState([]);
    const [search, setsearch] = useState();
    const searchval = useRef(null);
    const [isLoading,setisLoading] = useState(false);
    const navigate = useNavigate();
    
    
    //function handle onclick add friend
    const addfriend = async (friendname) => {
        setisLoading(true);
        try {
            const response = await fetch('https://fbbackend-b4v6.onrender.com/addfriend', {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "token": localStorage.getItem('token')
                },
                body: JSON.stringify({ friendname: friendname })
            })
            if (!response) {
                setisLoading(false);
                toast.error("failed");
                return;
            }
            const data = await response.json();
            if(data.type==='token'){
                setisLoading(false);
                navigate('/');
                return;
            }
            if (data.errormsg) {
                setisLoading(false);
                toast.error(data.errormsg);
                return;
            }
            if(search){
                setsearch();
            }
            load();
            toast.success("request sent successfully");
        } catch (error) {
            setisLoading(false);
            toast.error(error);
        }
    }


    //function handle accept/reject requests
    const decision = async (obj) => {
        setisLoading(true);
        if (!obj?.friendname) {
            setisLoading(false);
            toast.error("error login again");
            return;
        }
        try {
            const response = await fetch('https://fbbackend-b4v6.onrender.com/decision', {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "token": localStorage.getItem('token')
                },
                body: JSON.stringify(obj)
            })
            if (!response) {
                setisLoading(false);
                toast.error("error connecting to server");
                return;
            }
            const data = await response.json();
            if(data.type==='token'){
                setisLoading(false);
                navigate('/');
                return;
            }
            if(data.errormsg){
                setisLoading(false);
                toast.error(data.errormsg);
                return;
            }
            toast.success("decision stored");
            load();
            return;
        } catch (error) {
            setisLoading(false);
            toast.error(error);
        }
    }


    //function to handle search people
    const searchfun = async (e) => {
        e.preventDefault();
        setisLoading(true);
        if (!searchval.current.value.trim(' ')) {
            setisLoading(false);
            toast.warning("enter valid username");
            return;
        }
        try {
            const response = await fetch('https://fbbackend-b4v6.onrender.com/search', {
                method: "POST",
                headers: {
                    "content-type": 'application/json',
                    "token": localStorage.getItem('token')
                },
                body: JSON.stringify({
                    search: searchval.current.value.trim(' ').toLowerCase()
                })
            })
            if (!response) {
                setisLoading(false);
                toast.error("error in fetching user");
                return;
            }
            const data = await response.json();
            if(data.type==='token'){
                setisLoading(false);
                navigate('/');
                return;
            }
            if (data.errormsg) {
                setisLoading(false);
                toast.error(data.errormsg);
                return;
            }
            setsearch(data);
            setisLoading(false);
            searchval.current.value="";
        } catch (error) {
            setisLoading(false);
            toast.error(error);
        }

    }

    // function to handle unfriend click
    const handleunfriend = async(friendname)=>{
        setisLoading(true);
        if(!friendname){
            setisLoading(false);
            toast.error("Invalid argument");
            return;
        }
        try {
            const response = await fetch('https://fbbackend-b4v6.onrender.com/unfriend',{
                method:"POST",
                headers:{
                    "content-type":"application/json",
                    "token":localStorage.getItem('token')
                },
                body:JSON.stringify({friendname:friendname})
            });
            if(!response){
                setisLoading(false);
                toast.error("Something is wrong")
                return;
            }
            const data = await response.json();
            if(data.type==='token'){
                setisLoading(false);
                navigate('/');
                return;
            }
            if(data.errormsg){
                setisLoading(false);
                toast.error(data.errormsg);
                return;
            }
            load();
            toast.success("unfriend successfull")
        } catch (error) {
            setisLoading(false);
            toast.error(error);            
        }
    }

    // function to load all friends list
    const load = async () => {
        setisLoading(true);
        try {
            const response = await fetch('https://fbbackend-b4v6.onrender.com/list', {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "token": localStorage.getItem('token')
                }
            })
            if (!response) {
                toast.error("login again");
                setisLoading(false);
                return;
            }
            const data = await response.json();
            if(data.type==='token'){
                setisLoading(false);
                navigate('/');
                return;
            }
            if (data?.errormsg) {
                // navigate('/home');
                setisLoading(false);
                toast.error(data.error);
                return;
            }
            setusernameprofile(data.username);
            const fof = data.friendsOfFriends.filter(us=>us.username!=data.username)
            setPending(() => data.friendsPending);
            // setRequested(() => data.friendsRequested);
            setSuggested(() => fof);
            setFriends(() => data.friendsAccepted);
             if(search){
                setsearch();
            }
            setisLoading(false);
        } catch (error) {
            setisLoading(false);
            console.log(error);
            toast.error(error); 
        }
    }
    useEffect(() => {
        load();
    }, [])
    return (
        <div className='landing-main'>
            {
                isLoading ? (<div className="loader-div">
                    <div className="loader-set">
                        <div className="loader">
                            <Comment width="100" height="100" />
                        </div>
                        <div className="loader-caption">
                            Please wait loading.....
                        </div>
                    </div>
                </div>) : (<></>)
            }
            <ToastContainer />
            <div className="landing-inner">
                <div className='landing-nav'>
                    <div className="landing-logo">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="reload-btn" title='click to refresh content' onClick={load}>
                        <span>Refresh</span>
                        <img src={reloadicon} alt="" />
                    </div>
                    <div className="profile-set">
                        <span>{usernameprofile}</span>
                    <div className="landing-profile">
                        <img src={profile} alt="" />
                    </div>
                    </div>
                    
                </div>
                <div className="landing-container">
                    <div className="landing-search">
                        <form className="landing-search-form" onSubmit={searchfun}>
                            <input type="text" placeholder='search people' ref={searchval} />
                            <button type='submit'>
                                <img src={searchicon} alt="search" />
                            </button>
                        </form>
                        {
                            search ? (
                                <div className="search-result">
                                    <div className="search-user-img">
                                        <img src={dummy} alt="" />
                                    </div>
                                    <div className="search-details-box">
                                    Username: {search.username.toUpperCase()}
                                    {search.val == 0 ? (<button disabled>Pending..</button>) : (<></>)}
                                    {search.val == 1 ? (<><button onClick={()=>{decision({friendname:search.username,value:true})}}>Accept</button><button onClick={()=>{decision({friendname:search.username,value:false})}}>Reject</button></>) : (<></>)}
                                    {search.val == 2 ? (<button onClick={()=>{handleunfriend(search.username)}}>Unfriend</button>) : (<></>)}
                                    {search.val == -1 ? (<button onClick={() => addfriend(search.username)}>Add friend</button>) : (<></>)}
                                    </div>
                                </div>) : (<></>)
                        }
                    </div>
                    <div className="landing-friends-box">
                        <div className="landing-friends-container">
                            <div className="landing-friends-head">Suggested Friends</div>
                            <div className="friends-list-box">
                                {Suggested.length > 0 ? Suggested.map((e, idx) => (<div className="friend-card" key={idx}>
                                    <div className="friend-img">
                                        <img src={dummy} alt="profile pic" />
                                    </div>
                                    <div className="friend-details">
                                        <span>Name:{e.username}</span>
                                        <span>Username: {e.username}</span>
                                        <span>State: {e.details.state}</span>
                                        <div className="buttons-set">
                                            <button onClick={()=>{addfriend(e.username)}}>Add friend</button>
                                        </div>


                                    </div>
                                </div>)) : (<>You currently have no suggestions</>)}

                            </div>
                        </div>
                        <div className="landing-friends-container">
                            <div className="landing-friends-head">Friends</div>
                            <div className="friends-list-box">
                                {Friends.length > 0 ? Friends.map((e, idx) => (
                                    <div className="friend-card" key={idx}>
                                        <div className="friend-img">
                                            <img src={dummy} alt="profile pic" />
                                        </div>
                                        <div className="friend-details">
                                            <span>Name:{e.username}</span>
                                            <span>Username: {e.username}</span>
                                            <span>State: {e.details.state}</span>
                                            <div className="buttons-set">
                                                <button onClick={()=>{handleunfriend(e.username)}}>Unfriend</button>
                                            </div>


                                        </div>
                                    </div>
                                )) : (<>You currently have no friends</>)}

                            </div>
                        </div>
                        <div className="landing-friends-container">
                            <div className="landing-friends-head">Pending requests</div>
                            <div className="friends-list-box">
                                {Pending.length > 0 ? Pending.map((e, idx) => (
                                    <div className="friend-card">
                                        <div className="friend-img">
                                            <img src={dummy} alt="profile pic" />
                                        </div>
                                        <div className="friend-details">
                                            <span>Name:{e.username}</span>
                                            <span>Username: {e.username}</span>
                                            <span>State: {e.details.state}</span>
                                            <div className="buttons-set">
                                                <button onClick={() => decision({ friendname: e.username, value: true })}>Accept</button>
                                                <button onClick={() => decision({ friendname: e.username, value: false })}>Reject</button>
                                            </div>


                                        </div>
                                    </div>
                                )) : (<>No pending requests</>)}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Landing
