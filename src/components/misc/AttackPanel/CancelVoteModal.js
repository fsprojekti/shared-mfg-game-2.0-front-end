import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import {motion} from 'framer-motion'
import { getBridgeName } from '../HelperFunctions/functions';
import {Button, Spinner} from "react-bootstrap";

const CancelVoteModal = () => {
    const context = useContext(AppContext);

    const [loading, setLoading] = useState(false);

    const confirmVoteOff = async () => {
        try {
            console.log("clicked");
            console.log(context.cancelVoteModalContent)
            setLoading(true);
            const res = await context.apiUserStealVoteOFF(context.cancelVoteModalContent._id);
            setLoading(false);
            context.setNote({
                show: true,
                type: "success",
                msg: res,
                heading: "Success! "
            })
            context.setCancelVoteModalOpen(false);
        } catch(e) {
            setLoading(false);
            console.log(e)
            context.setNote({
                show: true,
                type: "danger",
                msg: e.message,
                heading: "Could not retract! "
            })
        }
    };

    return (

        <div>
            {context.isCancelVoteModalOpen ? (
            <div>

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
                            <h3>Retract Steal Vote For </h3>
                            <ul sty>
                                <li>{getBridgeName(context.cancelVoteModalContent.bridges[0], context.bridges)} </li>
                            </ul>
                             <b>Are you sure you want to continue?</b>
                            <div className="d-flex justify-content-center" style={{marginBottom: "10px"}}>
                                    <Button variant="success" onClick={confirmVoteOff}  style={{margin: "5px"}} >
                                    
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

                                    <Button variant="danger"  onClick={() =>  context.setIsCancelVoteModalOpen(false)} style={{margin: "5px"}}>
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
            {context.isCancelBlockModalOpen ? (
            <div>

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
                            <h3>Retract Block Vote For </h3>
                            <ul sty>
                                <li> Player name </li>
                            </ul>
                             <b>Are you sure you want to continue?</b>
                            <div className="d-flex justify-content-center" style={{marginBottom: "10px"}}>
                                    <Button variant="success" onClick={console.log("confirm")}  style={{margin: "5px"}} >
                                    
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

                                    <Button variant="danger"  onClick={() =>  context.setIsCancelVoteModalOpen(false)} style={{margin: "5px"}}>
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

export default CancelVoteModal;