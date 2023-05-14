import React from 'react';

/**
 * React buttons which resize the properties panel.
 *
 * @returns {JSX.Element}
 */
export default function ResizeButtons() {

    function resize(num) {
        const propertiesContainer = document.getElementById("properties");
        const width = propertiesContainer.clientWidth;

        // newWidth cannot be bigger than the maximum width defined by the parent container
        let newWidth = width + num;
        if (newWidth <= 0) {
            propertiesContainer.style.display = 'none';
        } else {
            propertiesContainer.style.display = 'block';
        }
        propertiesContainer.style.width = newWidth + "px";
    }
    return (
        <>
            <button className="qwm-toolbar-btn" onClick={() => resize(150)}>
                <span className="fa fa-plus">
                    <span className="qwm-indent"/>
                </span>
            </button>
            <button className="qwm-toolbar-btn" onClick={() => resize(-10)}>
                <span className="fa fa-minus">
                    <span className="qwm-indent"/>
                </span>
            </button>
        </>
    );
}