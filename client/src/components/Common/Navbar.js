import React from "react";
import { useNavigate } from "react-router-dom";

import "./Navbar.css";



function Navbar() {

    const navigate = useNavigate();

    const handleExit = () => {
        navigate('/');
    };

    const handleTransaction = () => {
        navigate('/banking');
    };

    const handleMyProfile = () => {
        navigate('/myprofile');
    };
    const handleSocial = () => {
        navigate('/social');
    };

    return (
        <div className="Navbar">
            <div className="top-buttons">
                <div className="buttons-left">
                    <button className="button" onClick={handleSocial}>Friends</button>
                    <button className="button" onClick={handleTransaction}>Transactions</button>
                </div>
                <div className="buttons-right">
                    <button className="button" onClick={handleMyProfile}>My Profile</button>
                    <button className="button" onClick={handleExit}>Exit</button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;