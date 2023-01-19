import React, {useEffect, useContext} from 'react';
import { AppContext } from '../../context/context';
import { FaTimes } from 'react-icons/fa';
import {motion} from 'framer-motion'

const CancelOrderModal = () => {
    const context = useContext(AppContext);

    const confirm = async () => {
        try {
            console.log(context.cancelOrderModalContent.id);
            await context.apiUserCancelOrder(context.cancelOrderModalContent.id);
            context.closeCancelOrderModal();
        } catch(err) {
            console.log(err);
        }
    };

    const handleKeypress = (e) => {
        try {
            if (e.key === 'Enter') {
                confirm();
            }
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", e => handleKeypress(e));
        return () => {
            document.removeEventListener("keydown", e => handleKeypress(e));
        };
    }, [context.cancelOrderModalContent]);

    return (

        <div>
            {context.isCancelOrderModalOpen ? (





            <div>CANCEL ORDER MODAL

                <div className={`${'modal-confirm-overlay show-modal-confirm'}`} >
                <motion.div 
                className="box"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.2,
                        type: "spring",
                        bounce: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                >
                            <div className='modal-confirm-container'>
                                <h3>Are you sure you want to cancel offer:</h3>
                                <ul>
                                    <li>Player: {context.cancelOrderModalContent.playerName}</li>
                                    <li>typeOfService: {context.cancelOrderModalContent.typeOfService}</li>
                                    <li>price: {context.cancelOrderModalContent.price}</li>
                                </ul>
                                <button className='close-modal-btn' onClick={context.closeCancelOrderModal}>
                                    <FaTimes></FaTimes>
                                </button>
                                <button className='confirm-modal-btn' onClick={confirm}>Confirm</button>
                            </div>
                    </motion.div>
                </div>
            </div>
            ): (
                <div></div>
            )}
        </div>

    )
};

export default CancelOrderModal