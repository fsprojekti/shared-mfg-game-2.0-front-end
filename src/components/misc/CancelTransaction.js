import React, {useCallback, useEffect, useContext} from 'react';
import { AppContext } from '../../context/context';
import { Button} from "react-bootstrap";
import {motion} from 'framer-motion'

const CancelTransactionModal = () => {
    const context = useContext(AppContext);

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            context.setCancelTransactionModalContent({open: false})
        }
        }, []);

    const confirm = async () => {
        try {

            let response = await context.apiUserCancelTransaction(context.cancelTransactionModalContent.data.id);

            context.setNote((prevState) => {
                return({
                  ...prevState,
                  msg: response.message,
                  heading: 'Success',
                  show: true,
                  type: 'success'
                });
              });
              context.setCancelTransactionModalContent({open: false})
        } catch(err) {
            console.log(err)
            if (err.response.data.msg === "Transaction already processed") {
                console.log("Order not in state PLACED")
                context.setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: "Transaction has been mined",
                      heading: 'Too slow',
                      show: true,
                      type: 'warning'
                    });
                  });
                  context.setCancelTransactionModalContent({open: false})
            } else {
                context.setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: err.response.data.message,
                      heading: 'Error',
                      show: true,
                      type: 'danger'
                    });
                  });
            }
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
    
        return () => {
          document.removeEventListener("keydown", escFunction, false);
        };
      }, [escFunction]);

    useEffect(() => {
        const transactions = context.transactions;
        let transaction;
        if(context.cancelTransactionModalContent.open == true) {
            try {
                transaction = transactions.find(item => item.id === context.cancelTransactionModalContent.data.id);
            }catch(err) {
                console.log(err)
            }
            
            if (transaction != undefined && transaction.state == "MINED") {
                context.setCancelTransactionModalContent({open: false})
                context.setNote((prevState) => {
                    return({
                    ...prevState,
                    msg: "Transaction has been mined",
                    heading: 'Too slow',
                    show: true,
                    type: 'warning'
                    });
                });
            }
        }



    }, [context.transactions])


    return (
        <div >
            {context.cancelTransactionModalContent.open == true ? (

                

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

                            <ul key={context.cancelTransactionModalContent.data.id}>
                                <li> From: {context.cancelTransactionModalContent.data.consumer}  </li>
                                <li> To: <span style={{color: 'blue'}}> {context.cancelTransactionModalContent.data.provider} </span>    </li>
                                <li> Type: <span style={{color: 'blue'}}> {context.cancelTransactionModalContent.data.type} </span>    </li>
                                <li> Fee: <span style={{color: 'green'}}> {context.cancelTransactionModalContent.data.fee} </span>    </li>
                                <li> Amount: <span style={{color: 'green'}}> {context.cancelTransactionModalContent.data.price} </span>    </li>
                                <li> Chain: <span style={{color: 'blue'}}> {context.cancelTransactionModalContent.data.chain} </span> </li>
                            
                            </ul>    
                            
                            <h3> Continue? </h3>
                            
                                
                                <Button variant="btn btn-success active" style={{backgroundColor: "green", margin: "1rem"}} className='confirm-modal-btn' onClick={confirm}>Confirm</Button>
                                <Button variant="btn btn-danger" style={{backgroundColor: "red", margin: "1rem"}} onClick={() => {
                                    context.setCancelTransactionModalContent({open: false})
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