import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Fill = () => {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleFill = () => {
        const modeler = window.modeler;
        const modeling = modeler.get('modeling');

        modeling.editLabel(modeling.getSelectedShapes()[0], value);
        handleModal();
    };

    const fillDialog = (
        <div className="modal is-active">
            <div className="modal-background" onClick={handleModal} />
            <div className="modal-content">
                <div className="box">
                    <p>Enter new value:</p>
                    <input type="text" value={value} onChange={handleChange} />
                    <button className="button" onClick={handleFill}>
                        Fill
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button onClick={handleModal}>Fill Label</button>
            {showModal && ReactDOM.createPortal(fillDialog, document.body)}
        </>
    );
};