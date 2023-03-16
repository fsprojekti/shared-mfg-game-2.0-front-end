import React, {useState, useEffect, useContext, useCallback} from 'react';
import { AppContext } from '../../../context/context';
import {InputGroup,Button, Spinner, Dropdown, Form} from "react-bootstrap";
import {motion} from 'framer-motion'
import { Formik } from 'formik';
import * as yup from 'yup';

const CreateOrderModal = () => {
    const context = useContext(AppContext);
    const [chain, setChain]  = useState(0);


    const orderSchema = yup.object({
        price: yup.number().required().min(0, "Can't be negative").integer("Has to be integer").max(30000)
    });

    const validateService = async () => {  
        let error = {};
        const service = await context.service;
        //Switch case for service states to check if the state is valid
        switch(service["service"].state) {
            case "IDLE":
                break;
            case "MARKET":
                break;
            case "ACTIVE":
                error.price = "Service is in active state";
                break;
            case "DEAL":
                error.price = "Service is in deal state";
                break;
            case "DONE":
                error.price = "Service is in done state";
                break;
            case "STOPPED":
                error.price = "Service is in stopped state";
                break;
            default:
                error.price = "Service is in unknown state";
                break;
        }
        return error;
      };

    const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
        context.setIsCreateOrderModalOpen({open: false})
    }
    }, []);

    const confirm = async (price) => {
        try {

            let response = {};

            if(context.isCreateOrderModalOpen.mode == "set") {
                await context.apiUserCreateOrder(price, context.chains["chains"][chain].id);
                response.message = `${context.service["service"].type} order created successfully`;
            } else { 
                const orders = await context.orders;
                const service = await context.service;
                const placedOrders = await orders.filter(order => order.state === "PLACED");
                if(placedOrders.length != 0) {
                    const playersOrder = await placedOrders.reduce((ordr, current) => { 
                        return ordr.service == service["service"]._id ? ordr : current;
                    })   
                    if(playersOrder.service == service["service"]._id) {
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

            context.setIsCreateOrderModalOpen({open: false})
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

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
    
        return () => {
          document.removeEventListener("keydown", escFunction, false);
        };
      }, [escFunction]);



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
            <h3 > {context.isCreateOrderModalOpen.mode == "set" ? "Set" : "Update"} {context.service["service"].type} order price </h3> 
                
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

                        

                        <Formik
                            validationSchema={orderSchema}
                            initialValues={{
                                price: 0,
                            }}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                confirm(values.price);
                                resetForm();
                                setSubmitting(false);
                            }}      
                            validate={validateService}      
                        >
                        {}
                        {( {
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            errors,
                        }) => (
                    <Form id='orderForm' noValidate onSubmit={handleSubmit}>
                    <InputGroup style={{width: "14.5rem"}} >
                        <InputGroup.Text >NEW PRICE</InputGroup.Text>
                        <Form.Control 
                                        onChange={handleChange}
                                        type="number"
                                        placeholder={0}
                                        name="price"
                                        value={values.price}
                                        isInvalid={!!errors.price}
                                        onBlur={handleBlur}
                                    />
                        <Form.Control.Feedback type="invalid" tooltip >
                                {errors.price}
                        </Form.Control.Feedback>
                    </InputGroup>
                    
                    
                    <Button variant="btn btn-success active" type='submit' style={{backgroundColor: "green", margin: "1rem"}}>Confirm</Button>
                    <Button variant="btn btn-danger" style={{backgroundColor: "red", margin: "1rem"}} onClick={() => {
                        context.setIsCreateOrderModalOpen({open: false})
                        context.setNote({...(context.note.show = false)});
                    }}>
                    Cancel
                    </Button>
                    </Form>
                        )}
                    </Formik>
            
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