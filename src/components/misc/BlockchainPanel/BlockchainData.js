import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import {InputGroup, Form, Button, Spinner, Dropdown, Container, Row, Col} from "react-bootstrap";
import PieChart from './PieChart';
import TransactionsTable from './TransactionTable';
import AllTransactionsTable from './TransactionTableAll';
import CancelTransactionModal from '../CancelTransaction';
import { Formik } from 'formik';
import * as yup from 'yup';



const BlockchainData = () => {
    const context = useContext(AppContext);
    
    const [chartDataArray, setChartDataArray] = useState([]);
    const [relativeStake, setRelativeStake] = useState(0);
    const [direction, setDirection] = useState("stake");
    // const [newStake, setNewStake] = useState("0");
    // const [txFee, setTxFee] = useState("0");
    const [loadingStake, setLoadingStake] = useState(false);
    const [loadingUnstake, setLoadingUnstake] = useState(false);
    const [stakeChain, setStakeChain] = useState(0)
    const [stakeIndex, setStakeIndex] = useState(0)

    const stakeSchema = yup.object({
        newStake: yup.number().required().positive("Not a valid value").integer().max(30000),
        txFee: yup.number("Only numbers").min(0, "Can't be negative").integer("Number must be an integer").max(3000, "Max is 3000")
    });

    const validateBalance = async (values) => {  
        let error = {};
        let balance = await context.usersBalances[stakeChain][`${context.chains["chains"][stakeChain].name}`]
        let pendingBalance = context.usersPendingBalances[stakeChain][`${context.chains["chains"][stakeChain].name}`];
        console.log("balance: " + balance);
        console.log("pendingBalance: " + pendingBalance);
        console.log("newStake: " + values.newStake);
        console.log("txFee: " + values.txFee);
        if (parseInt(values.txFee) + parseInt(values.newStake) > (parseInt(balance) + parseInt(pendingBalance))) {
            error.txFee = "Balance too low";
            error.newStake = "Balance too low";
        }
        return error;
      };

    const confirmStake = async (newStake, txFee) => {
        try {

            setLoadingStake(true);

            const data = {
                amount: newStake,
                fee: txFee,
                chainId: context.chains["chains"][stakeChain].id
            };

            let response = await context.apiUserStake(data);

            context.setNote((prevState) => {
                return({
                    ...prevState,
                    msg: response,
                    heading: 'Success',
                    show: true,
                    type: 'success'
                });
                });

            setLoadingStake(false);


        } catch(e) {
            setLoadingStake(false);
            context.setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Could not stake! "
            })
        }
    };


 
    const confirmUnstake = async (newStake, txFee) => {
        try {
            setLoadingUnstake(true);

            const data = {
                amount: newStake,
                fee: txFee,
                chainId: context.chains["chains"][stakeChain].id
            };

            let response = await context.apiUserUnstake(data);

            context.setNote((prevState) => {
                return({
                    ...prevState,
                    msg: response,
                    heading: 'Success',
                    show: true,
                    type: 'success'
                });
                });

            setLoadingUnstake(false);                    

        } catch(e) {
            setLoadingStake(false);
            context.setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Could not unstake! "
            })
        }
    };

    useEffect(() => {
        const renderStakeData = async () => {
            if(Object.keys(context.usersStakes).length == 0) return;
            let stakesKeys = [];
            for(let i = 0; i < Object.keys(context.usersStakes).length; i++) {
                stakesKeys[i] = Object.keys(context.usersStakes[i])[0];
            }
            let stakeIndex =  stakesKeys.indexOf(context.chains["chains"][stakeChain].name);
            setStakeIndex(stakeIndex);

            if (context.chains["chains"][stakeChain].stake == 0 ||  context.chains["chains"][stakeChain].stake == undefined) {
                setRelativeStake({stake: 0});
            } else {
                let stake = ((context.usersStakes[stakeIndex][`${context.chains["chains"][stakeChain].name}`] / context.chains["chains"][stakeChain].stake) * 100).toFixed(1)
                setRelativeStake({stake: stake});
            } 
        };
        renderStakeData();


        const ranking = context.ranking;
        const agents = context.agents;
        const users = context.users;
        const createDataArray = async () => { 
            
            let dataArray = ranking["ranking"].map((item, index) => {
                const agentObject = agents["agents"].filter(agent => agent._id === item.agent);
                const userObject = users["users"].filter(user => user.id === agentObject[0].user);
                if (userObject[0].name == context.user) userObject[0].name = "You";
                return {id: userObject[0].name, label: userObject[0].id, value: item.stake[stakeChain]}
            });
            setChartDataArray(dataArray);
        };
        createDataArray();

    }, [context.chains, stakeChain, stakeIndex, context.ranking["ranking"]]);


    return (
       <>
            <Row style={{ marginLeft: "0px", marginRight: "1rem"}}>
                <Col xs={12} md={6}>
                <div className="d-flex flex-column">
                    <TransactionsTable/>
                </div>
                </Col>
                <Col xs={12} md={6}>
                <div className="d-flex flex-column" style={{width: "100%", margin: "5px", justifyContent: "space-evenly", borderRadius: "8px", boxShadow: "var(--light-shadow)", paddingRight: "5px", zIndex: 1, height: "460px"}}>
                    
                        
                    <div className="d-flex-row d-inline-block">
                        <h3 className="d-inline-block"> Stake on 

                        <Dropdown className="d-flex-row d-inline-block" style={{margin: "10px"}}>
            
                        <Dropdown.Toggle  variant="outline-danger" style={{height: "40px", borderRadius: "8px"}} >
                            <b>{ context.chains["chains"].length < 1  ? "null" : context.chains["chains"][stakeChain].name  }  </b>
                        </Dropdown.Toggle>
                        
                        <Dropdown.Menu>

                        {
                            context.chains["chains"].map((item, index) => (
                                
                                <Dropdown.Item key={index} onClick={() =>  setStakeChain(index)} > {context.chains["chains"][index].name} </Dropdown.Item>

                            ))
                        }
                        </Dropdown.Menu>
                        
                        </Dropdown>
                        
                        
                        
                        Chain </h3>
                        
                        </div>

                    <h4>Your stake: {context.usersStakes[stakeIndex][`${context.chains["chains"][stakeChain].name}`]} ({relativeStake.stake}%)</h4>         

                    <div className="d-flex" style={{width: "100%", height: "100%", minWidth: "30%"}}>

                        <div style={{margin: "auto", width: "47vh", height: "40vh"}}>
                            <PieChart data={chartDataArray}/>
                        </div>
                        <div className="d-flex flex-column" style={{justifyContent: "center", alignItems: "center", zIndex: 1}}>
                        <Formik
                            validationSchema={stakeSchema}
                            initialValues={{
                                newStake: 0,
                                txFee: 0,
                            }}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                console.log("CONFIRM")
                                console.log("Direction:" + direction)
                                if(direction == "stake") {
                                    confirmStake(values.newStake, values.txFee);
                                } else if (direction == "unstake") {
                                    confirmUnstake(values.newStake, values.txFee);
                                }
                                // confirm(values.txFee);
                                resetForm();
                                setSubmitting(false);
                            }}     
                            validate={validateBalance}    
                            validateOnChange={false}
                            validateOnBlur={false}             
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
                            <Form id="stakeForm"  noValidate onSubmit={handleSubmit} style={{width: "60%", height: "100%", margin: "auto", justifyContent: "center", alignItems: "center"}}>
                                <Form.Group controlId="validationAmount" style={{paddingBottom: "15px", width: "8rem"}}>
                                    <Form.Label id="d-flex" style={{fontSize: "1.2rem", borderRadius: "8px 0 0 8px"}}>Amount</Form.Label>
                                    <Form.Control 
                                    onChange={handleChange}
                                    type="number"
                                    placeholder={0}
                                    name="newStake"
                                    value={values.newStake}
                                    isInvalid={!!errors.newStake}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.newStake}
                                </Form.Control.Feedback>
                                </Form.Group>
                                

                                <Form.Group controlId="validationTxFee"  style={{paddingBottom: "15px", width: "8rem"}}>
                                    <Form.Label id="d-flex" style={{fontSize: "1.2rem", borderRadius: "8px 0 0 8px"}}>Fee</Form.Label>
                                    <Form.Control 
                                    onChange={handleChange}
                                    type="number"
                                    placeholder={0}
                                    name="txFee"
                                    value={values.txFee}
                                    isInvalid={!!errors.txFee}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.txFee}
                                </Form.Control.Feedback>
                                </Form.Group>
           
                            <Button form='stakeForm' type='submit' onClick={() => setDirection("stake")} style={{padding: "0.3rem 2rem", margin: "5px", fontSize: "1.2rem", borderRadius: "8px", backgroundColor: "#34ad6a", borderColor: "#34ad6a"}}>
                            {loadingStake ? (
                                    <div>
                                        <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />

                                    <span> STAKE </span> 

                                    </div>
                                ) : (
                                    <span> STAKE </span>
                                )
                                
                                } 
                            </Button>
                            
                            <Button form='stakeForm' type='submit' onClick={() => setDirection("unstake")} variant='warning' style={{padding: "0.3rem 1.2rem", margin: "5px", fontSize: "1.2rem", borderRadius: "8px"}}>
                            {loadingUnstake ? (
                                    <div>
                                        <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />

                                        <span> UNSTAKE  </span>

                                    </div>
                                ) : (
                                    <span> UNSTAKE  </span>
                                )
                                
                            } 
                            
                            
                            </Button>
                            </Form>
                        )}
                        </Formik>
                        </div>
                        
                    </div>
                </div>
                </Col>
            </Row>
            <Row style={{marginTop: "5px", marginLeft: "2px", marginRight: "1rem"}}>
                <Col >   
                    <div style={{backgroundColor: "rgba(255, 255, 255, 0.8)", boxShadow: "var(--light-shadow)", borderRadius: "8px", textAlign: "center", height: "110px",width: "100%"}}>
                        <h3>Transactions History</h3>
                        <AllTransactionsTable/>
                    </div>
                </Col>
            </Row>
            <CancelTransactionModal/>
        </>
    )
};

export default BlockchainData