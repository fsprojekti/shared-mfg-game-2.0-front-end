import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../context/context';
import {InputGroup, FormControl, Form, Button, Spinner} from "react-bootstrap";
import {motion} from 'framer-motion'
import { Formik } from 'formik';
import * as yup from 'yup';

const TradeModal = () => {
    const { transactions, user, isTradeModalOpen, usersBalances, agent, servicesAll, usersPendingBalances, tradeModalContent, setIsTradeModalOpen, apiUserBidOrder, users, orders, chains, cookies, agents, note, setNote} = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);

    const bidOrderSchema = yup.object({
        txFee: yup.number("Only numbers").min(0, "Can't be negative").integer("Number must be an integer").max(3000, "Max is 3000")
    });

    const getColor = (service) => {
        switch(service) {
            case "MECHANICAL":
                return "#db6d28";
            case "ELECTRICAL": 
                return "#388bfd";
            case "PROGRAMMING": 
                return "#a371f7";
            default:
                return "rgb(0, 0, 0)";
        }
    };

    const validateBalance = async (values) => {  
        let error = {};
        let index = await chains["chains"].findIndex((c) => c.name === tradeModalContent.chainName);
        let chain = await chains["chains"][index];
        let balance = await usersBalances[index][`${chain.name}`];
        let pendingBalance = await usersPendingBalances[index][`${chain.name}`];
        console.log(balance, pendingBalance)
        let price = (tradeModalContent.price == undefined ? 0 : tradeModalContent.price);

        if (parseInt(values.txFee) + parseInt(price) > (parseInt(balance) + parseInt(pendingBalance))) {
            error.txFee = "Balance too low";
        }
        return error;
      };


    const confirm = async (txFee) => {
        try {
           
            let response = await apiUserBidOrder(txFee, tradeModalContent._id);
            console.log(response)
            setIsTradeModalOpen(false);
        } catch(err) {
            console.log(err)
            if (err.response.data.message === "Order not in state PLACED") {
                console.log("Order not in state PLACED")
                // setTxFee("0");
                setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: "Service was already purchased :(",
                      heading: 'Too slow',
                      show: true,
                      type: 'warning'
                    });
                  });
                  setIsTradeModalOpen(false)
            }
        }
    };

    useEffect(() => {
        
        const checkOrderStatus = async () => {
            // console.log(orders)
            const order = await orders.filter(order => order._id === tradeModalContent._id);
            console.log(order)
            if(order.length > 0) {
                if (order[0].state !== "PLACED" && isTradeModalOpen) {
                    setNote((prevState) => {
                        return({
                        ...prevState,
                        msg: "Service was already purchased :(",
                        heading: 'Too slow',
                        show: true,
                        type: 'warning'
                        });
                    });
                    setIsTradeModalOpen(false);
                } 
            }

        }

        checkOrderStatus();


        const renderTableData = async () => {
            const orderTransactions = await transactions.filter(transaction => transaction.to == tradeModalContent.agentAccount  && transaction.state == "SEND");
            const transactionsInOrder = await orderTransactions.sort((a, b) => b.fee - a.fee);

            const transactionsArray = await Promise.all(transactionsInOrder.map(async (item) => {
                let { from, fee, amount} = item;
                const consumerAgent = await agents["agents"].filter(agent => agent.account === from);
                
                const consumerUser = await users["users"].filter(user => user.id === consumerAgent[0].user);
                // console.log(consumerUser);
                
                return (
                    {
                        id: item._id,
                        consumer: consumerUser[0].name,
                        provider: tradeModalContent.providerName,
                        price: amount,
                        fee: fee,
                    }
                )
            }));
            // console.log(transactionsArray);
            setTableDataArray(transactionsArray);
        };
        renderTableData();
    }, [transactions, tradeModalContent, orders]);


    return (
        <div >
            {isTradeModalOpen ? (
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
                <h3>Bid for <span style={{color: "orange"}}> {`${tradeModalContent.providerName}'s`}</span>  service</h3>
                <div className='modal-confirm-container-data'>
                    <div className='modal-confirm-container-input'>
                        <ul>
                            <li> Type: <span style={{color: getColor(tradeModalContent.serviceType)}}> {tradeModalContent.serviceType} </span>  </li>
                            <li> Price: <span style={{color: 'green'}}> {tradeModalContent.price == undefined ? '0' : tradeModalContent.price} </span> </li>
                            <li> Chain: <span style={{color: (tradeModalContent.chainName == chains["chains"][0].name ? '#d2abd8' : '#73bcd4')}}> {tradeModalContent.chainName} </span> </li>
                            
                        </ul>
                        <div className={"trade-modal-input-group"}>
                            <div className="trade-modal-input-group-container">
                        <Formik
                            validationSchema={bidOrderSchema}
                            initialValues={{
                                txFee: 0,
                            }}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                console.log("CONFIRM")
                                confirm(values.txFee);
                                resetForm();
                                setSubmitting(false);
                            }}     

                            validate={validateBalance}                 
                        >
                        {}
                        {( {
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            isSubmitting,
                            values,
                            errors,
                        }) => (
                            <Form noValidate onSubmit={handleSubmit} id="submitBidForm" style={{ borderRadius: "8px 8px 8px 8px", paddingBottom: "15px"}} >
                                {/* <InputGroup style={{paddingBottom: "15px"}}> */}
                                <Form.Group controlId="validationFormikBidORder">
                                <Form.Label>Tx Fee</Form.Label>
                                {/* <Form.Control value ={txFee} placeholder={"0"} onChange={e => setTxFee(e.target.value)} style={{borderRadius: "8px 8px 8px 8px"}}/> */}
                                <Form.Control 
                                    onChange={handleChange}
                                    type="number"
                                    placeholder={0}
                                    name="txFee"
                                    value={values.txFee}
                                    isInvalid={!!errors.txFee}
                                    
                                    onBlur={handleBlur}
                                    
                                />
                                <Form.Control.Feedback style={{position: "absolute", top: 400, right: 8 }} type="invalid">
                                    {errors.txFee}
                                </Form.Control.Feedback>
                                {/* </InputGroup> */}
                                {/* <Button variant="btn btn-success active" style={{backgroundColor: "green", margin: "1rem"}} className='confirm-modal-btn' type="submit">Confirm</Button> */}
                                </Form.Group>
                            </Form>
                        )}
                        </Formik>
                            </div>
                        </div>
                        
                    </div>
                    
                    <div className="trade-modal-table-container">
                        <table className="modal-table-pending-transactions">
                            <thead>
                            <tr>
                                <th className="table-pending-transactions-head">No.</th>
                                <th className="table-pending-transactions-head">Pending transactions</th>
                                <th className="table-pending-transactions-head">Tx Fee</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                tableDataArray.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        data-tip data-for={item.id}
                                    >
                                        <td><strong>{index + 1}</strong></td>
                                        <td>
                                            {item.consumer} &#8646; {item.provider}
                                        </td>
                                        <td>{item.fee}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='d-flex'>
                    <Button form='submitBidForm' variant="btn btn-success active" style={{backgroundColor: "green", margin: "1rem"}} className='confirm-modal-btn' type="submit">Confirm</Button>
                    <Button form='submitBidForm' variant="btn btn-danger" style={{backgroundColor: "red", margin: "1rem"}} onClick={() => {
                        setIsTradeModalOpen(false)
                        setNote({...(note.show = false)});
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

export default TradeModal