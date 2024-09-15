import React, { useEffect, useRef, useState } from 'react'
import './componentsCss/landing.css'
import searchicon from './materials/icons8-search.png'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
const Landing = () => {
    const [Suggested, setSuggested] = useState([]);
    const [Friends, setFriends] = useState([]);
    const [Pending, setPending] = useState([]);
    const [Requested, setRequested] = useState([]);
    const [search, setsearch] = useState();
    const searchval = useRef(null);
    const navigate = useNavigate();
    // add person friend
    const addfriend = async (friendname) => {
        try {
            const response = await fetch('http://localhost:3500/addfriend', {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "token": localStorage.getItem('token')
                },
                body: JSON.stringify({ friendname: friendname })
            })
            if (!response) {
                toast.error("failed");
                return;
            }
            const data = await response.json();
            if (data.errormsg) {
                toast.error(data.errormsg);
                return;
            }
            setsearch((e) => ({ ...e, val: 0 }));
            load();
            toast.success("request sent successfully");
        } catch (error) {
            toast.error(error);
        }
    }
    // accept/reject requests
    const decision = async (obj) => {
        if (!obj?.friendname) {
            toast.error("error login again");
            return;
        }
        try {
            const response = await fetch('http://localhost:3500/decision', {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "token": localStorage.getItem('token')
                },
                body: JSON.stringify(obj)
            })
            if (!response) {
                toast.error("error connecting to server");
                return;
            }
            if (response.ok) {
                toast.success("decision stored");
                load();
                return;
            }
            toast.error("something wrong");
        } catch (error) {
            toast.error(error);
        }
    }
    // search people
    const searchfun = async (e) => {
        e.preventDefault();
        if (!searchval.current.value.trim(' ')) {
            toast.warning("enter valid username");
            return;
        }
        try {
            const response = await fetch('http://localhost:3500/search', {
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
                toast.error("error in fetching user");
                return;
            }
            const data = await response.json();
            console.log(data);
            if (data.errormsg) {
                toast.error(data.errormsg);
                return;
            }
            setsearch(data);
        } catch (error) {
            toast.error(error);
        }

    }
    const load = async () => {
        try {
            const response = await fetch('http://localhost:3500/list', {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "token": localStorage.getItem('token')
                }
            })
            if (!response) {
                toast.error("login again");
                return;
            }
            const data = await response.json();
            if (data?.errormsg) {
                // navigate('/home');
                toast.error(data.error);
                return;
            }
            console.log(data);
            const fof = data.friendsOfFriends.filter(us=>us.username!=data.username)
            setPending(() => data.friendsPending);
            setRequested(() => data.friendsRequested);
            setSuggested(() => fof);
            setFriends(() => data.friendsAccepted);
            console.log("loader")
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {

        load();
    }, [])
    return (
        <div className='landing-main'>
            <ToastContainer />
            <div className="landing-inner">
                <div className='landing-nav'>
                    <div className="landing-logo">Logo</div>
                    <div className="landing-profile">profilepic</div>
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
                                    {search.username}
                                    {search.val == 0 ? (<button disabled>Requested</button>) : (<></>)}
                                    {search.val == 1 ? (<button onClick={load}>Accept</button>) : (<></>)}
                                    {search.val == 2 ? (<button disabled>Friend</button>) : (<></>)}
                                    {search.val == -1 ? (<button onClick={() => addfriend(search.username)}>Add friend</button>) : (<></>)}
                                </div>) : (<></>)
                        }
                    </div>
                    <div className="landing-friends-box">
                        <div className="landing-friends-container">
                            <div className="landing-friends-head">Suggested Friends</div>
                            <div className="friends-list-box">
                                {Suggested.length > 0 ? Suggested.map((e, idx) => (<div className="friend-card" key={idx}>
                                    <div className="friend-img">
                                        <img src={searchicon} alt="profile pic" />
                                    </div>
                                    <div className="friend-details">
                                        <span>Name:{e.username}</span>
                                        <span>Username: {e.username}</span>
                                        <span>State: Uttarpradesh</span>
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
                                            <img src={searchicon} alt="profile pic" />
                                        </div>
                                        <div className="friend-details">
                                            <span>Name:{e.username}</span>
                                            <span>Username: {e.username}</span>
                                            <span>State: {e.username}</span>
                                            <div className="buttons-set">
                                                <button>Unfriend</button>
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
                                            <img src={searchicon} alt="profile pic" />
                                        </div>
                                        <div className="friend-details">
                                            <span>Name:{e.username}</span>
                                            <span>Username: {e.username}</span>
                                            <span>State: Uttarpradesh</span>
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
