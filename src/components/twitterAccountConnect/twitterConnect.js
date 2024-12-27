import React, { useState, useEffect } from 'react';
import { getAuth, OAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import "./twitterConnect.css";

const TwitterConnectionButton = () => {
    const [connectionStatus, setConnectionStatus] = useState({
        isConnected: false,
        username: null,
        profileImage: null
    });

    // Check existing Twitter connection on component mount
    useEffect(() => {
        const checkTwitterConnection = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) return;

                // Call Firebase Function to check Twitter connection
                const response = await axios.get(`/twitter-connection/${user.uid}`);

                if (response.data.connected) {
                    setConnectionStatus({
                        isConnected: true,
                        username: response.data.username,
                        profileImage: response.data.profileImage
                    });
                }
            } catch (error) {
                console.error('Error checking Twitter connection', error);
            }
        };

        checkTwitterConnection();
    }, []);

    const connectTwitter = async () => {
        try {
            // Redirect to Firebase Function for Twitter OAuth
            window.location.href = 'http://localhost:5000/post-gfg-160/us-central1/callback'; // This matches your Firebase Function endpoint
        } catch (error) {
            console.error('Twitter connection error', error);
            alert('Failed to initiate Twitter connection. Please try again.');
        }
    };

    const disconnectTwitter = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            // Call backend to remove Twitter connection
            const response = await axios.post('/disconnect-twitter', {
                userId: user.uid
            });

            if (response.data.success) {
                setConnectionStatus({
                    isConnected: false,
                    username: null,
                    profileImage: null
                });

                alert('Twitter account disconnected successfully.');
            }
        } catch (error) {
            console.error('Twitter disconnection error', error);
            alert('Failed to disconnect Twitter account.');
        }
    };

    // Render different UI based on connection status
    return (
        <div className="twitter-connection-container">
            {!connectionStatus.isConnected ? (
                <button
                    onClick={connectTwitter}
                    className="connect-twitter-btn"
                >
                    <span>🐦</span> Connect Twitter Account
                </button>
            ) : (
                <div className="twitter-connected-info">
                    <img
                        src={connectionStatus.profileImage}
                        alt="Twitter Profile"
                        className="twitter-profile-image"
                    />
                    <div className="twitter-connection-details">
                        <p>Connected as @{connectionStatus.username}</p>
                        <div className="twitter-action-buttons">
                            <button
                                onClick={disconnectTwitter}
                                className="disconnect-twitter-btn"
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TwitterConnectionButton;