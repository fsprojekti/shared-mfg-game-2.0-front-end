import React, {useState, useEffect, useContext} from 'react';
import ReactTooltip from 'react-tooltip';
import { AppContext } from '../../../context/context';
import { FaTimes } from 'react-icons/fa';
import MiningBar from './MiningBar';
import { Button, Row, Col } from 'react-bootstrap';


const TransactionsTable = () => {
    const { user, users, agents, openConfirmModal, setConfirmModalContent, transactions, chains, activeChain} = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);
    const [checkBoxes, setCheckBoxes] = useState([{type: "All", isChecked: true}, {type: `${chains["chains"][0].name}`, isChecked: false}, {type: `${chains["chains"][1].name}`, isChecked: false}]);

    const setCancelTransactionModal = (transaction) => {
        setConfirmModalContent(transaction);
        openConfirmModal();
    };

    const selectOne = async (e) => {
        console.debug(e)
        let itemName = e.target.name;
        let checked = e.target.checked;
        const newArray = checkBoxes.map(item =>
            item.type === itemName ? { ...item, isChecked: checked } : { ...item, isChecked: false }
        );
        let index = newArray.findIndex((c) => c.isChecked == true);
        console.log(index)
        if(index == -1) newArray[0].isChecked = true; 
        setCheckBoxes(newArray);
    };

    useEffect(() => {
        console.log(chains["chains"]);
        const renderTableData = async () => {
            console.log(transactions)
            let orderTransactions = [];
            if(checkBoxes[0].isChecked) orderTransactions = await transactions.filter(transaction => transaction.state == "SEND");
            else {
                if(checkBoxes[1].isChecked) orderTransactions = await transactions.filter(transaction => transaction.state == "SEND" && transaction.chain == chains["chains"][0].id);
                if(checkBoxes[2].isChecked) orderTransactions = await transactions.filter(transaction => transaction.state == "SEND" && transaction.chain == chains["chains"][1].id);
            }
            console.log(orderTransactions)
            const transactionsByFee = await orderTransactions.sort((a, b) => parseInt(b.fee) - parseInt(a.fee));
            console.log(transactionsByFee)
            const transactionsArray = await Promise.all(transactionsByFee.map(async (transaction) => {
                let { from, to, fee, amount} = transaction;

                let chainIndex = chains["chains"].findIndex((c) => c.id === transaction.chain);
                console.log(chainIndex)

                const consumerAgent = await agents["agents"].filter(agent => agent.account === from);
                console.log(consumerAgent)

                let consumerUser;
                console.log(consumerAgent)
                console.log(!consumerAgent.length)
                if(consumerAgent.length) consumerUser = await users["users"].filter(user => user.id === consumerAgent[0].user);
                
                
                const providerAgent = await agents["agents"].filter(agent => agent.account === orderTransactions[0].to);

                if(!providerAgent.length) {
                    return (
                        {
                            id: transaction._id,
                            consumer: consumerUser[0].name,
                            provider:  chains["chains"][chainIndex].name,
                            price: amount,
                            fee: fee,
                            chain: chains["chains"][chainIndex].name,
                        }
                    )
                }         

                const providerUser = await users["users"].filter(user => user.id === providerAgent[0].user);

                if(!consumerAgent.length) {
                    return (
                        {
                            id: transaction._id,
                            consumer: chains["chains"][chainIndex].name,
                            provider: providerUser[0].name,
                            price: amount,
                            fee: fee,
                            chain: chains["chains"][chainIndex].name,
                        }
                    )
                }


                if(providerUser[0].name != undefined) {
                    return (
                        {
                            id: transaction._id,
                            consumer: consumerUser[0].name,
                            provider: providerUser[0].name,
                            price: amount,
                            fee: fee,
                            chain: chains["chains"][chainIndex].name,
                        }
                    )
                }
                
            }));

            setTableDataArray(transactionsArray);
        };
        renderTableData();

    }, [transactions, activeChain, checkBoxes]);


    return (
        <>
            <div className="pending-transactions-container">
                {/* <MiningBar version=""/> */}
                <h2 className="pending-transactions-title">Pending transactions</h2>
                <div className="filter-all-transactions">
                {checkBoxes.map((item) => (
                            <label className="checkbox-container" key={item.type}>{item.type}
                                <input type="checkbox" name={item.type} checked={item.isChecked} onChange={selectOne}/>
                                <span className="checkmark"></span>
                            </label>
                        ))}
                </div>
                <div className="table-pending-transactions-container">
                    <table className="table-pending-transactions">
                        <thead>
                        <tr>
                            <th className="table-pending-transactions-head">No.</th>
                            <th className="table-pending-transactions-head">Pending transactions</th>
                            <th className="table-pending-transactions-head">Chain</th>
                            <th className="table-pending-transactions-head">Tx Fee</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            tableDataArray.map((item, index) => (
                                <tr
                                    key={item.id}
                                    data-tip data-for={item.id}
                                    style={{background: `${(item.consumer === user.playerName) || (item.provider === user.playerName) ? '#fffd6c' : ''}`}}
                                >
                                    <td><strong>{index + 1}</strong></td>
                                    <td>
                                        {item.consumer} &#8646; {item.provider}
                                        {item.consumer === user.playerName ?
                                            <button
                                                className='cancel-transaction-btn'
                                                onClick={() => { ((item.consumer === user.playerName) || (item.provider === user.playerName)) && setCancelTransactionModal(item)}}
                                            >
                                                <FaTimes></FaTimes>
                                            </button>
                                            :''}
                                    </td>
                                    <td>{item.chain}</td>
                                    <td>{item.fee}</td>
                                    <td className="table-pending-transactions-tooltip">
                                        <ReactTooltip id={item.id} place="bottom" type="dark" effect="solid">
                                            <ul>
                                                <li>Consumer: {item.consumer}</li>
                                                <li>Provider: {item.provider}</li>
                                                <li>typeOfService: {item.typeOfService}</li>
                                                <li>price: {item.price}</li>
                                                <li>chain: {item.chain}</li>
                                            </ul>
                                        </ReactTooltip>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
};

export default TransactionsTable