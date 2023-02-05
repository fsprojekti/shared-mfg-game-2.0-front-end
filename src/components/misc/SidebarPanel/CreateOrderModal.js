import React, {useState, useContext} from 'react';
import { AppContext } from '../../../context/context';
import {InputGroup, FormControl, Button} from "react-bootstrap";
import Collapse from 'react-bootstrap/Collapse';

const CreateOrderModal = (props) => {
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
                                console.log(props)
                                if(props.mode == "SET") {
                                    console.log("SET")
                                    await context.apiUserCreateOrder(price, context.chains["chains"][context.activeChain].id);
                                } else { 
                                    console.log(context.orders)
                                    let userOrder;
                                    const placedOrders = context.orders.filter(order => order.chain === context.chains["chains"][context.activeChain].id  && order.state === "PLACED")
                                    const placedOrdersWithPlayerData = await placedOrders.map(function(ordr){ 
                                        let service=context.servicesAll.filter(srvc=> srvc._id == ordr.service);
                                        const providerAgentObject = context.agents.filter(agent => agent._id === service[0].agent);
                                        const providerClient = context.users["users"].filter(user => user.id === providerAgentObject[0].user);

                                        if (providerClient[0].id == context.user.id) {
                                            console.log("Im in")
                                            userOrder = ordr;
                                        }
                                        return ordr;
                                    })   
                                    
                                    console.log(userOrder)
                                    await context.apiUserUpdateOrder(price, userOrder._id);
                                }
                                props.reportHide();
                                setPrice("0");
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

        
        <div className="d-flex flex-column" >
                
                <Collapse in={props.show == true}>

                <div >       
                
                    <div>   
                        <h4 className="d-flex flex-column" style={{backgroundColor: "rgba(251, 191, 12)", textAlign: "center", marginBottom: "2px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}>  { context.chains["chains"].length < 1  ? "null" : context.chains["chains"][context.activeChain].name  }  </h4> 
                    </div>

                
                    <div style={{text: "blue", marginTop: "1%"}}>
                        <h4>{props.mode == "SET" ? "NEW PRICE" : "UPDATE PRICE"}</h4>
                    </div>

                  <div style={{marginLeft: "1rem", marginTop: "1erm", marginRight: "1rem"}}>
                  
                        <InputGroup style={{marginTop: "5%"}}>
                            <InputGroup.Text >NEW PRICE</InputGroup.Text>
                            <FormControl value ={price} placeholder={"Enter price"} onChange={e => setPrice(e.target.value)} onKeyPress={e => handleKeypress(e)}></FormControl>
                        </InputGroup>

                        
                  </div>
                    
                    <div >  
                        <Button class="btn btn-success active" style={{padding: "0.375rem 0.75rem", margin: "1rem"}} onClick={confirm}>Confirm</Button>

                        <Button class="btn btn-danger active" style={{padding: "0.375rem 0.75rem", margin: "1rem"}} onClick={() => {
                            props.reportHide();
                            context.setNote({...(context.note.show = false)});
                            setPrice(0);
                            document.getElementById("priceInput").value= "";
                        }}>
                            Cancel
                        </Button>

                        
                    </div>
                    

                    
                
                </div>
                </Collapse>
            
        </div>
    )
};

export default CreateOrderModal;