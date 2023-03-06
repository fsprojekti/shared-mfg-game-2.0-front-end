import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../context/context';
import { Button} from "react-bootstrap";
import {motion} from 'framer-motion'

const CancelTransactionModal = () => {
    const {  apiUserCancelTransaction, orders, setNote, cancelTransactionModalContent, setCancelTransactionModalContent} = useContext(AppContext);

    const context = useContext(AppContext);

    const countDecimals = (value) => {
        if(Math.floor(value).toString() === value) return 0;
        return value.toString().split(".")[1].length || 0;
    };

    const confirm = async () => {
        try {

            let response = await apiUserCancelTransaction(cancelTransactionModalContent.data.id);

            setNote((prevState) => {
                return({
                  ...prevState,
                  msg: response.message,
                  heading: 'Success',
                  show: true,
                  type: 'success'
                });
              });
            setCancelTransactionModalContent({open: false})
        } catch(err) {
            console.log(err)
                setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: err.response.data.message,
                      heading: 'Error',
                      show: true,
                      type: 'danger'
                    });
                  });
        }
    };

    const handleKeypress = async e => {
        try {
            if (e.key === 'Enter') {
                confirm();
            }
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {

        // console.log(cancelTransactionModalContent)
    }, [orders])


    return (
        <div >
            {cancelTransactionModalContent.open == true ? (

                

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
                        <h3> You are about to cancel a transaction</h3>
                            

                        <div className='modal-confirm-container-input'>

                            <ul key={cancelTransactionModalContent.data.id}>
                                <li> From: {cancelTransactionModalContent.data.consumer}  </li>
                                {/* <li> Provider: <span style={{color: 'blue'}}> {tradeModalContent.playerName} </span> </li>     */}
                                <li> To: <span style={{color: 'blue'}}> {cancelTransactionModalContent.data.provider} </span>    </li>
                                <li> Type: <span style={{color: 'blue'}}> {cancelTransactionModalContent.data.type} </span>    </li>
                                <li> Fee: <span style={{color: 'green'}}> {cancelTransactionModalContent.data.fee} </span>    </li>
                                <li> Amount: <span style={{color: 'green'}}> {cancelTransactionModalContent.data.price} </span>    </li>
                                <li> Chain: <span style={{color: 'blue'}}> {cancelTransactionModalContent.data.chain} </span> </li>
                            
                            </ul>    
                            
                            <h3> Continue? </h3>
                            
                                
                                <Button variant="btn btn-success active" style={{backgroundColor: "green", margin: "1rem"}} className='confirm-modal-btn' onClick={confirm}>Confirm</Button>
                                <Button variant="btn btn-danger" style={{backgroundColor: "red", margin: "1rem"}} onClick={() => {
                                    setCancelTransactionModalContent({open: false})
                                    // setNote({...(note.show = false)});
                                }}>
                                Cancel
                                </Button>
                                

                                
                        
                        </div>
                    
                    </div>
                </motion.div>
            </div>

            ): (
                <div></div>
            )}
        </div>
        
    )
};

export default CancelTransactionModal