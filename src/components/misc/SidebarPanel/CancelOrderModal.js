import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import { Button } from "react-bootstrap";
import {motion} from 'framer-motion'

const CancelOrderModal = () => {
    const context = useContext(AppContext);
    const [order, setOrder] = useState({});


    const confirm = async () => {
        try {

            let response = await context.apiUserCancelOrder(order._id);

            context.setNote((prevState) => {
                return({
                  ...prevState,
                  msg: response.message,
                  heading: 'Success',
                  show: true,
                  type: 'success'
                });
              });
            context.setIsCancelUserOrderModalOpen({open: false})
        } catch(err) {
            console.log(err)
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
    };

    useEffect(() => {
        const createDataArray = async () => { 
            const orders = await context.orders;
            const service = await context.service;
            const chains = await context.chains;
            const placedOrders = await orders.filter(order => order.state === "PLACED");
            const playersOrder = await placedOrders.reduce((ordr, current) => { 
                return ordr.service == service._id ? ordr : current;
            })   

            if(playersOrder.service == service._id) {
                console.log(playersOrder)
                let chain = await chains["chains"].filter(chain => chain.id == playersOrder.chain);
                playersOrder.chainName = chain[0].name;
                setOrder(playersOrder);
            } else {
                playersOrder.chainName = "Something went wrong";
                playersOrder.price = "Something went wrong";
                setOrder(playersOrder);
            }
        }
        createDataArray()
    }, [context.orders])


    return (
        <div >
            {context.isCancelUserOrderModalOpen.open == true ? (

                

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
                        <h3> You are about to cancel your service order</h3>
                            

                        <div className='modal-confirm-container-input'>

                            <ul>
                                <li> Type: {context.service.type}  </li>
                                {/* <li> Provider: <span style={{color: 'blue'}}> {tradeModalContent.playerName} </span> </li>     */}
                                <li> Price: <span style={{color: 'green'}}> {order.price} </span> </li>
                                <li> Chain: <span style={{color: 'blue'}}> {order.chainName} </span> </li>
                            
                            </ul>    
                            
                            <h3> Continue? </h3>
                            
                                
                                <Button class="btn btn-success active" style={{backgroundColor: "green", margin: "1rem"}} className='confirm-modal-btn' onClick={confirm}>Confirm</Button>
                                <Button class="btn btn-danger" style={{backgroundColor: "red", margin: "1rem"}} onClick={() => {
                                    context.setIsCancelUserOrderModalOpen({open: false})
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

export default CancelOrderModal