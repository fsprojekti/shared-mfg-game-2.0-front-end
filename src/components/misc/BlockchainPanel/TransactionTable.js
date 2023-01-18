import React, {useState, useEffect, useContext} from 'react';
import ReactTooltip from 'react-tooltip';
import { AppContext } from '../../../context/context';
import { FaTimes } from 'react-icons/fa';
import MiningBar from './MiningBar';


const TransactionsTable = () => {
    const { game, user, users, agents,  chainMain, openConfirmModal, setConfirmModalContent, transactions, chains, activeChain} = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);
    const [timeLeft, setTimeLeft] = useState('');
    const [width, setWidth] = useState(0);

    function millisToMinutesAndSeconds(millis) {
        let d = new Date(1000*Math.round(millis/1000));
        if (d.getUTCMinutes() === 0) {
            return ( d.getUTCSeconds() + 's' );
        } else {
            return ( d.getUTCMinutes() + 'min ' + d.getUTCSeconds() + 's' );
        }
    }

    const setCancelTransactionModal = (transaction) => {
        setConfirmModalContent(transaction);
        openConfirmModal();
    };

    useEffect(() => {
        
        
        const renderTableData = async () => {
            console.log(transactions[chains[activeChain].name]);
            const orderTransactions = await transactions[chains[activeChain].name].filter(transaction => transaction.state == "SEND");
            console.log(orderTransactions);
            const transactionsByFee = await orderTransactions.sort((a, b) => parseInt(b.fee) - parseInt(a.fee));
            console.log(transactionsByFee);
            const transactionsArray = await Promise.all(transactionsByFee.map(async (transaction) => {
                let { from, to, fee, amount} = transaction;
                console.log(from)
                console.log(to)
                const consumerAgent = await agents.filter(agent => agent.account === from);

                const consumerUser = await users["users"].filter(user => user._id === consumerAgent[0].user);
                
                const providerAgent = await agents.filter(agent => agent.account === orderTransactions[0].to);
                console.log(providerAgent.length == 0);
                if(providerAgent.length == 0) {
                    return (
                        {
                            id: transaction._id,
                            consumer: consumerUser[0].name,
                            provider:  "Blockchain",
                            price: amount,
                            fee: fee,
                        }
                    )
                }


                const providerUser = await users["users"].filter(user => user._id === providerAgent[0].user);

                if(providerUser[0].name != undefined) {
                    return (
                        {
                            id: transaction._id,
                            consumer: consumerUser[0].name,
                            provider: providerUser[0].name,
                            price: amount,
                            fee: fee,
                        }
                    )
                }
                
            }));
            setTableDataArray(transactionsArray);
        };
        renderTableData();
        const calculateTimeLeft = async () => {
            const createdMillis = await new Date(chainMain.miningTime).getTime();
            let timeLeft = 10000 - (Date.now() - createdMillis);
            let width = await Math.floor((1 - ((Date.now() - createdMillis) / 10000)) * 100);
            if (width < 0 || timeLeft < 0) {
                width = 0;
                timeLeft = 0;
            }
            setTimeLeft(millisToMinutesAndSeconds(timeLeft));
            setWidth(width);
        };
        calculateTimeLeft();
    }, [game]);


    return (
        <>
            <div className="pending-transactions-container">
                <MiningBar/>
                <div className="table-pending-transactions-container">
                    <table className="table-pending-transactions">
                        <thead>
                        <tr>
                            <th className="table-pending-transactions-head">No.</th>
                            <th className="table-pending-transactions-head">Pending transactions on {chains[activeChain].name} chain</th>
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
                                    <td>{item.fee}</td>
                                    <td className="table-pending-transactions-tooltip">
                                        <ReactTooltip id={item.id} place="bottom" type="dark" effect="solid">
                                            <ul>
                                                <li>Consumer: {item.consumer}</li>
                                                <li>Provider: {item.provider}</li>
                                                <li>typeOfService: {item.typeOfService}</li>
                                                <li>price: {item.price}</li>
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