import React, {useState, useEffect, useContext} from 'react';
import ReactTooltip from 'react-tooltip';
import { AppContext } from '../../../context/context';
import { FaTimes } from 'react-icons/fa';
import MiningBar from './MiningBar';
import { Button, Row, Col } from 'react-bootstrap';


const TransactionsTable = () => {
    const { user, users, agents, openConfirmModal, setConfirmModalContent, transactions, chains, activeChain} = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);
    const [checkBoxes, setCheckBoxes] = useState([{chain: chains["chains"][0], isChecked: true}, {chain: chains["chains"][1], isChecked: true}]);

    const setCancelTransactionModal = (transaction) => {
        setConfirmModalContent(transaction);
        openConfirmModal();
    };

    const selectOne = async (e) => {
        // console.debug(e)
        let itemName = e.target.name;
        let checked = e.target.checked;

        let newArray = checkBoxes.map(item =>
            item.chain.name === itemName ? { ...item, isChecked: checked } : { ...item }
        );

        setCheckBoxes(newArray);
    };

    const filterDataArrayByChain = (dataArray) => {

        const checkedChains = checkBoxes.filter(item => item.isChecked);
        // console.log(checkedChains)
        const selectedChains = checkedChains.map(item => item.chain.id);
        if (!Array.isArray(selectedChains) || !selectedChains.length) {
            return [];
        }

        return dataArray.filter(data => selectedChains.includes(data.chainId));
    };

    useEffect(() => {
        // console.log(chains["chains"]);
        const renderTableData = async () => {
            // console.log(transactions)
            let orderTransactions = await transactions.filter(transaction => transaction.state == "SEND");
            // if(checkBoxes[1].isChecked) orderTransactions = await transactions.filter(transaction => transaction.state == "SEND" && transaction.chain == chains["chains"][0].id);
            // else if (checkBoxes[2].isChecked) orderTransactions = await transactions.filter(transaction => transaction.state == "SEND" && transaction.chain == chains["chains"][1].id);
            // else orderTransactions = await transactions.filter(transaction => transaction.state == "SEND");
            // console.log(orderTransactions)
            const transactionsByFee = await orderTransactions.sort((a, b) => parseInt(b.fee) - parseInt(a.fee));
            // console.log(transactionsByFee)
            const transactionsArray = await Promise.all(transactionsByFee.map(async (transaction) => {
                let { from, to, fee, amount} = transaction;

                let chainIndex = chains["chains"].findIndex((c) => c.id === transaction.chain);
                // console.log(chainIndex)

                const consumerAgent = await agents["agents"].filter(agent => agent.account === from);
                // console.log(consumerAgent)

                let consumerUser;
                // console.log(consumerAgent)
                // console.log(!consumerAgent.length)
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
                            chainId: chains["chains"][chainIndex].id,
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
                            chainId: chains["chains"][chainIndex].id,
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
                            chainId: chains["chains"][chainIndex].id,
                        }
                    )
                }
                
            }));

            console.log(transactionsArray)
            let chainTransactionArray = await filterDataArrayByChain(transactionsArray);

            console.log(chainTransactionArray)
            setTableDataArray(chainTransactionArray);
        };
        renderTableData();

    }, [transactions, activeChain, checkBoxes]);


    return (
        <>
            <div className="pending-transactions-container">
                {/* <MiningBar version=""/> */}
                <h2 className="pending-transactions-title">Pending transactions</h2>
                <div className="filter-all-transactions">
                <div className="d-block" style={{position: "relative", margin: "10px"}}>
                    <b > Chains: </b>
                </div>
                {checkBoxes.map((item) => (
                    <label className="checkbox-container" key={item.chain.id}>{item.chain.name}
                                <input type="checkbox" name={item.chain.name} checked={item.isChecked} onChange={selectOne}/>
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