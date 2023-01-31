import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import {InputGroup, FormControl, Button, Spinner} from "react-bootstrap";
import PieChart from './PieChart';
import TransactionsTable from './TransactionTable';
import AllTransactionsTable from './TransactionTableAll';



const BlockchainData = () => {
    const context = useContext(AppContext);
    
    const [chartDataArray, setChartDataArray] = useState([]);
    const [relativeStake, setRelativeStake] = useState(0);
    const [newStake, setNewStake] = useState("0");
    const [txFee, setTxFee] = useState("0");
    const [loadingStake, setLoadingStake] = useState(false);
    const [loadingUnstake, setLoadingUnstake] = useState(false);

    const confirmStake = async () => {
        try {
            let numCheck; 
            await import('../HelperFunctions/functions')
            .then(async({ checkNumber }) => {
                numCheck = await checkNumber(newStake, txFee, context.usersBalances[context.activeChain][`${context.chains[context.activeChain].name}`], context.transactions, context.agent, context.chains[context.activeChain]);
            })
            .catch(err => {
                console.log(err);
            });

            if (numCheck.state == -1) {
                context.setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: numCheck.msg,
                      heading: 'Wrong input',
                      show: true,
                      type: 'danger'
                    });
                  });
            } else {
                setLoadingStake(true);

                const data = {
                    amount: newStake,
                    fee: txFee,
                    chainId: context.chains[context.activeChain].id
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
                setNewStake("0");
                setTxFee("0");
                    

            }

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


 
    const confirmUnstake = async () => {
        try {
            let numCheck; 
            await import('../HelperFunctions/functions')
            .then(async({ checkNumber }) => {
                numCheck = await checkNumber(newStake, txFee, context.usersBalances[context.activeChain][`${context.chains[context.activeChain].name}`])
            })
            .catch(err => {
                console.log(err);
            });

            if (numCheck.state == -1) {
                context.setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: numCheck.msg,
                      heading: 'Wrong input',
                      show: true,
                      type: 'danger'
                    });
                  });
            } else {
                setLoadingUnstake(true);

                const data = {
                    amount: newStake,
                    fee: txFee,
                    chainId: context.chains[context.activeChain].id
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
                setNewStake("0");
                setTxFee("0");
                    

            }

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
        if(context.chains[0].name !== "NULL") {
            if (context.chains[context.cookies.activeChain].stake == 0 ||  context.chains[context.cookies.activeChain].stake == undefined) {
                setRelativeStake(0);
            } else {
                setRelativeStake(((context.usersStakes[context.chains[context.cookies.activeChain].name] / context.chains[context.cookies.activeChain].stake) * 100).toFixed(1));
            } 
        } else {
            setRelativeStake(0);
        }


        const createDataArray = async () => { 
            let dataArray = [2];
            dataArray[0] = {id: "You", label: "user", value: context.usersStakes[context.stakeIndex][`${context.chains[context.activeChain].name}`]};
            dataArray[1] = {id: "Other players", label: "chain", value: (context.chains[context.activeChain].stake - context.usersStakes[context.stakeIndex][`${context.chains[context.activeChain].name}`]) };
            // console.log("USERS:  " + users);
            setChartDataArray(dataArray);
            console.log(dataArray);
        };
        createDataArray();

    }, [context.users]);


    return (
        <>
            <div className="d-flex flex-column" style={{padding: "5px"}}>
                <div className="d-flex">
                    <TransactionsTable/>
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{width: "100%", margin: "5px", justifyContent: "space-evenly", borderRadius: "8px", boxShadow: "var(--light-shadow)", paddingRight: "5px", zIndex: 1}}>
                    
                        
                        <div className="d-flex flex-column"  style={{textAlign: "center", paddingTop: "7px"}}>
                            <h3> Stake on <span style={{color: 'red'}}> {context.chains[context.cookies.activeChain].name} </span> Chain </h3>
                            <h4>Your stake: {context.usersStakes[context.chains[context.cookies.activeChain].name]} ({relativeStake}%)</h4>         
                        </div>

                        <div className="d-flex" style={{width: "100%", height: "100%", minWidth: "20%"}}>

                            <div style={{margin: "auto", width: "35vh", height: "30vh"}}>
                                <PieChart data={chartDataArray}/>
                            </div>
                            <div className="d-flex flex-column" style={{justifyContent: "center", alignItems: "center", zIndex: 1}}>
                            
                                    <InputGroup style={{paddingBottom: "15px"}}>
                                        <InputGroup.Text id="d-flex" style={{fontSize: "1.2rem", borderRadius: "8px 0 0 8px"}}>Amount</InputGroup.Text>
                                        <FormControl value ={newStake} placeholder={"Enter amount"} onChange={e => setNewStake(e.target.value)} style={{borderRadius: "0px 8px 8px 0"}}></FormControl>
                                    </InputGroup>

                                    <InputGroup style={{paddingBottom: "15px"}}>
                                        <InputGroup.Text id="d-flex" style={{fontSize: "1.2rem", borderRadius: "8px 0 0 8px"}}>Fee</InputGroup.Text>
                                        <FormControl value ={txFee} placeholder={"Enter amount"} onChange={e => setTxFee(e.target.value)} style={{borderRadius: "0px 8px 8px 0"}}></FormControl>
                                    </InputGroup>
               
                                <Button variant="success"  onClick={confirmStake} style={{padding: "0.3rem 2rem", margin: "5px", fontSize: "1.2rem", borderRadius: "8px"}}>
                                {loadingStake ? (
                                        <div>
                                            <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />

                                        <text> STAKE </text> 

                                        </div>
                                    ) : (
                                        <text> STAKE </text>
                                    )
                                    
                                    } 
                                </Button>
                                
                                <Button variant='warning'  onClick={confirmUnstake} style={{padding: "0.3rem 1.2rem", margin: "5px", fontSize: "1.2rem", borderRadius: "8px"}}>
                                {loadingUnstake ? (
                                        <div>
                                            <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />

                                            <text> UNSTAKE  </text>

                                        </div>
                                    ) : (
                                        <text> UNSTAKE  </text>
                                    )
                                    
                                } 
                                
                                
                                </Button>
                            </div>
                            
                        </div>
                    </div>
                   
                </div>
                <div style={{backgroundColor: "rgba(255, 255, 255, 0.8)", boxShadow: "var(--light-shadow)", borderRadius: "8px", margin: "5px", textAlign: "center"}}>
                    <h3>Transactions History</h3>
                    <AllTransactionsTable/>
                </div>
                
            </div>
        </>
    )
};

export default BlockchainData