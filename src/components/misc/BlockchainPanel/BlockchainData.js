import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import {InputGroup, FormControl, Button, Spinner} from "react-bootstrap";
import PieChart from './PieChart';
import TransactionsTable from './TransactionTable';
import AllTransactionsTable from './TransactionTableAll';
import NoteDismissible from '../../notifications/NoteDismissible';



const BlockchainData = () => {
    const context = useContext(AppContext);
    const [chartDataArray, setChartDataArray] = useState([]);
    const [relativeStake, setRelativeStake] = useState(0);
    const [newStake, setNewStake] = useState("0");
    const [txFee, setTxFee] = useState("0");
    const [loadingStake, setLoadingStake] = useState(false);
    const [loadingUnstake, setLoadingUnstake] = useState(false);

    // const [note, setNote] = useState({
    //     show: false,
    //     type: "info",
    //     msg: "Default message",
    //     heading: "Test"
    // })

    const countDecimals = (value) => {
        if(Math.floor(value).toString() === value) return 0;
        return value.toString().split(".")[1].length || 0;
    };

    const confirmStake = async () => {
        try {
            if ((txFee === undefined || txFee === "" || txFee == 0) || (newStake === undefined || newStake === "" || newStake == 0)) {
                context.setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: 'You must enter a value',
                      heading: 'Wrong input',
                      show: true,
                      type: 'danger'
                    });
                  });
            } else {
                if ((isNaN(txFee) || txFee < 0) || (isNaN(newStake) || newStake < 0)) {
                    context.setNote((prevState) => {
                        return({
                          ...prevState,
                          msg: 'You must enter positive numbers',
                          heading: 'Wrong input',
                          show: true,
                          type: 'danger'
                        });
                      });
                } else {
                    if (countDecimals(txFee) > 0 || countDecimals(newStake) > 0)  {
                        context.setNote((prevState) => {
                            return({
                              ...prevState,
                              msg: 'Input value must be an integer',
                              heading: 'Wrong input',
                              show: true,
                              type: 'danger'
                            });
                          });
                    } else {
                        if (parseInt(newStake) + parseInt(txFee) > context.user.balance) {
                            context.setNote((prevState) => {
                                return({
                                  ...prevState,
                                  msg: 'Amount + TxFee is bigger than balance',
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

                            let response = await context.apiUserStake(context.cookies.userId, data);

                            context.setNote({
                                show: true,
                                type: "success",
                                msg: response,
                                heading: "Success! "
                            })
                            setLoadingStake(false);
                            setNewStake("0");
                            setTxFee("0");
                        }
                    }
                }
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
            if ((txFee === undefined || txFee === "" || txFee == 0) || (newStake === undefined || newStake === "" || newStake == 0)) {
                context.setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: 'You must enter a value',
                      heading: 'Wrong input',
                      show: true,
                      type: 'danger'
                    });
                  });
            } else {
                if ((isNaN(txFee) || txFee < 0) || (isNaN(newStake) || newStake < 0)) {
                    context.setNote((prevState) => {
                        return({
                          ...prevState,
                          msg: 'You must enter positive numbers',
                          heading: 'Wrong input',
                          show: true,
                          type: 'danger'
                        });
                      });
                } else {
                    if (countDecimals(txFee) > 0 || countDecimals(newStake) > 0)  {
                        context.setNote((prevState) => {
                            return({
                              ...prevState,
                              msg: 'Input value must be an integer',
                              heading: 'Wrong input',
                              show: true,
                              type: 'danger'
                            });
                          });
                    } else {
                        if (parseInt(newStake) + parseInt(txFee) > context.user.balance) {
                            context.setNote((prevState) => {
                                return({
                                  ...prevState,
                                  msg: 'Amount + TxFee is bigger than balance',
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

                            let response = await context.apiUserUnstake(context.cookies.userId, data);
                            context.setNote({
                                show: true,
                                type: "success",
                                msg: response,
                                heading: "Success! "
                            })
                            setLoadingUnstake(false);
                            setNewStake("0");
                            setTxFee("0");
                        }
                    }
                }
            }

        } catch(e) {
            setLoadingUnstake(false);
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
            const dataArray = await context.users["users"].map((item) => {
                return({
                    id: item.name,
                    label: item.name,
                    value: item.stake
                });
            });
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

                                            <text> STAKE  </text>

                                        </div>
                                    ) : (
                                        <text> STAKE  </text>
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
                        {/* <div className="d-flex align-items-center justify-content-center" style={{zIndex: 2, position: "absolute"}}>
                                    <NoteDismissible show={context.note.show}
                                        msg={context.note.msg}
                                        variant={context.note.type}
                                        heading={context.note.heading}
                                        reportHide={() => {
                                            context.setNote({...(context.note.show = false)});
                                        }}/>
                                </div> */}
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