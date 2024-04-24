import React, { useState } from 'react';
import '../styling/UploadModal.css'  // Make sure to create appropriate CSS

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
                <h2>Add New Item</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={imageURL}
                        onChange={e => setImageURL(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Price"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="File URL"
                        value={fileURL}
                        onChange={e => setFileURL(e.target.value)}
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default UploadModal;
