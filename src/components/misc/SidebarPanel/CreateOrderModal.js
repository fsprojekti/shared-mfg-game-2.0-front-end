import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import {InputGroup, FormControl, Button, Spinner, Dropdown} from "react-bootstrap";
import {motion} from 'framer-motion'

const CreateOrderModal = () => {
    const context = useContext(AppContext);
    const [chain, setChain]  = useState(0);
    const [price, setPrice] = useState("0");


    const countDecimals = (value) => {
        if(Math.floor(value).toString() === value) return 0;
        return value.toString().split(".")[1].length || 0;
    };

    const confirm = async () => {
        try {
            if (price === undefined || price === "" || price == 0) {
                context.setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: 'You must enter a value',
                      heading: 'Wrong input',
                      show: true,
                      type: 'danger'
                    });
                  });
            } else {
                if (isNaN(price) || price < 0) {
                    context.setNote((prevState) => {
                        return({
                          ...prevState,
                          msg: 'You must enter positive numbers',
                          heading: 'Wrong input',
                          show: true,
                          type: 'danger'
                        });
                      });
                } else {
                    if (countDecimals(price) > 0) {
                        context.setNote((prevState) => {
                            return({
                              ...prevState,
                              msg: 'Input value must be an integer',
                              heading: 'Wrong input',
                              show: true,
                              type: 'danger'
                            });
                          });
                    } else {
                        if (parseInt(price) > 30000) {
                            context.setNote((prevState) => {
                                return({
                                  ...prevState,
                                  msg: 'Maximum price in this game is 30000',
                                  heading: 'Wrong input',
                                  show: true,
                                  type: 'danger'
                                });
                              });
                        } else {
                            if (context.user.amountOfAvailableService === 0) {
                                context.setNote((prevState) => {
                                    return({
                                      ...prevState,
                                      msg: 'Amount of available services is too low',
                                      heading: 'Wrong input',
                                      show: true,
                                      type: 'danger'
                                    });
                                  });
                            } else {

                                let response;

                                if(context.isCreateOrderModalOpen.mode == "set") {
                                    response = await context.apiUserCreateOrder(price, context.chains["chains"][chain].id);
                                    response.message = `${context.service.type} order created successfully`;
                                } else { 
                                    const orders = await context.orders;
                                    const service = await context.service;
                                    const chains = await context.chains;
                                    const placedOrders = await orders.filter(order => order.state === "PLACED");
                                    if(placedOrders.length != 0) {
                                        const playersOrder = await placedOrders.reduce((ordr, current) => { 
                                            return ordr.service == service._id ? ordr : current;
                                        })   
                                        if(playersOrder.service == service._id) {
                                            response = await context.apiUserUpdateOrder(price, playersOrder._id);
                                        }
                                    } else {
                                        return;
                                    }
                                }

                                context.setNote((prevState) => {
                                    return({
                                      ...prevState,
                                      msg: response.message,
                                      heading: 'Success',
                                      show: true,
                                      type: 'success'
                                    });
                                  });

                                setPrice("0");
                                context.setIsCreateOrderModalOpen({open: false})

                            }
                        }
                    }
                }
            }
        } catch(err) {
            console.log(err)
            try {
                context.setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: err.response.data.message,
                      heading: 'Error',
                      show: true,
                      type: 'danger'
                    });
                  });
                } catch(err) {
                    console.log("Could not set note with error message")
                }
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


    return (
        <div >
            {context.isCreateOrderModalOpen.open == true ? (

                

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
            <h3 > {context.isCreateOrderModalOpen.mode == "set" ? "Set" : "Update"} {context.service.type} order price </h3> 
                
                <div className='modal-confirm-container-input'> 
                

                        {context.isCreateOrderModalOpen.mode == "set" ? (
                        <div >
                    
                            <InputGroup style={{paddingBottom: "5px"}}>
                            
                                <InputGroup.Text >CHAIN</InputGroup.Text>
                                <Dropdown >
                                <Dropdown.Toggle variant="outline-secondary"  style={{width: "10rem"}}>
                                    <b >  { context.chains["chains"].length < 1  ? "null" : context.chains["chains"][chain].name  } </b>
                                </Dropdown.Toggle>
                    
                                <Dropdown.Menu>

                                {
                                    context.chains["chains"].map((item, index) => (
                                        
                                        <Dropdown.Item key={index} onClick={(item) => (setChain(index))} > {context.chains["chains"][index].name} </Dropdown.Item>

                                    ))
                                }
                                </Dropdown.Menu>
                                
                                </Dropdown>
                            </InputGroup>
                </div>
                ):(null)
                }

                        
                  
                    <InputGroup style={{width: "14.5rem"}} >
                        <InputGroup.Text >NEW PRICE</InputGroup.Text>
                        <FormControl value ={price} placeholder={"Enter price"} onChange={e => setPrice(e.target.value)} onKeyPress={e => handleKeypress(e)}></FormControl>
                    </InputGroup>
                    
                    <Button variant="btn btn-success active" style={{backgroundColor: "green", margin: "1rem"}} className='confirm-modal-btn' onClick={confirm}>Confirm</Button>
                    <Button variant="btn btn-danger" style={{backgroundColor: "red", margin: "1rem"}} onClick={() => {
                        context.setIsCreateOrderModalOpen({open: false})
                        context.setNote({...(context.note.show = false)});
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

export default CreateOrderModal