import React, {useState, useEffect} from 'react';
import { FaTimes } from 'react-icons/fa';
import Axios from "axios/index";
import { useGlobalContext } from '../../../context/context';
import {InputGroup, FormControl, Button, Fade, Card} from "react-bootstrap";
import Collapse from 'react-bootstrap/Collapse';
import NoteDismissible from '../../notifications/NoteDismissible';

const CreateOrderModal = (props) => {
    const { apiUserCreateOrder, closeCreateOrderModal, user, chains, cookies, activeChain, setNote, note } = useGlobalContext();
    const [price, setPrice] = useState("0");
    const [showAlert, setShowAlert] = useState(false);
    const [alertContent, setAlertContent] = useState('');

    const countDecimals = (value) => {
        if(Math.floor(value).toString() === value) return 0;
        return value.toString().split(".")[1].length || 0;
    };

    const confirm = async () => {
        try {
            if (price === undefined || price === "" || price == 0) {
                setNote((prevState) => {
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
                    setNote((prevState) => {
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
                        setNote((prevState) => {
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
                            setNote((prevState) => {
                                return({
                                  ...prevState,
                                  msg: 'Maximum price in this game is 30000',
                                  heading: 'Wrong input',
                                  show: true,
                                  type: 'danger'
                                });
                              });
                        } else {
                            if (user.amountOfAvailableService === 0) {
                                setNote((prevState) => {
                                    return({
                                      ...prevState,
                                      msg: 'Amount of available services is too low',
                                      heading: 'Wrong input',
                                      show: true,
                                      type: 'danger'
                                    });
                                  });
                            } else {

                                await apiUserCreateOrder(price, chains[activeChain].id);
                                props.reportHide();
                                setPrice("0");
                            }
                        }
                    }
                }
            }
        } catch(err) {
            if (err.response !== undefined && err.response.data.message === "Trade already exists") {
                setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: 'Trade with this person already exists',
                      heading: 'Error',
                      show: true,
                      type: 'danger'
                    });
                  });
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

        
        <div className="d-flex flew-column" >
        {/* {props.show == true ? ( */}
                {/* <Fade in={props.show == true }> */}
                
                <Collapse in={props.show == true} dimension="height">

                <div >       
                
                    <div>   
                        <h4 className="d-flex flex-column" style={{backgroundColor: "rgba(251, 191, 12)", textAlign: "center", marginBottom: "2px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}>  { chains.length < 1  ? "null" : chains[cookies.activeChain].name  }  </h4> 
                    </div>

                
                    <div style={{text: "blue", marginTop: "1%"}}>
                        <h4>Set <span style={{color: 'red'}}> {user.typeOfService} </span> price</h4>
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
                            setNote({...(note.show = false)});
                            setPrice(0);
                            document.getElementById("priceInput").value= "";
                        }}>
                            Cancel
                        </Button>

                        
                    </div>
                    

                    
                
                </div>
                {/* </Fade> */}
                </Collapse>
                    
                {/* ) : (
                    <></>
                )} */}
            
        </div>
    )
};

export default CreateOrderModal;