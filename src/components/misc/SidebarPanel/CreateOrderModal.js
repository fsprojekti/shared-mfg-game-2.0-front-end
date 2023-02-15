import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import {InputGroup, FormControl, Button, Spinner, Dropdown} from "react-bootstrap";
import {motion} from 'framer-motion'

const CreateOrderModal = () => {
    const { transactions, user, isTradeModalUserOpen, usersBalances, agent, isCreateOrderModalOpen, setIsCreateOrderModalOpen, apiUserBidOrder, users, service, chains, cookies, agents, note, setNote} = useContext(AppContext);
    const [txFee, setTxFee] = useState("0");
    const [tableDataArray, setTableDataArray] = useState([]);
    const [provider, setProvider] = useState('');
    const [chain, setChain]  = useState(0);

    const context = useContext(AppContext);
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

                                console.log("ORDER")

                                if(isCreateOrderModalOpen.mode == "set") {
                                    console.log("SET")
                                    await context.apiUserCreateOrder(price, context.chains["chains"][chain].id);
                                } else { 
                                    console.log(context.orders)
                                    let userOrder;
                                    const placedOrders = context.orders.filter(order => order.chain === context.chains["chains"][chain].id  && order.state === "PLACED")
                                    const placedOrdersWithPlayerData = await placedOrders.map(function(ordr){ 
                                        let service=context.servicesAll.filter(srvc=> srvc._id == ordr.service);
                                        const providerAgentObject = context.agents.filter(agent => agent._id === service[0].agent);
                                        const providerClient = context.users["users"].filter(user => user.id === providerAgentObject[0].user);

                                        if (providerClient[0].id == context.user.id) {
                                            // console.log("Im in")
                                            userOrder = ordr;
                                        }
                                        return ordr;
                                    })   
                                    
                                    console.log(userOrder)
                                    await context.apiUserUpdateOrder(price, userOrder._id);
                                }
                                setPrice("0");
                                setIsCreateOrderModalOpen({open: false})

                            }
                        }
                    }
                }
            }
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
        <div style={{alignItems: "center", justifyContent: "center"}}>
            {isCreateOrderModalOpen.open == true ? (

                

            <div
            className={`${'modal-confirm-overlay show-modal-confirm'}`} >
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
            <div className="d-flex flex-column" >
                

                <div style={{padding: "1rem", justifyContent : "center", alignItemes: "center"}}>       
                
                    <div>   
                        <h4 > {isCreateOrderModalOpen.mode == "set" ? "Set" : "Update"} price for your Service </h4> 
                    </div>

                    {isCreateOrderModalOpen.mode == "set" ? (
                    <div style={{marginLeft: "1rem", marginTop: "1erm", marginRight: "1rem"}}>
                  
                        <InputGroup style={{marginTop: "5%"}}>
                        
                            <InputGroup.Text >CHAIN</InputGroup.Text>
                            <Dropdown >
                            <Dropdown.Toggle variant="outline-secondary"  >
                                <b >  { chains["chains"].length < 1  ? "null" : chains["chains"][chain].name  } </b>
                            </Dropdown.Toggle>
                
                            <Dropdown.Menu>

                            {
                                chains["chains"].map((item, index) => (
                                    
                                    <Dropdown.Item onClick={(item) => (setChain(index))} > {chains["chains"][index].name} </Dropdown.Item>

                                ))
                            }
                            </Dropdown.Menu>
                            
                            </Dropdown>
                        </InputGroup>
                    </div>
                    ):(null)
                    }

                        
                 

                  <div style={{marginLeft: "1rem", marginTop: "1erm", marginRight: "1rem"}}>
                  
                        <InputGroup style={{marginTop: "5%", width: "15rem"}}>
                            <InputGroup.Text >NEW PRICE</InputGroup.Text>
                            <FormControl value ={price} placeholder={"Enter price"} onChange={e => setPrice(e.target.value)} onKeyPress={e => handleKeypress(e)}></FormControl>
                        </InputGroup>

                        
                  </div>
                    
                  <div className='d-flex'>
                    <Button class="btn btn-success active" style={{backgroundColor: "green", margin: "1rem"}} className='confirm-modal-btn' onClick={confirm}>Confirm</Button>
                    <Button class="btn btn-danger" style={{backgroundColor: "red", margin: "1rem"}} onClick={() => {
                        setIsCreateOrderModalOpen({open: false})
                        setNote({...(note.show = false)});
                        setTxFee();
                    }}>
                    Cancel
                    </Button>
                    
                </div>
                    

                    
                
                </div>
            
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