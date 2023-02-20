import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import {InputGroup, FormControl, Button, Spinner, Dropdown} from "react-bootstrap";
import {motion} from 'framer-motion'

const CancelOrderModal = () => {
    const {  users, servicesAll, isCancelUserOrderModalOpen, setIsCancelUserOrderModalOpen, service, chains, apiUserCancelOrder, agents, note, setNote} = useContext(AppContext);
    const [order, setOrder] = useState({});

    const context = useContext(AppContext);
    const [price, setPrice] = useState("0");


    const countDecimals = (value) => {
        if(Math.floor(value).toString() === value) return 0;
        return value.toString().split(".")[1].length || 0;
    };

    const confirm = async () => {
        try {

            let response = await apiUserCancelOrder(order._id);
            console.log("cancel order")
            setNote((prevState) => {
                return({
                  ...prevState,
                  msg: response,
                  heading: 'Success',
                  show: true,
                  type: 'success'
                });
              });
            setIsCancelUserOrderModalOpen({open: false})
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
        const createDataArray = async () => { 
            const placedOrders = context.orders.filter(order => order.state === "PLACED");
            const placedOrdersWithPlayerData = await placedOrders.map(function(ordr){ 
                let service=servicesAll["services"].filter(srvc=> srvc._id == ordr.service);
                const providerAgentObject = agents["agents"].filter(agent => agent._id === service[0].agent);
                const providerClient = users["users"].filter(user => user.id === providerAgentObject[0].user);
                let chain = chains["chains"].filter(chain => chain.id === ordr.chain);
                ordr.chainName = chain[0].name;

                if (providerClient[0].id == context.user.id) {
                    console.log("Im in")
                    console.log(ordr)
                    setOrder(ordr)
                }
                return ordr;
            })   
        }
        createDataArray()
    }, [])


    return (
        <div >
            {isCancelUserOrderModalOpen.open == true ? (

                

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
                                <li> Type: {service.type}  </li>
                                {/* <li> Provider: <span style={{color: 'blue'}}> {tradeModalContent.playerName} </span> </li>     */}
                                <li> Price: <span style={{color: 'green'}}> {order.price} </span> </li>
                                <li> Chain: <span style={{color: 'blue'}}> {order.chainName} </span> </li>
                            
                            </ul>    
                            
                            <h3> Continue? </h3>
                            
                                
                                <Button class="btn btn-success active" style={{backgroundColor: "green", margin: "1rem"}} className='confirm-modal-btn' onClick={confirm}>Confirm</Button>
                                <Button class="btn btn-danger" style={{backgroundColor: "red", margin: "1rem"}} onClick={() => {
                                    setIsCancelUserOrderModalOpen({open: false})
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