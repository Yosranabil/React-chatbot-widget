import React from 'react';
import './ChatWidget.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

function FloatingButton({ onClick }) {
    return (
        <div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
            <div class="floating-container">
                <div class="floating-button">
                <FontAwesomeIcon icon={faComment} style={{color: "#ffffff",}} fontSize={30} onClick={onClick}/>
                </div>
            </div>
        </div>
    );
}

export default FloatingButton;
