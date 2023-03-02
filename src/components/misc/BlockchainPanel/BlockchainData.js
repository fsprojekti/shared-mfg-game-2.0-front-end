import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import {InputGroup, FormControl, Button, Spinner, Dropdown} from "react-bootstrap";
import PieChart from './PieChart';
import TransactionsTable from './TransactionTable';
import AllTransactionsTable from './TransactionTableAll';
import CancelTransactionModal from '../CancelTransaction';



const BlockchainData = () => {
    const context = useContext(AppContext);
    
    const [chartDataArray, setChartDataArray] = useState([]);
    const [relativeStake, setRelativeStake] = useState(0);
    const [newStake, setNewStake] = useState("0");
    const [txFee, setTxFee] = useState("0");
    const [loadingStake, setLoadingStake] = useState(false);
    const [loadingUnstake, setLoadingUnstake] = useState(false);
    const [stakeChain, setStakeChain] = useState(0)
    const [stakeIndex, setStakeIndex] = useState(0)

    const confirmStake = async () => {
        try {
            let numCheck; 
            await import('../HelperFunctions/functions')
            .then(async({ checkNumber }) => {
                numCheck = await checkNumber(newStake, txFee, context.usersBalances[stakeChain][`${context.chains["chains"][stakeChain].name}`], context.transactions, context.agent, context.chains["chains"][stakeChain]);
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
            .then(async({ checkNumberUnstake }) => {
                numCheck = await checkNumberUnstake(newStake, txFee, context.usersBalances[stakeChain][`${context.chains["chains"][stakeChain].name}`], context.usersStakes[stakeIndex][`${context.chains["chains"][stakeChain].name}`], context.transactions, context.agent, context.chains["chains"][stakeChain])
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
            
            let dataArray = ranking.map((item, index) => {
                const agentObject = agents["agents"].filter(agent => agent._id === item.agent);
                const userObject = users["users"].filter(user => user.id === agentObject[0].user);
                // console.debug(userObject[0].name)
                // console.log(item.stake)
                // console.log(stakeChain)
                if (userObject[0].name == context.user) userObject[0].name = "You";
                return {id: userObject[0].name, label: userObject[0].id, value: item.stake[stakeChain]}
            });
            // console.log(dataArray)
            setChartDataArray(dataArray);
        };
        createDataArray();

    }, [context.chains, stakeChain, stakeIndex, context.ranking]);


    return (
        <>
            <div className="d-flex flex-column" style={{padding: "5px"}}>
                <div className="d-flex">
                    <TransactionsTable/>
                    <div className="d-flex flex-column" style={{width: "100%", margin: "5px", justifyContent: "space-evenly", borderRadius: "8px", boxShadow: "var(--light-shadow)", paddingRight: "5px", zIndex: 1}}>
                    
                        
                        <div className="d-flex-row d-inline-block" >
                            <h3 className="d-inline-block"> Stake on 


                            {/* {context.chains["chains"][context.cookies.activeChain].name}  */}
                            <Dropdown className="d-flex-row d-inline-block" style={{margin: "10px"}}>
                
                            <Dropdown.Toggle  variant="outline-danger" style={{height: "40px", borderRadius: "8px"}}>
                                <b>{ context.chains["chains"].length < 1  ? "null" : context.chains["chains"][stakeChain].name  }  </b>
                            </Dropdown.Toggle>
                            
                            <Dropdown.Menu>

                            {
                                context.chains["chains"].map((item, index) => (
                                    
                                    <Dropdown.Item onClick={() =>  setStakeChain(index)} > {context.chains["chains"][index].name} </Dropdown.Item>

                                ))
                            }
                            </Dropdown.Menu>
                            
                            </Dropdown>
                            
                            
                            
                            Chain </h3>
                            
                        </div>

                        <h4>Your stake: {context.usersStakes[stakeIndex][`${context.chains["chains"][stakeChain].name}`]} ({relativeStake.stake}%)</h4>         

                        <div className="d-flex" style={{width: "100%", height: "100%", minWidth: "30%"}}>

                            <div style={{margin: "auto", width: "45vh", height: "36vh"}}>
                                <PieChart data={chartDataArray}/>
                            </div>
                            <div className="d-flex flex-column" style={{justifyContent: "center", alignItems: "center", zIndex: 1}}>
                            
                                    <InputGroup style={{paddingBottom: "15px", width: "12rem"}}>
                                        <InputGroup.Text id="d-flex" style={{fontSize: "1.2rem", borderRadius: "8px 0 0 8px"}}>Amount</InputGroup.Text>
                                        <FormControl value ={newStake} placeholder={"Enter amount"} onChange={e => setNewStake(e.target.value)} style={{borderRadius: "0px 8px 8px 0"}}></FormControl>
                                    </InputGroup>

                                    <InputGroup style={{paddingBottom: "15px", width: "12rem"}}>
                                        <InputGroup.Text id="d-flex" style={{fontSize: "1.2rem", borderRadius: "8px 0 0 8px"}}>Fee</InputGroup.Text>
                                        <FormControl value ={txFee} placeholder={"Enter amount"} onChange={e => setTxFee(e.target.value)} style={{borderRadius: "0px 8px 8px 0"}}></FormControl>
                                    </InputGroup>
               
                                <Button  onClick={confirmStake} style={{padding: "0.3rem 2rem", margin: "5px", fontSize: "1.2rem", borderRadius: "8px", backgroundColor: "#34ad6a", borderColor: "#34ad6a"}}>
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
            <CancelTransactionModal/>
        </>
    )
};

export default BlockchainData