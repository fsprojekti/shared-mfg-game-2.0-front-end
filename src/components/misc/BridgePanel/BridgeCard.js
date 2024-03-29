import React, {useState, useContext} from 'react';
import {Button, Card, Form, InputGroup, ToggleButton, ButtonGroup, Spinner, OverlayTrigger, Tooltip  } from "react-bootstrap";
import { AppContext } from '../../../context/context';
import { Formik } from 'formik';
import * as yup from 'yup';

//TODO: Transfer pri max value ne gre uredu skozi.
const BridgeCard = () => {
    const {chains, apiUserBridge, usersBalances, usersPendingBalances, bridges, setNote, transactions, agent} = useContext(AppContext);
    let [bridge, setBridge] = useState(0);

    const [loading, setLoading] = useState(false);

    const [direction, setDirection] = useState('1');

    const directions = [
        { name: 'Deposit', value: '1' },
        { name: 'Withdraw', value: '2' }
    ];

    const bridgeSchema = yup.object({
        amount: yup.number().required().min(1, "Has to be at least 1").integer(),
        fee: yup.number().integer().min(0, "Can't be negative"),
    });

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Fee is paid on main chain.
        </Tooltip>
      );



    const validateBalance = async (values) => {  
        let error = {};
        let index;
        if(direction == '2') {
            index = chains["chains"].findIndex(c => {
                return c.id == bridges[bridge].chainTarget;
            });
        } else if(direction == 1){
            index = chains["chains"].findIndex(c => {
                return c.id == bridges[bridge].chainSource;
            });
        }

        let balanceMain = await usersBalances[0][`${chains["chains"][0].name}`]
        let pendingBalanceMain = usersPendingBalances[0][`${chains["chains"][0].name}`];
        let balanceSide = await usersBalances[1][`${chains["chains"][1].name}`]
        let pendingBalanceSide = usersPendingBalances[1][`${chains["chains"][1].name}`];

        if ( direction == '1' && parseInt(values.amount) + parseInt(values.fee) > (parseInt(balanceMain) + parseInt(pendingBalanceMain))) {
            error.amount = "Low balance on " + chains["chains"][0].name + " chain";
        } else if (direction == '2') {
            if((parseInt(values.amount) > ( parseInt(balanceSide) + parseInt(pendingBalanceSide) ))) error.amount = "Low balance on " + chains["chains"][1].name + " chain";
            if(parseInt(values.fee) > ( parseInt(balanceMain) + parseInt(pendingBalanceMain) )) error.amount = "Low balance on " + chains["chains"][0].name + " chain";
        }
        return error;
      };

    const getChainsNamesFromBridgeObject = (index) => {
        let chainsArr = chains["chains"];
        let bridgeChains = chainsArr.filter(item => item.id === bridges[index].chainSource || item.id === bridges[index].chainTarget);
        let names = bridgeChains.map(item => item.name);
        return names;
    };

    //TODO: Popravi da bo alert prikazan s tisim oblačkom spodaj, ko ga lahko skenslaš z x-om
    const confirmTransfer = async (_amount, _fee) => {
        try {

            setLoading(true);
            // console.log(bridges[bridge])
            let response;
            if(direction == '2') response= await apiUserBridge(_amount, _fee, bridges[bridge].chainTarget, bridges[bridge].chainSource);
            else if(direction == '1') response = await apiUserBridge(_amount, _fee, bridges[bridge].chainSource, bridges[bridge].chainTarget);  

            setLoading(false);

            setNote((prevState) => {
                return({
                    ...prevState,
                    msg: response.message,
                    show: true,
                    type: 'success',
                    heading: "Success"
                });
                });

        } catch(e) {
            setLoading(false);
            console.log(e)
        }
    };


    return (
        <div className='d-flex' style={{width: "100%"}}>
            <Card style={{ borderRadius: "8px", boxShadow: "var(--light-shadow)", width: "100%", borderColor: "transparent", justifyContent: "center", alignItems: "center"}}>
                { chains["chains"].length > 1 ? (
                    <Card.Body>
                    <Card.Title> 
                    <h3> {bridges[0].name} </h3>
    
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                    <b><span style={{color: (direction === "1" ? `red` : `green`)}}> {getChainsNamesFromBridgeObject(bridge)[0]} </span> {direction === "1" ? `➡` : `⬅`} <span style={{color: (direction === "2" ? `red` : `green`)}}>  {getChainsNamesFromBridgeObject(bridge)[1]}  </span></b>
                    </Card.Subtitle>
                    <ButtonGroup>
                                {directions.map((dir, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`dir-${idx}`}
                                    type="radio"
                                    variant={'outline-primary'}
                                    name="dir"
                                    value={dir.value}
                                    checked={direction === dir.value}
                                    onChange={(e) => setDirection(e.currentTarget.value)}
                                    style={{paddingLeft: (idx == 0 ? "2rem" : "1.5rem"),paddingRight: (idx == 0 ? "1.5rem" : "2rem"),  borderRadius: (idx % 2 ? "0px 8px 8px 0px" : "8px 0px 0px 8px"), marginBottom: "1rem"}}
                                >
                                    {dir.name}
                                </ToggleButton>
                                ))}
                            </ButtonGroup>
                    <Card.Body style={{justifyContent: "center", alignItems: "center", backgroundColor: (direction == '2' ? '#f5c6a3' : '#B1DAE7'), padding: "2rem", borderRadius: "8px"}}>
                    <Formik
                            validationSchema={bridgeSchema}
                            initialValues={{
                                amount: 0,
                                fee: 0,
                            }}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                console.log("CONFIRM")
                                console.log(values)
                                confirmTransfer(values.amount, values.fee);
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
                            values,
                            errors,
                        }) => (
                            <Form id='bridgeForm' noValidate onSubmit={handleSubmit}>
                            
                                <Form.Group controlId='amountBridge' className='position-relative' style={{margin: "10px", borderRadius: "8px"}}>
                                    {/* <Form.Label id="input-user-name" style={{borderRadius: "8px 0 0 8px"}}><span>Amount</span></Form.Label> */}
                                    <InputGroup>
                                    <InputGroup.Text style={{textAlign: "start"}}>Amount</InputGroup.Text>
                                    <Form.Control 
                                        onChange={handleChange}
                                        type="number"
                                        placeholder={0}
                                        name="amount"
                                        value={values.amount}
                                        isInvalid={!!errors.amount}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip style={{position: "absolute", top: -35}}>
                                        {errors.amount}
                                    </Form.Control.Feedback>
                                    </InputGroup>
                                    {/* <Button variant="outline-dark" onClick={() =>  maxTransferInput(direction)} style={{borderRadius: "0 8px 8px 0"}} > <span>Max</span> </Button> */}
                                </Form.Group>

                                <OverlayTrigger
                                placement="left"
                                delay={{ show: 0, hide: 400 }}
                                overlay={renderTooltip}
                                >
                                <Form.Group controlId='feeBridge' style={{margin: "10px"}}>
                                    <InputGroup>
                                    <InputGroup.Text style={{borderRadius: "8px 0 0 8px"}}>Fee</InputGroup.Text>
                                    <Form.Control 
                                        onChange={handleChange}
                                        type="number"
                                        placeholder={0}
                                        name="fee"
                                        value={values.fee}
                                        isInvalid={!!errors.fee}
                                        onBlur={handleBlur}
                                    />
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid" tooltip style={{position: "absolute", top: -35}}>
                                        {errors.fee}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                </OverlayTrigger>

                                <Button form='bridgeForm' variant="success" type='submit' style={{borderRadius: "8px"}}>

                                {loading ? (
                                    <div>
                                        <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />

                                        <span> Transfer </span>

                                    </div>


                                ) : (
                                    <span> Transfer  </span>
                                    
                                )

                                } 
                                </Button>
                                </Form>
                        )}
                        </Formik>

                </Card.Body>
                    
                   

                </Card.Body>

                ): (
                    <Card.Body>
                        <Card.Title> Only main chain exists </Card.Title>

                        <Card.Text> Please create a bridge to use this function</Card.Text>

                    </Card.Body>

                )

                }
            </Card>
            
            
        </div>
    )
};

export default BridgeCard