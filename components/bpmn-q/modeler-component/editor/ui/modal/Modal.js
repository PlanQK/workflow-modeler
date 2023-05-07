/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */
import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import FocusTrap from './FocusTrap';
import EscapeTrap from './EscapeTrap';
import KeyboardInteractionTrap from './KeyboardInteractionTrap';

/**
 * React component to display a modal.
 */
export default class Modal extends PureComponent {

    constructor(props) {
        super(props);

        this.modalRef = React.createRef();

        this.focusTrap = FocusTrap(() => {
            return this.modalRef.current;
        });

        this.escapeTrap = EscapeTrap(() => {
            this.close();
        });
    }

    close = () => {
        if (this.props.onClose) {
            return this.props.onClose();
        }
    };

    componentDidMount() {
        this.focusTrap.mount();
        this.escapeTrap.mount();
    }

    componentWillUnmount() {
        this.focusTrap.unmount();
        this.escapeTrap.unmount();
    }

    render() {

        const {
            className,
            children,
            onClose
        } = this.props;

        return ReactDOM.createPortal(
            <KeyboardInteractionTrap>
                <div className="modal" tabIndex="-1" role="dialog">
                    <div className={classNames('modal-dialog', className)} ref={this.modalRef} role="document">
                        <div className="modal-content">
                            {children}
                            {onClose && (<Close onClick={this.close}/>)}
                        </div>
                    </div>
                </div>
            </KeyboardInteractionTrap>,
            document.body
        );
    }
}

Modal.Body = Body;

Modal.Title = Title;

Modal.Close = Close;

Modal.Footer = Footer;


function Title(props) {
    const {
        children,
        className,
        ...rest
    } = props;

    return (
        <div className={classNames('modal-header', className)} {...rest}>
            <h2 className="modal-title">
                {children}
            </h2>
        </div>
    );
}

function Close(props) {
    const {
        onClick
    } = props;

    return (
        <button className="close" onClick={onClick} aria-label="Close">
            {/*<CloseIcon/>*/}
            {/*<img src={CloseIcon} aria-hidden="true" />*/}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                      d="M12.6666667,11.3333333 L20,11.3333333 L20,12.6666667 L12.6666667,12.6666667 L12.6666667,20 L11.3333333,20 L11.3333333,12.6666667 L4,12.6666667 L4,11.3333333 L11.3333333,11.3333333 L11.3333333,4 L12.6666667,4 L12.6666667,11.3333333 Z"
                      transform="rotate(45 13.414 8.586)"/>
            </svg>
        </button>
    );
}

function Body(props) {
    const {
        children,
        className,
        ...rest
    } = props;

    return (
        <div className={classNames('modal-body', className)} {...rest}>
            {children}
        </div>
    );
}

function Footer(props) {
    const {
        children,
        className,
        ...rest
    } = props;

    return (
        <div className={classNames('modal-footer', className)} {...rest}>
            {props.children}
        </div>
    );
}
