import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../../context/context";


const ChainData = () => {
    const context = useContext(AppContext);
    const [transactionsLengthArray, setTransactionsLengthArray] = useState([]);

    useEffect(() => {
        const transactions = context.transactions;
        let mainChainTransactions = transactions.filter((item) => item.chain === context.chains.chains[0].id);
        let sideChainTransactions = transactions.filter((item) => item.chain === context.chains.chains[1].id);
        setTransactionsLengthArray([mainChainTransactions.length, sideChainTransactions.length]);
    }, [context.transactions]);


    return (
        <>
            <div className="d-flex justify-content-space-evenly flex-column">
                <div>
                    <div style={{height: "auto", overflow: "auto", border: '1px solid rgb(211, 211, 211)', borderRadius: "8px 8px 8px 8px"}}>
                        <table className="table-all-rankings">
                            <thead>
                            <tr key={1}>
                                <th>Chain ID</th>
                                <th>Chain Name</th>
                                <th>Block no.</th>
                                <th>Balance</th>
                                <th>Staked</th>
                                <th>Transactions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                context["chains"].chains.map((item, index) => (
                                    <tr
                                        key={item.id}
                                    >
                                        <td><strong>{index + 1}</strong></td>
                                        <td>{item.name}</td>
                                        <td>{item.blockNumber}</td>
                                        <td>{item.balance}</td>
                                        <td>{item.stake}</td>
                                        <td>{transactionsLengthArray[index]}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
};

export default ChainData