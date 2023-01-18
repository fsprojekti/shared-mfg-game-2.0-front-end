import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import {Button, Spinner, Card, Dropdown, FormControl, InputGroup} from "react-bootstrap";
import {motion} from 'framer-motion'
const CreateSideChain = () => {
    const context = useContext(AppContext);

    const [loading, setLoading] = useState(false);
    const [openModal, setModal] = useState(false);
    const [chain, setChain] = useState(0);
    const [fee, setFee] = useState(0);
    const [amount, setAmount] = useState(0);

    let openCreateCard  = async () => {
        setModal(true);
    }


    let createChain = async () => {
        try {
            setLoading(true);
            console.log("Chain to create from:")
            console.log(context.chains[chain].name)
            console.log(context.chains[chain].id)
            let response = await context.apiUserCreateChain(context.chains[chain].id, fee);
            console.log(response);
            context.apiUserFetchBalance(context.game.id).then(balance => {
                console.log(JSON.stringify(balance));
                context.setUsersBalances(balance);
            }).catch(e => console.log(e));

            context.apiUserFetchStake(context.game.id).then(stakes => {
                console.log("STAKES: " + stakes)
                if(stakes[0] != undefined) context.setUsersStakes(stakes[0]);
            }).catch(e => console.log(e));


            context.setNote({
                show: true,
                type: "success",
                msg:  response.message,
                heading: "Success! "
            })
            setLoading(false);
            setModal(false);
        } catch (e) {
            setLoading(false);
            context.setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Chain not created! "
            })
        }
    }


    return (
        <>
        

            <div style={{textAlign: "center", padding: "4px", zIndex: 1}}>

                {openModal ? (
                    <motion.div 
                        // className="box"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.2,
                                type: "spring",
                                bounce: 0.5,
                                ease: [0, 0.71, 0.2, 1.01]
                            }}>

                        <Card style={{width: "100%", height: "100%", backgroundColor: "white", zIndex: 1, borderRadius: "8px", boxShadow: "var(--light-shadow)"}}>
                            <Card.Body>
                                <Card.Title> Create a new chain </Card.Title>
                                <Card.Text>
                                    <p> You are about to create a new sidechain of </p>
                                    <Dropdown style={{margin: "10px"}}>
                                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" >
                                        <b> <span style={{color: 'green'}}> {context.chains[chain].name} </span>  </b> 
                                    </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                        {
                                            context.chains.map((item, index) => (
                                                <Dropdown.Item onClick={(item) => (setChain(index))} > {item.name} </Dropdown.Item>
                                            ))
                                        }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <InputGroup style={{paddingLeft: "1rem", paddingRight: "1rem", paddingBottom: "1rem"}}>
                                        <InputGroup.Text id="input-user-name">Fee</InputGroup.Text>
                                        <FormControl value ={fee} onChange={e => setFee(e.target.value)}></FormControl>
                                    </InputGroup>
                                    {/* <InputGroup style={{paddingLeft: "1rem", paddingRight: "1rem"}}>
                                        <InputGroup.Text id="input-user-name">Amount</InputGroup.Text>
                                        <FormControl value ={amount} onChange={e => setAmount(e.target.value)}></FormControl>
                                    </InputGroup> */}
                                    <p> Are you sure you want to continue? </p>
                                </Card.Text>
                                <div className="d-flex justify-content-center">
                                    <Button variant="success" onClick={createChain}  style={{margin: "5px"}} >
                                    
                                    {loading ? (
                                        <div>
                                            <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <text> Creating </text>
                                        </div>
                                    ) : ( <text> Create  </text>)
                                    
                                    }   
                                    </Button>

                                    <Button variant="danger"  onClick={() =>  setModal(false)} style={{margin: "5px"}}>
                                        <text> Cancel  </text>
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>


                    </motion.div>
                ):(
                    <Button variant="success"  onClick={() =>  setModal(true)} style={{borderRadius: "8px", boxShadow: "var(--light-shadow)"}}>
                        <text> Create a new chain  </text>
                    </Button>
                )
                }
            
                
                
            </div>
        </>
    )
};

export default CreateSideChain