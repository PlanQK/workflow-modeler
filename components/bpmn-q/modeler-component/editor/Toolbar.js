import React from 'react';

export default function Toolbar(props) {

    const {
        buttons
    } = props;

    const buttonList = buttons.map((button, index) => (
        <button key={index} style={{marginRight: '10px'}} onClick={button.onClick}>
            {button.label}
        </button>
    ));

    return (
        <div className="toolbar" style={{display: 'flex'}}>
            {buttonList}
        </div>
    );
}