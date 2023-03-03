import React, {useState, useEffect, useContext} from 'react';
import {Button, Card, Dropdown,Form, FormControl, InputGroup, ToggleButton, ButtonGroup, Spinner} from "react-bootstrap";
import {IconContext} from "react-icons";
import {GiStoneBridge} from "react-icons/gi";
import { AppContext } from '../../../context/context';


//TODO: Transfer pri max value ne gre uredu skozi.
const BridgeCard = () => {
    const {chains, apiUserBridge, usersBalances, bridges, setNote, transactions, agent} = useContext(AppContext);
    let [amount, setAmount] = useState(0);
    let [fee, setFee] = useState(0);
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
            let chainIndex = chains["chains"].findIndex(item => item.id === bridges[bridge].chainSource);
            setAmount((usersBalances[chainIndex][`${chains["chains"][chainIndex].name}`]).toString());
        } else {
            let chainIndex = chains["chains"].findIndex(item => item.id === bridges[bridge].chainTarget);
            setAmount((usersBalances[chainIndex][`${chains["chains"][chainIndex].name}`]).toString());
        }  
    }

    const countDecimals = (value) => {
        console.log(typeof(value))
        if(Math.floor(value).toString() === value) return 0;
        return value.toString().split(".")[1].length || 0;
    };

    const getChainsNamesFromBridgeObject = (index) => {
        let chainsArr = chains["chains"];
        let bridgeChains = chainsArr.filter(item => item.id === bridges[index].chainSource || item.id === bridges[index].chainTarget);
        let names = bridgeChains.map(item => item.name);
        return names;
    };

    //TODO: Popravi da bo alert prikazan s tisim oblačkom spodaj, ko ga lahko skenslaš z x-om
    const confirmTransfer = async () => {
        try {
            let numCheck; 
            // console.log(chains)
            // console.log(bridges[bridge].chainTarget)
            await import('../HelperFunctions/functions')
            .then(async({ checkNumber }) => {
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
                    // console.log(index);
                    // console.log(usersBalances[index][`${chains["chains"][index].name}`]);
                    // console.log(chains["chains"][index]);
                    numCheck = await checkNumber(amount, fee, usersBalances[index][`${chains["chains"][index].name}`], transactions, agent, chains["chains"][index]);
                

            })
            .catch(err => {
                console.log(err);
            });

            if (numCheck.state == -1) {
                setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: numCheck.msg,
                      heading: 'Wrong input',
                      show: true,
                      type: 'danger'
                    });
                  });
            } else {
                            setLoading(true);
                            // console.log(bridges[bridge])
                            let response;
                            if(direction == '2') response= await apiUserBridge(amount, fee, bridges[bridge].chainTarget, bridges[bridge].chainSource);
                            else if(direction == '1') response = await apiUserBridge(amount, fee, bridges[bridge].chainSource, bridges[bridge].chainTarget);  

                            setLoading(false);
                            setAmount(0);

                            setNote((prevState) => {
                                return({
                                  ...prevState,
                                  msg: response.message,
                                  show: true,
                                  type: 'success',
                                  heading: "Success"
                                });
                              });
            }

        } catch(e) {
            setLoading(false);
            console.log(e)
        //     setNote({
        //         show: true,
        //         type: "danger",
        //         msg: e.response.data.message,
        //         heading: "Transfer failed! "
        // })
        }
    };

    // useEffect(() => {
        // console.log(chains["chains"][activeChain].name);
        // console.log(usersBalances);
        // console.log(usersBalances.indexOf(chains["chains"][activeChain].name));

    // }, [chains]);


    return (
        <div className='d-flex' style={{width: "100%"}}>
            <Card style={{ borderRadius: "8px", boxShadow: "var(--light-shadow)", width: "100%", borderColor: "transparent", justifyContent: "center", alignItems: "center"}}>
                { chains["chains"].length > 1 ? (
                    <Card.Body>
                    <Card.Title> 
                    <h3> <GiStoneBridge/>  {bridges[0].name} <GiStoneBridge/> </h3>
    
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
                                    style={{paddingLeft: (idx == 0 ? "2rem" : "1.5rem"),paddingRight: (idx == 0 ? "1.5rem" : "2rem"), borderRadius: (idx % 2 ? "0px 8px 8px 0px" : "8px 0px 0px 8px"), marginBottom: "1rem"}}
                                >
                                    {dir.name}
                                </ToggleButton>
                                ))}
                            </ButtonGroup>
                    <Card.Text style={{justifyContent: "center", alignItems: "center", backgroundColor: "pink", padding: "2rem", borderRadius: "8px"}}>

                            

                                <InputGroup style={{margin: "10px", borderRadius: "8px"}}>
                                    <InputGroup.Text id="input-user-name" style={{borderRadius: "8px 0 0 8px"}}>Amount</InputGroup.Text>
                                    <FormControl value ={amount} onChange={e => setAmount(e.target.value)}></FormControl>
                                    <Button variant="outline-info" onClick={() =>  maxTransferInput(direction)} style={{borderRadius: "0 8px 8px 0"}} > Max </Button>
                                </InputGroup>

                                <InputGroup style={{margin: "10px"}}>
                                    <InputGroup.Text id="input-user-name" style={{borderRadius: "8px 0 0 8px"}}>Fee</InputGroup.Text>
                                    <FormControl value ={fee} onChange={e => setFee(e.target.value)} style={{borderRadius: "0 8px 8px 0"}}></FormControl>
                                </InputGroup>
                                
                                
                                

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

                </Card.Text>
                    
                   

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