import React, {useState, useEffect} from 'react';
import { useGlobalContext } from '../../context/context';
import { FaTimes } from 'react-icons/fa';
import Axios from "axios/index";
import {InputGroup, FormControl, Button, Spinner} from "react-bootstrap";
import NoteDismissible from '../notifications/NoteDismissible';
import {motion} from 'framer-motion'

const TradeModal = () => {
    const { transactions, user, isTradeModalOpen, usersBalances, closeTradeModal, servicesAll, activeChain, tradeModalContent, setIsTradeModalOpen, apiUserBidOrder, users, orders, chains, cookies, agents, note, setNote} = useGlobalContext();
    const [txFee, setTxFee] = useState("0");
    const [showAlert, setShowAlert] = useState(false);
    const [alertContent, setAlertContent] = useState('');
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
            if (txFee === undefined || txFee === "") {
                setNote((prevState) => {
                    return({
                      ...prevState,
                      msg: 'You must enter a value',
                      show: true,
                      heading: 'Error',
                      type: 'danger'
                    });
                  });
            } else {
                if (isNaN(txFee) || txFee < 0) {
                    setNote((prevState) => {
                        return({
                          ...prevState,
                          msg: 'Input value must be an integer',
                          show: true,
                          heading: 'Error',
                          type: 'danger'
                        });
                      });
                } else {
                    if (countDecimals(txFee) > 0) {
                        setNote((prevState) => {
                            return({
                              ...prevState,
                              msg: 'Input value must be an integer',
                              heading: 'Error',
                              show: true,
                              type: 'danger'
                            });
                          });
                    } else {
                        if (parseInt((tradeModalContent.price) + parseInt(txFee)) > parseInt(usersBalances[`${chains[activeChain].name}`])) {
                            setNote((prevState) => {
                                return({
                                  ...prevState,
                                  msg: 'Price and TxFee is higher than balance',
                                  heading: 'Error',
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
                    }
                }
            }
        } catch(err) {
            if (err.response !== undefined && err.response.data.message === "Trade already exists") {
                setAlertContent('Trade with this person already exists');
                setShowAlert(true);
            }
        }
    };

    useEffect(() => {
        
        console.log(parseInt(tradeModalContent.price)  )

        const renderTableData = async () => {
            console.log(tradeModalContent);
            const orderTransactions = await transactions[chains[activeChain].name].filter(transaction => transaction.order == tradeModalContent._id  && transaction.state == "SEND");
            console.log(orderTransactions[0]);
            const providerServiceObject = await servicesAll.filter(service => service._id === tradeModalContent.service);
            console.log(providerServiceObject[0]);
            const providerAgentObject = await agents.filter(agent => agent._id === providerServiceObject[0].agent);
            const providerUser = await users["users"].filter(user => user._id === providerAgentObject[0].user);

            setProvider(providerUser[0]);
            

            const transactionsInOrder = await orderTransactions.sort((a, b) => b.fee - a.fee);

            const transactionsArray = await Promise.all(transactionsInOrder.map(async (item) => {
                let { from, to, fee, amount} = item;
                console.log(from)
                console.log(agents)
                const consumerAgent = await agents.filter(agent => agent.account === from);
                console.log(consumerAgent);
                
                const consumerUser = await users["users"].filter(user => user._id === consumerAgent[0].user);
            
                
                return (
                    {
                        id: item._id,
                        consumer: consumerUser[0].name,
                        provider: providerUser[0].name,
                        price: amount,
                        fee: fee,
                    }
                )
            }));
            console.log(transactionsArray);
            setTableDataArray(transactionsArray);
        };
        renderTableData();
    }, [transactions]);

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
        <div>
            {isTradeModalOpen ? (

                

                <div
            className={
                `${'modal-confirm-overlay show-modal-confirm'}`
            }
        >
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
                <h3>Bid for <span style={{color: "orange"}}> {`${provider.name}'s`}</span>  service</h3>
                <div className='modal-confirm-container-data'>
                    <div className='modal-confirm-container-input'>
                        <ul>
                            <li style={{textAlign: "center"}}> <span style={{color: getColor(tradeModalContent.serviceType)}}> {tradeModalContent.serviceType} </span>  </li>
                            {/* <li> Provider: <span style={{color: 'blue'}}> {tradeModalContent.playerName} </span> </li>     */}
                            <li> Price: <span style={{color: 'green'}}> {tradeModalContent.price} </span> </li>
                            
                        </ul>
                        <div className={"trade-modal-input-group"}>
                            <label htmlFor={"txFee"}>Tx Fee</label>
                            <div className="trade-modal-input-group-container">
                                {/* <input type={"text"} name={"txFee"} id={"inputHolder"} placeholder={"Enter tx fee"} onChange={e => changeFeeInput(e)} /> */}
                                <InputGroup >
                                        {/* <InputGroup.Text id="d-flex">Amount</InputGroup.Text> */}
                                    <FormControl value ={txFee} placeholder={"Enter tx fee"} onChange={e => setTxFee(e.target.value)}  onKeyPress={e => handleKeypress(e)}></FormControl>
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