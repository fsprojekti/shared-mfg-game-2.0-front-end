import React, {useContext} from 'react'
import { AppContext } from '../../context/context';

const Modal = () => {
    const context = useContext(AppContext);
    return (
        <div className={'modal-overlay'}>
            <div className="modal-container">
                <h2>{context.modalContent}</h2>
            </div>
        </div>
    )
};

export default Modal