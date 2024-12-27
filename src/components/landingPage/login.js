import React, { useState } from 'react';
import './login.css';
import Button from '@mui/material/Button';
import Particles from '../particlesJS/particles';
import CoolCodeVisualizer from '../coolComponent/cool';
import { auth } from '../FIrebase/firebase';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { app } from "../FIrebase/firebase";
import { useNavigate } from 'react-router-dom';

const LoginGFG = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState("https://tse4.mm.bing.net/th?id=OIP.D6P-BO32wCApcPIIjt6p5wHaHa&w=474&h=474&c=7");
    const [User, setUser] = useState(null);
    const [AuthError, setAuthError] = useState(null);

    const twitterFollowFunction = () => {
        const url = "https://x.com/AdityaS24161563";

        window.open(url, "_blank", "noopener, noreferrer");
    }

    const handleGoogleSignIn = async () => {
        try {
            setLoading("");
            setAuthError(null);
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            navigate('/upload');
        } catch (error) {
            setAuthError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>



            <section className='section'>
                <div className='logo'></div>
            </section>


            <div className='mainContainerDiv'>
                <div className='loginDiv'>

                    <div className='mainLoginDiv'>
                        {/* Google Button */}
                        <Button
                            onClick={handleGoogleSignIn}
                            className='btn1'
                            variant="contained"
                            style={{
                                backgroundColor: 'white',
                                color: 'black',
                                marginBottom: '20px',
                                width: '90%',
                                height: '10%',
                                border: '1px solid #ddd',
                                borderRadius: '0',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                marginTop: '15%'
                            }}
                            startIcon={
                                <img
                                    src={loading}
                                    alt="Google Icon"
                                    style={{ marginRight: '10px', width: '30px', height: '30px' }}
                                />
                            }
                        >
                            Continue with Google
                        </Button>

                        {/* Twitter Button */}

                        <Button
                            onClick={twitterFollowFunction}
                            variant="contained"
                            style={{
                                backgroundColor: 'black',
                                color: 'white',
                                width: '70%',
                                height: '10%',
                                textTransform: 'none',
                                borderRadius: '0',
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
                            Follow me on X
                        </Button>
                        <hr className='hr' />
                        <h1 className='h1'>#gfg160</h1>
                        <h1 className='h1'>#geekstreak2024</h1>
                        <h1 className='h1'>@geeksforgeeks</h1>
                        <p className='pricacy_policy'>Privacy Policy | All rights reserved 2024</p>
                    </div>
                </div>
                <div className='photoDiv'></div>
            </div>

            <CoolCodeVisualizer />
        </>
    );
}

export default LoginGFG;