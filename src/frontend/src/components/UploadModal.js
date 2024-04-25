import React, { useState } from 'react';
import '../styling/UploadModal.css'  // Make sure to create appropriate CSS
import TokenCreator from './createMedia';

const UploadModal = ({ isOpen, onClose }) => {
    const [imageURL, setImageURL] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [fileURL, setFileURL] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ imageURL, title, description, price, amount, fileURL });
        // Handle the submission, e.g., saving the data or uploading to a server
        onClose(); // Close modal after submit
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <TokenCreator isOpen={isOpen} onClose={onClose}/>
            </div>
        </div>
    );
};

export default UploadModal;
