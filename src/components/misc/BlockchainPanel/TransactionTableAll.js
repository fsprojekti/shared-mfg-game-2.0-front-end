import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const AllTransactionsTable = () => {
    const { game, users, agents,  transactions, chains, activeChain} = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);
    const [sortBy, setSortBy] = useState('time');
    const [orderOfSort, setOrderOfSort] = useState('ascending');
    const [checkBoxes, setCheckBoxes] = useState([{type: "Programming", isChecked: false}, {type: "Electrical", isChecked: false}, {type: "Mechanical", isChecked: false}, {type: "Stake", isChecked: false}, {type: "Un-stake", isChecked: false},{type: "Bridge", isChecked: false}, {type: "Attack", isChecked: false}, {type: "Mine", isChecked: false}]);
    const [chainCheckBoxes, setChainCheckBoxes] = useState([{chain: chains["chains"][0], isChecked: true}, {chain: chains["chains"][1], isChecked: true}]);

    const displayTime = async (time) => {
        const createdMillis = new Date(time);
        return createdMillis.toLocaleTimeString('it-IT');
    };


    const sortDataArray = async (dataArray) => {
        if (sortBy === 'time') {
            return await dataArray.sort((a, b) => {
                let arrayA = a.timestamp.split(":");
                let timeA = (parseInt(arrayA[0], 10) * 60 * 60) + (parseInt(arrayA[1], 10) * 60) + parseInt(arrayA[2], 10);
                let arrayB = b.timestamp.split(":");
                let timeB = (parseInt(arrayB[0], 10) * 60 * 60) + (parseInt(arrayB[1], 10) * 60) + parseInt(arrayB[2], 10);
                if (orderOfSort === "descending") {
                    return timeB - timeA;
                } if (orderOfSort === "ascending") {
                    return timeA - timeB;
                }
            });
        } if (sortBy === 'consumer') {
            return await dataArray.sort((a, b) => {
                let textA = a.consumer.toUpperCase();
                let textB = b.consumer.toUpperCase();
                if (orderOfSort === "descending") {
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                } if (orderOfSort === "ascending") {
                    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                }
            });
        } if (sortBy === 'provider') {
            return await dataArray.sort((a, b) => {
                let textA = a.provider.toUpperCase();
                let textB = b.provider.toUpperCase();
                if (orderOfSort === "descending") {
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                } if (orderOfSort === "ascending") {
                    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                }
            });
            
        } if (sortBy === 'chain') {
            return await dataArray.sort((a, b) => {
                let textA = a.chainName.toUpperCase();
                let textB = b.chainName.toUpperCase();
                if (orderOfSort === "descending") {
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                } if (orderOfSort === "ascending") {
                    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                }
            });
            
        } if (sortBy === 'typeOfService') {
            return await dataArray.sort((a, b) => {
                if (orderOfSort === "descending") {
                    return (a.type < b.type) ? -1 : (a.type > b.type) ? 1 : 0;
                } if (orderOfSort === "ascending") {
                    return (a.type > b.type) ? -1 : (a.type < b.type) ? 1 : 0;
                }
            });
        } if (sortBy === 'price') {
            if (orderOfSort === "descending") {
                return await dataArray.sort((a, b) => parseInt(b.amount) - parseInt(a.amount));
            } if (orderOfSort === "ascending") {
                return await dataArray.sort((a, b) => parseInt(a.amount) - parseInt(b.amount));
            }
        } if (sortBy === 'txFee') {
            if (orderOfSort === "descending") {
                return await dataArray.sort((a, b) => parseInt(b.fee) - parseInt(a.fee));
            } if (orderOfSort === "ascending") {
                return await dataArray.sort((a, b) => parseInt(a.fee) - parseInt(b.fee));
            }
        }
    };

    const selectOne = async (e) => {
        // console.debug(e)
        let itemName = e.target.name;
        let checked = e.target.checked;
        const newArray = checkBoxes.map(item =>
            item.type === itemName ? { ...item, isChecked: checked } : item
        );
        setCheckBoxes(newArray);
    };

    const selectOneChain = async (e) => {
        // console.debug(e)
        let itemName = e.target.name;
        let checked = e.target.checked;

        let newArray = chainCheckBoxes.map(item =>
            item.chain.name === itemName ? { ...item, isChecked: checked } : { ...item }
        );

        setChainCheckBoxes(newArray);
    };

    const filterDataArrayByType = (dataArray) => {
        const checkedBoxes = checkBoxes.filter(item => item.isChecked);
        const selectedTypes = checkedBoxes.map(item => item.type.toUpperCase());
        if (!Array.isArray(selectedTypes) || !selectedTypes.length) {
            return dataArray;
        }
        if (selectedTypes.includes("BRIDGE")) {
            selectedTypes.push("BRIDGE-LOCK");
            selectedTypes.push("BRIDGE-UNLOCK");
            selectedTypes.push("BRIDGE-MINT");
            selectedTypes.push("BRIDGE-BURN");
        }

        return dataArray.filter(data => selectedTypes.includes(data.type));
    };

    const filterDataArrayByChain = (dataArray) => {

        const checkedChains = chainCheckBoxes.filter(item => item.isChecked);
        // console.log(checkedChains)
        const selectedChains = checkedChains.map(item => item.chain.id);
        if (!Array.isArray(selectedChains) || !selectedChains.length) {
            return [];
        }

        return dataArray.filter(data => selectedChains.includes(data.chain));
    };

    useEffect(() => {
        const renderTableData = async () => {
            const minedTransactions = await transactions.filter(transaction => transaction.state == "MINED");
            
            const transactionsArray = await Promise.all(minedTransactions.map(async (transaction) => {
                let { from, to, fee, amount} = transaction;


                let consumerAgent = await agents["agents"].filter(agent => agent.account === from);

                const chainIndex = await chains["chains"].findIndex((c) => c.id == transaction.chain);
                
                
                let consumer;
                if(consumerAgent.length) {
                    let consumerUser = await users["users"].filter(user => user.id === consumerAgent[0].user);
                    consumer = consumerUser[0].name;
                } else {
                    consumer = chains["chains"][activeChain].name;
                };
                
                
                let providerAgent = await agents["agents"].filter(agent => agent.account === to);
                // console.log(providerAgent)
                let provider;
                if(providerAgent.length > 0 && transaction.type !== "FEE") {
                    let providerUser = await users["users"].filter(user => user.id === providerAgent[0].user);
                    provider = providerUser[0].name;
                } else {
                    provider = chains["chains"][activeChain].name;
                };

                let d = new Date(transaction.createdAt);
                let hours = d.getHours();
                let minutes = d.getMinutes();
                let seconds = d.getSeconds();
                let time = hours + ":" + minutes + ":" + seconds;

                return {
                    id: transaction._id,
                    consumer: consumer,
                    provider: provider,
                    amount: amount,
                    fee: fee,
                    type: (transaction.type === "SERVICE" ? providerAgent[0].type : transaction.type),
                    createdAt: time,
                    chain: transaction.chain,
                    chainName: chains["chains"][chainIndex].name,
                    timestamp: new Date(transaction.timestamp).toLocaleTimeString("it-IT"),
                }


                
            }));
            const filteredTransactionsArrayByType = await filterDataArrayByType(transactionsArray);
            const filteredTransactionsArray= await filterDataArrayByChain(filteredTransactionsArrayByType);

            const dataArray = await sortDataArray(filteredTransactionsArray);
            setTableDataArray(dataArray.reverse());
        };
        
        renderTableData();

    }, [checkBoxes, chainCheckBoxes, orderOfSort, transactions]);



    return (
        <>
            <div >
                <div className="filter-all-transactions">                    
                    <div className="d-block" style={{position: "relative", marginLeft: "10px", marginTop: "10px", marginBottom: "10px"}}>
                        <b > Chains: </b>
                    </div>

                    {
                        chainCheckBoxes.map((item) => (
                            <label className={`checkbox-container-${item.chain.name.toLowerCase()}`} key={item.chain.id}>{item.chain.name}
                                <input type="checkbox" name={item.chain.name} checked={item.isChecked} onChange={selectOneChain}/>
                                <span className="checkmark"></span>
                            </label>
                        ))
                    }
                </div>
                <div className="filter-all-transactions">
                     <div className="d-block" style={{position: "relative", margin: "10px"}}>
                        <b > Types: </b>
                    </div>
                    {
                        checkBoxes.map((item) => (
                            <label className="checkbox-container" key={item.type}>{item.type}
                                <input type="checkbox" name={item.type} checked={item.isChecked} onChange={selectOne}/>
                                <span className="checkmark"></span>
                            </label>
                        ))
                    }
                </div>
                <div className="table-all-transactions-overflow">
                    <table className="table-all-transactions">
                        <thead>
                        <tr>
                            <th onClick={() => {
                                setSortBy('time');
                                if (orderOfSort === 'ascending') {
                                    setOrderOfSort('descending');
                                } if (orderOfSort === 'descending') {
                                    setOrderOfSort('ascending');
                                }
                            }}>Time {sortBy === 'time' ? orderOfSort === 'ascending' ? <FaArrowUp/> : <FaArrowDown/> : ""}</th>
                            <th onClick={() => {
                                setSortBy('consumer');
                                if (orderOfSort === 'ascending') {
                                    setOrderOfSort('descending');
                                } if (orderOfSort === 'descending') {
                                    setOrderOfSort('ascending');
                                }
                            }}>From {sortBy === 'consumer' ? orderOfSort === 'ascending' ? <FaArrowUp/> : <FaArrowDown/> : ""}</th>
                            <th onClick={() => {
                                setSortBy('provider');
                                if (orderOfSort === 'ascending') {
                                    setOrderOfSort('descending');
                                } if (orderOfSort === 'descending') {
                                    setOrderOfSort('ascending');
                                }
                            }}>To {sortBy === 'provider' ? orderOfSort === 'ascending' ? <FaArrowUp/> : <FaArrowDown/> : ""}</th>
                            <th onClick={() => {
                                setSortBy('chain');
                                if (orderOfSort === 'ascending') {
                                    setOrderOfSort('descending');
                                } if (orderOfSort === 'descending') {
                                    setOrderOfSort('ascending');
                                }
                            }}>Chain {sortBy === 'chain' ? orderOfSort === 'ascending' ? <FaArrowUp/> : <FaArrowDown/> : ""}</th>
                            <th onClick={() => {
                                setSortBy('typeOfService');
                                if (orderOfSort === 'ascending') {
                                    setOrderOfSort('descending');
                                } if (orderOfSort === 'descending') {
                                    setOrderOfSort('ascending');
                                }
                            }}>Type {sortBy === 'typeOfService' ? orderOfSort === 'ascending' ? <FaArrowUp/> : <FaArrowDown/> : ""}</th>
                            <th onClick={() => {
                                setSortBy('price');
                                if (orderOfSort === 'ascending') {
                                    setOrderOfSort('descending');
                                } if (orderOfSort === 'descending') {
                                    setOrderOfSort('ascending');
                                }
                            }}>Price/Amount {sortBy === 'price' ? orderOfSort === 'ascending' ? <FaArrowUp/> : <FaArrowDown/> : ""}</th>
                            <th onClick={() => {
                                setSortBy('txFee');
                                if (orderOfSort === 'ascending') {
                                    setOrderOfSort('descending');
                                } if (orderOfSort === 'descending') {
                                    setOrderOfSort('ascending');
                                }
                            }}>Fee {sortBy === 'txFee' ? orderOfSort === 'ascending' ? <FaArrowUp/> : <FaArrowDown/> : ""}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            tableDataArray.map((item) =>
                                (
                                    <tr key={item.id}>
                                        <td >{item.timestamp}</td>
                                        <td >{item.consumer}</td>
                                        <td >{item.provider}</td>
                                        <td >{(item.chainName)}</td>
                                        <td >{item.type}</td>
                                        <td >{item.amount}</td>
                                        <td >{item.fee}</td>
                                    </tr>
                                )
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
};

export default AllTransactionsTable