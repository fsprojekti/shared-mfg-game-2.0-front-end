import React, {useEffect, useContext, useState} from 'react';
import { AppContext } from '../../context/context';
import {Button, Spinner} from "react-bootstrap";
import {motion} from 'framer-motion'

const CancelOrderModal = () => {
    const context = useContext(AppContext);

    const [loading, setLoading] = useState(false);

    const confirm = async () => {
        try {
            setLoading(true);
            console.log(context.cancelOrderModalContent);
            await context.apiUserCancelOrder(context.cancelOrderModalContent._id);
            setLoading(false);
            context.closeCancelOrderModal();
        } catch(err) {
            setLoading(false);
            console.log(err);
            context.setNote((prevState) => {
                return({
                  ...prevState,
                  msg: err,
                  heading: 'Wrong input',
                  show: true,
                  type: 'danger'
                });
              });
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
                            <h3>Cancel order bid? </h3>
                            <ul>
                                <li>Player: {context.cancelOrderModalContent.providerName}</li>
                                <li>typeOfService: {context.cancelOrderModalContent.serviceType}</li>
                                <li>price: {context.cancelOrderModalContent.price}</li>
                            </ul>
                             <b>Are you sure you want to continue?</b>
                            <div className="d-flex justify-content-center" style={{marginBottom: "10px"}}>
                                    <Button variant="success" onClick={confirm}  style={{margin: "5px"}} >
                                    
                                    {loading ? (
                                        <div>
                                            <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <text> Retracting </text>
                                        </div>
                                    ) : ( <text> Continue  </text>)
                                    
                                    }   
                                    </Button>

                                    <Button variant="danger"  onClick={context.closeCancelOrderModal} style={{margin: "5px"}}>
                                        <text> Cancel  </text>
                                    </Button>
                                </div>

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