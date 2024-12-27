import React, { useState, useEffect } from 'react';
import './upload.css';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Upload = () => {

    const navigate = useNavigate();
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [userProfilePhoto, setUserProilePhoto] = useState(null);
    const [showLogoutButton, setShowLogoutButton] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUserProilePhoto(currentUser.photoURL);
            } else {
                navigate('/login')
            }
        });
        return () => unsubscribe();
    }, [navigate, auth]);

    const handleAvatarClick = () => {
        setShowLogoutButton(!showLogoutButton);
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    const [file, setFile] = useState(null);
    const [dragActive, setdragActive] = useState(null);
    const [streakDay, setStreakDay] = useState("4");
    const [ProblemName, setProblemName] = useState("Problem Name");

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const fileUrl = URL.createObjectURL(selectedFile);
            setFile(fileUrl);
        }
    }

    const handleDay = (event) => {
        setStreakDay(event.target.value);
    }

    const handleProblemName = (event) => {
        setProblemName(event.target.value);
    }

    const PostToX = () => {
        const text = document.getElementsByClassName('uploadMainContentDivTextDivMainP')[0];
        console.log(text.textContent);
        window.open(`https://x.com/intent/tweet?text=${text.textContent}`, '_blank');
    }

    return (
        <>
            <section className='section'>
                <div className='userAvatar' style={{
                    backgroundImage: userProfilePhoto ? `url(${userProfilePhoto})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                }} onClick={handleAvatarClick}>
                    {showLogoutButton && (
                        <Button
                            onClick={handleLogout}
                            style={{
                                backgroundColor: 'red',
                                color: 'white',
                                position: 'absolute',
                                bottom: '-50px', // Adjust as needed
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '100px',
                                height: '40px',
                                textTransform: 'none'
                            }}
                        >
                            Logout
                        </Button>
                    )}
                </div>
                <div className='logo'></div>
            </section>

            <div className='mainContainerDivForUpload'>

                {file ? (
                    // Display uploaded image and remove the upload box
                    <div className='uploadDivParent'>

                        <div className='ContentDayDiv'><input type='text' placeholder='Day' className='ContentDayInput' onChange={handleDay}></input></div>
                        <div className='ContentProblemNameDiv'><input type='text' placeholder='Problem Name' className='ContentProblemNameInput' onChange={handleProblemName}></input></div>
                        <div className='uploadMainPostingDiv'>
                            <div className='uploadMainContentDiv'>
                                <div className='uploadMainContentDivAvatarDiv'><div className='userAvatarContent' style={{ backgroundImage: userProfilePhoto ? `url(${userProfilePhoto})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}></div></div>
                                <div className='uploadMainContentDivTextDiv'>
                                    <p className='uploadMainContentDivTextDivMainP' contentEditable="true">Day <span>{streakDay}</span> of GFG160, <span>{streakDay}</span>/160 Solved <span>{ProblemName}</span>.
                                        Time Complexity - O(n) "Only one Iteration"  Space Complexity - O(1)
                                        "No Dynamic DS Used like Vectors / arrays" #gfg160 #geekstreak2024
                                        @geeksforgeeks.</p>
                                </div>
                            </div>
                            <div className='imageDiv' style={{ backgroundImage: `url(${file})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', height: '50%', width: '60%', position: 'relative', left: '50%', top: '10%', transform: 'translate(-50%, -10%)' }}></div>
                        </div>
                        <Button
                            className="postOnXbutton"
                            variant="contained"
                            onClick={PostToX}
                            style={{
                                backgroundColor: 'black',
                                color: 'white',
                                width: '20%',
                                fontSize: '20px',
                                height: '8%',
                                textTransform: 'none',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                marginTop: '0%'
                            }}
                            startIcon={
                                <div className='img'
                                    alt="Twitter Icon"
                                    style={{ marginRight: '0px', width: '50px', height: '50px' }}
                                />
                            }
                        >
                            Post
                        </Button>
                    </div>
                ) : (
                    <div className='uploadDivParent'>
                        <div className='UploadDivInnner' >
                            <input onChange={handleFileChange} accept='image/*' style={{ opacity: '0', position: 'absolute', height: '100%', width: '100%', cursor: 'pointer' }} type='file' /> <span className='uploadIcon'></span><p className='UploadContentP'>Upload Your Screenshot</p>
                        </div>
                    </div>
                )}
            </div >

        </>
    );

}

export default Upload;