import React, {useState, useEffect, useContext} from 'react';
import ReactTooltip from 'react-tooltip';
import { AppContext } from '../../../context/context';
import { FaTimes } from 'react-icons/fa';
import {Tooltip} from "react-bootstrap";
import {OverlayTrigger} from "react-bootstrap";

const TransactionsTable = () => {
    const { user, users, agents, openConfirmModal, setConfirmModalContent, transactions, chains, activeChain, setCancelTransactionModalContent} = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);
    const [checkBoxes, setCheckBoxes] = useState([{chain: chains["chains"][0], isChecked: true}, {chain: chains["chains"][1], isChecked: true}]);

    const setCancelTransactionModal = (transaction) => {
        setConfirmModalContent(transaction);
        openConfirmModal();
    };

    const renderTooltip1 = (props) => (
        <Tooltip id="button-tooltip" style={{position:"fixed"}} {...props}>
          <li> Provider: {props.consumer} </li>
          <li>Consumer: {props.provider}</li>
            <li>Amount: {props.price}</li>
            <li>Fee: {props.fee}</li>
            <li>Chain: {props.chain}</li>
          
        </Tooltip>
    );


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
            const transactionsByFee = await orderTransactions.sort((a, b) => parseInt(b.fee) - parseInt(a.fee));
            // console.log(transactionsByFee)
            const transactionsArray = await Promise.all(transactionsByFee.map(async (transaction) => {
                let { from, to, fee, amount, chain} = transaction;

                let chainIndex = chains["chains"].findIndex((c) => c.id === chain);

                const consumerAgent = await agents["agents"].filter(agent => agent.account === from);
                let consumerUser;
                if(consumerAgent.length) consumerUser = await users["users"].filter(user => user.id === consumerAgent[0].user);
                
                
                const providerAgent = await agents["agents"].filter(agent => agent.account === to);
                let providerUser;
                if(providerAgent.length) providerUser =  await users["users"].filter(user => user.id === providerAgent[0].user);

                return (
                    {
                        id: transaction._id,
                        consumer: (!consumerAgent.length ? chains["chains"][chainIndex].name : consumerUser[0].name) ,
                        provider: (!providerAgent.length ? chains["chains"][chainIndex].name : providerUser[0].name) ,
                        price: amount,
                        fee: fee,
                        chain: chains["chains"][chainIndex].name,
                        chainId: chains["chains"][chainIndex].id,
                    }
                )
                
            }));

            // console.log(transactionsArray)
            let chainTransactionArray = await filterDataArrayByChain(transactionsArray);

            // console.log(chainTransactionArray)
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
                    <label className={`checkbox-container-${item.chain.name.toLowerCase()}`} key={item.chain.id}>{item.chain.name}
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
                                <OverlayTrigger
                                placement="top"
                                delay={{ show: 0, hide: 0 }}
                                overlay={renderTooltip1(item)}
                                >
                                <tr
                                    key={item.id}
                                    data-tip data-for={item.id}
                                    style={{background: `${(item.consumer === "You") || (item.provider === "You") ? '#fffd6c' : ''}`}}
                                >
                                <td><strong>{index + 1}</strong></td>
                                    <td>
                                        {item.consumer} &#8646; {item.provider}
                                        {item.consumer === "You" ?
                                           <div   style={{position: "absolute", top: -7, right: 0, alignSelf: "end", justifyItems: "start"}} >
                                            <button
                                                className='cancel-transaction-btn'
                                                // style={{backgroundColor: "transparent", borderColor: "transparent"}}
                                                onClick={() => { ((item.consumer === "You") || (item.provider === user.name)) && setCancelTransactionModalContent({open: true, data: item})}}
                                            >
                                                <FaTimes></FaTimes>
                                            </button>
                                            </div>
                                            :''}
                                    </td>
                                    <td>{item.chain}</td>
                                    <td>{item.fee}</td>
                                </tr>       
                                </OverlayTrigger>
                                    
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