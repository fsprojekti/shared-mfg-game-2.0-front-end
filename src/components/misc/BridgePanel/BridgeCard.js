import React, {useState, useEffect, useContext} from 'react';
import {Button, Card, Dropdown,Form, FormControl, InputGroup, ToggleButton, ButtonGroup, Spinner} from "react-bootstrap";
import { AppContext } from '../../../context/context';


//TODO: Transfer pri max value ne gre uredu skozi.
const BridgeCard = () => {
    const {chains, cookies, apiUserBridge, user, activeChain, usersBalances, bridges, setNote} = useContext(AppContext);
    let [amount, setAmount] = useState(null);
    let [fee, setFee] = useState(null);
    let [bridge, setBridge] = useState(0);

    const [loading, setLoading] = useState(false);

    const [direction, setDirection] = useState('1');

    const directions = [
        { name: 'Deposit', value: '1' },
        { name: 'Withdraw', value: '2' }
    ];


    async function transfer(){
        console.log("Amount: "+ amount);
        //TODO: Ne dela, nevem zakaj. Poglej zakaj
        // context.setNote({...(note.show = true)});
    }

    //TODO: Popravi, da bo vleklo pravilen max amount
    function maxTransferInput(){
        if (direction == "1") {
            let chainIndex = chains.findIndex(item => item.id === bridges[bridge].chainSource);
            setAmount(usersBalances[chainIndex][`${chains[chainIndex].name}`]);
        } else {
            let chainIndex = chains.findIndex(item => item.id === bridges[bridge].chainTarget);
            setAmount(usersBalances[chainIndex][`${chains[chainIndex].name}`]);
        }  
    }

    const countDecimals = (value) => {
        if(Math.floor(value).toString() === value) return 0;
        return value.toString().split(".")[1].length || 0;
    };

    const getChainsNamesFromBridgeObject = (index) => {
        let chainsArr = chains;
        let bridgeChains = chainsArr.filter(item => item.id === bridges[index].chainSource || item.id === bridges[index].chainTarget);
        let names = bridgeChains.map(item => item.name);
        return names;
    };

    //TODO: Popravi da bo alert prikazan s tisim oblačkom spodaj, ko ga lahko skenslaš z x-om
    const confirmTransfer = async () => {
        try {
            setLoading(true);
            if ((amount === null || amount === "" || amount === 0 || isNaN(amount))) {
                setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: 'You must enter positive numbers',
                      heading: 'Transfer failed!',
                      show: true,
                      type: 'danger'
                    });
                  });
                setLoading(false);
            } else {
                if ((Math.sign(amount)) == -1) {
                    setNote((prevState) => {
                        return({
                          ...prevState,
                          msg: 'Amount cannot be a negative number',
                          heading: 'Transfer failed!',
                          show: true,
                          type: 'danger'
                        });
                      });
                    setLoading(false);
                } else {
                    if (countDecimals(amount) > 0 )  {
                        setNote((prevState) => {
                            return({
                              ...prevState,
                              msg: 'Input value must be an integer',
                              heading: 'Transfer failed!',
                              show: true,
                              type: 'danger'
                            });
                          });
                        setLoading(false);
                    } else {
                        if (parseInt(amount)  > parseInt(usersBalances[activeChain][`${chains[activeChain].name}`])) {
                            setNote((prevState) => {
                                return({
                                  ...prevState,
                                  msg: 'Amount is bigger than balance',
                                  heading: 'Transfer failed!',
                                  show: true,
                                  type: 'danger'
                                });
                              });
                            setLoading(false);
                        } else {
                            
                            console.log(bridges[bridge])
                            let response;
                            if(direction == false) response= await apiUserBridge(amount, fee, bridges[bridge].chainTarget, bridges[bridge].chainSource);
                            else response = await apiUserBridge(amount, fee, bridges[bridge].chainSource, bridges[bridge].chainTarget);  

                            setLoading(false);
                            setAmount(0);

                            setNote((prevState) => {
                                return({
                                  ...prevState,
                                  msg: response ,
                                  show: true,
                                  type: 'success'
                                });
                              });
                        }
                    }
                }
            }

        } catch(e) {
            setLoading(false);
            console.log(e)
            setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Transfer failed! "
        })
        }
    };

    useEffect(() => {
        console.log(chains[activeChain].name);
        console.log(usersBalances);
        console.log(usersBalances.indexOf(chains[activeChain].name));

    }, [chains]);


    return (
        <>
        <div className='d-flex' style={{paddingTop: "10%", justifyContent: "center"}}>
            <Card style={{backgroundColor: "transparent", borderRadius: "8px", boxShadow: "var(--light-shadow)"}}>
            { chains.length > 1 ? (
                <Card.Body>
                <Card.Title> 
                <b>{bridges[bridge].name}</b>
                <Dropdown style={{margin: "10px"}}>

                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{borderRadius: "8px"}}>
                        <b> <span style={{color: (direction === "1" ? `red` : `green`)}}> {getChainsNamesFromBridgeObject(bridge)[0]} </span> {direction === "1" ? `➡` : `⬅`} <span style={{color: (direction === "2" ? `red` : `green`)}}>  {getChainsNamesFromBridgeObject(bridge)[1]}  </span>  </b> 
                    </Dropdown.Toggle>
                    
                    <Dropdown.Menu>
                    {
                        bridges.map((item, index) => (
                            <Dropdown.Item onClick={(item) => (setBridge(index))} > {getChainsNamesFromBridgeObject(index)[0]}  {getChainsNamesFromBridgeObject(index)[1]} </Dropdown.Item>
                        ))
                    }
                    </Dropdown.Menu>
                            
                </Dropdown>
                </Card.Title>

                

                        <Card className='d-flex' style={{backgroundColor: "rgba(222, 243, 239, 0.5)", borderRadius: "8px", margin: "10px"}}>
                    
                        <Card.Body>

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
                                style={{width: "10em", borderRadius: (idx % 2 ? "0px 8px 8px 0px" : "8px 0px 0px 8px")}}
                            >
                                {dir.name}
                            </ToggleButton>
                            ))}
                        </ButtonGroup>
                                

                            
                            <Card.Text>

                            <InputGroup style={{margin: "10px", borderRadius: "8px"}}>
                                <InputGroup.Text id="input-user-name" style={{borderRadius: "8px 0 0 8px"}}>Amount</InputGroup.Text>
                                <FormControl value ={amount} onChange={e => setAmount(e.target.value)}></FormControl>
                                <Button variant="outline-info" onClick={() =>  maxTransferInput(direction)} style={{borderRadius: "0 8px 8px 0"}} > Max </Button>
                            </InputGroup>

                            <InputGroup style={{margin: "10px"}}>
                                <InputGroup.Text id="input-user-name" style={{borderRadius: "8px 0 0 8px"}}>Fee</InputGroup.Text>
                                <FormControl value ={fee} onChange={e => setFee(e.target.value)} style={{borderRadius: "0 8px 8px 0"}}></FormControl>
                            </InputGroup>
                            
                            
                            </Card.Text>
                           
                        </Card.Body>
                
                </Card>
                
                <Button variant="success"  onClick={() => confirmTransfer()} style={{borderRadius: "8px"}}>

                {loading ? (
                    <div>
                        <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />

                        <text> Transfering </text>

                    </div>
                   

                ) : (
                    <text> Transfer  </text>
                )
                
                } 
                </Button>

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
            
        </>
    )
};

export default BridgeCard