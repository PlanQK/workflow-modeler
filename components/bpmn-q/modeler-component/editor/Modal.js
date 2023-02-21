import React, { useState } from 'react';
import ReactDOM from 'react-dom';

export default function Modal() {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleModal = () => {
        setShowModal(!showModal);
    };

    const setTitleContent = (newTitle, newContent) => {
        setTitle(newTitle);
        setContent(newContent);
    };

    const modalDialog = (
        <div className={`modal ${showModal ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={handleModal} />
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{title}</p>
                    <button className="delete" aria-label="close" onClick={handleModal} />
                </header>
                <section className="modal-card-body">
                    <div className="content">{content}</div>
                </section>
            </div>
        </div>
    );

    return (
        <>
            <button onClick={handleModal}>Show Modal</button>
            {showModal &&
            ReactDOM.createPortal(modalDialog, document.body)}
        </>
    );
};