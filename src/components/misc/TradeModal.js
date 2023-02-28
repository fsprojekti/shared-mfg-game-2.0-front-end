import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../context/context';
import {InputGroup, FormControl, Button, Spinner} from "react-bootstrap";
import {motion} from 'framer-motion'

const TradeModal = () => {
    const { transactions, user, isTradeModalOpen, usersBalances, agent, servicesAll, activeChain, tradeModalContent, setIsTradeModalOpen, apiUserBidOrder, users, orders, chains, cookies, agents, note, setNote} = useContext(AppContext);
    const [txFee, setTxFee] = useState("0");
    const [tableDataArray, setTableDataArray] = useState([]);
    const [provider, setProvider] = useState('');

    const countDecimals = (value) => {
        if(Math.floor(value).toString() === value) return 0;
        return value.toString().split(".")[1].length || 0;
    };

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

    const confirm = async () => {
        try {
            let numCheck; 
            console.log("confirm")
            let index = await chains["chains"].findIndex((c) => c.name === tradeModalContent.chainName);
            
            await import('./HelperFunctions/functions')
            .then(async({ checkNumber }) => {
                numCheck = await checkNumber(tradeModalContent.price, txFee, usersBalances[index][`${chains["chains"][index].name}`], transactions, agent, chains["chains"][index]);
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

                    console.log(tradeModalContent);
                    await apiUserBidOrder(txFee, tradeModalContent._id);
                    setIsTradeModalOpen(false);

                    setNote({...(note.show = false)});
                    setTxFee();
                        }
        } catch(err) {
            if (err.response !== undefined && err.response.data.message === "Trade already exists") {
                // setAlertContent('Trade with this person already exists');
                // setShowAlert(true);
            }
        }
    };

    useEffect(() => {
        
        // console.log(servicesAll);
        // console.log(transactions);

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
    }, [transactions, tradeModalContent]);

    const handleKeypress = async e => {
        try {
            if (e.key === 'Enter') {
                confirm();
            }
        } catch(err) {
            console.log(err);
        }
    };

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
                            {/* <li> Provider: <span style={{color: 'blue'}}> {tradeModalContent.playerName} </span> </li>     */}
                            <li> Price: <span style={{color: 'green'}}> {tradeModalContent.price} </span> </li>
                            <li> Chain: <span style={{color: (tradeModalContent.chainName == chains["chains"][0].name ? '#d2abd8' : '#73bcd4')}}> {tradeModalContent.chainName} </span> </li>
                            
                        </ul>
                        <div className={"trade-modal-input-group"}>
                            <label htmlFor={"txFee"}>Tx Fee</label>
                            <div className="trade-modal-input-group-container">
                                <InputGroup style={{paddingBottom: "15px"}}>
                                    <FormControl value ={txFee} placeholder={"Enter amount"} onChange={e => setTxFee(e.target.value)} style={{borderRadius: "8px 8px 8px 8px"}}></FormControl>
                                </InputGroup>

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
                {/* <div className="d-flex align-items-center justify-content-center" style={{zIndex: 2, position: "absolute"}}>
                                    <NoteDismissible show={note.show}
                                        msg={note.msg}
                                        variant={note.type}
                                        heading={note.heading}
                                        reportHide={() => {
                                            setNote({...(note.show = false)});
                                        }}/>
                                </div> */}

                <div className='d-flex'>
                    <Button class="btn btn-success active" style={{backgroundColor: "green", margin: "1rem"}} className='confirm-modal-btn' onClick={confirm}>Confirm</Button>
                    <Button class="btn btn-danger" style={{backgroundColor: "red", margin: "1rem"}} onClick={() => {
                        setIsTradeModalOpen(false)
                        setNote({...(note.show = false)});
                        setTxFee();
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