import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Table } from "react-fluid-table";
import { Button, Card} from 'react-bootstrap';
import { GiRecycle } from 'react-icons/gi';
import { MdRefresh } from "react-icons/md";




const AllTransactionsTable = () => {
    const { users, agents,  transactions, chains, activeChain} = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);
    const [checkBoxes, setCheckBoxes] = useState([{type: "Programming", isChecked: false}, {type: "Electrical", isChecked: false}, {type: "Mechanical", isChecked: false}, {type: "Stake", isChecked: false}, {type: "Un-stake", isChecked: false},{type: "Bridge", isChecked: false}, {type: "Attack", isChecked: false}, {type: "Mine", isChecked: false}]);
    const [chainCheckBoxes, setChainCheckBoxes] = useState([{chain: chains["chains"][0], isChecked: true}, {chain: chains["chains"][1], isChecked: true}]);
    const [refresh, setRefresh] = useState({refresh: false});


    const HeaderCell = ({ name, sortDirection, style, onClick }) => {
        const icon = !sortDirection ? null : ( (sortDirection === "ASC") ? <FaArrowUp color='white'/> : <FaArrowDown color='white'/> );
        // console.log(sortDirection)
        const cellStyle = {
          background: !!sortDirection ? "#f0c808" : undefined,
          ...style
        };
      
        const textStyle = { color: !!sortDirection ? "rgb(249, 38, 114)" : "white" };
      
        return (
          <div className="header-cell" onClick={onClick} style={cellStyle}>
            <div className="header-cell-text" style={textStyle}>
              {name}
            </div>
            {icon}
          </div>
        );
      };

    const columns = [
        { key: "timestamp", header: "Time", sortable: true },
        { key: "provider", header: "From", sortable: true},
        { key: "consumer", header: "To", sortable: true },
        { key: "type", header: "Type",  sortable: true },
        { key: "chainName", header: "Chain", sortable: true },
        { key: "amount", header: "Amount", sortable: true },
        { key: "fee", header: "Fee", sortable: true },
      ].map(c => ({
        ...c,
        header: props => <HeaderCell name={c.header} {...props} />
      }));


    const sortDataArray = async (dataArray, sortBy, order) => {
        if (sortBy === 'timestamp') {
            return await dataArray.sort((a, b) => {
                let arrayA = a.timestamp.split(":");
                let timeA = (parseInt(arrayA[0], 10) * 60 * 60) + (parseInt(arrayA[1], 10) * 60) + parseInt(arrayA[2], 10);
                let arrayB = b.timestamp.split(":");
                let timeB = (parseInt(arrayB[0], 10) * 60 * 60) + (parseInt(arrayB[1], 10) * 60) + parseInt(arrayB[2], 10);
                if (order === "DESC") {
                    return timeB - timeA;
                } if (order === "ASC") {
                    return timeA - timeB;
                }
            });
        } if (sortBy === 'consumer') {
            return await dataArray.sort((a, b) => {
                let textA = a.consumer.toUpperCase();
                let textB = b.consumer.toUpperCase();
                if (order === "DESC") {
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                } if (order === "ASC") {
                    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                }
            });
        } if (sortBy === 'provider') {
            return await dataArray.sort((a, b) => {
                let textA = a.provider.toUpperCase();
                let textB = b.provider.toUpperCase();
                if (order === "DESC") {
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                } if (order === "ASC") {
                    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                }
            });
            
        } if (sortBy === 'chainName') {
            return await dataArray.sort((a, b) => {
                let textA = a.chainName.toUpperCase();
                let textB = b.chainName.toUpperCase();
                if (order === "DESC") {
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                } if (order === "ASC") {
                    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                }
            });
            
        } if (sortBy === 'type') {
            return await dataArray.sort((a, b) => {
                if (order === "DESC") {
                    return (a.type < b.type) ? -1 : (a.type > b.type) ? 1 : 0;
                } if (order === "ASC") {
                    return (a.type > b.type) ? -1 : (a.type < b.type) ? 1 : 0;
                }
            });
        } if (sortBy === 'amount') {
            if (order === "DESC") {
                return await dataArray.sort((a, b) => parseInt(b.amount) - parseInt(a.amount));
            } if (order === "ASC") {
                return await dataArray.sort((a, b) => parseInt(a.amount) - parseInt(b.amount));
            }
        } if (sortBy === 'fee') {
            if (order === "DESC") {
                return await dataArray.sort((a, b) => parseInt(b.fee) - parseInt(a.fee));
            } if (order === "ASC") {
                return await dataArray.sort((a, b) => parseInt(a.fee) - parseInt(b.fee));
            }
        }
        
    };


    const onSort = async (col, dir) => {
        console.log(col, dir);
        const dataArrayOld = tableDataArray;
        let dataArray;
        if (col != null) dataArray  = await sortDataArray(dataArrayOld, col, dir);
        else dataArray = await sortDataArray(dataArrayOld, "timestamp", "DESC");
        setTableDataArray(dataArray);
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
                    amount: amount.toString(),
                    fee: fee.toString(),
                    type: (transaction.type === "SERVICE" ? providerAgent[0].type : transaction.type),
                    createdAt: time,
                    chain: transaction.chain,
                    chainName: chains["chains"][chainIndex].name,
                    timestamp: new Date(transaction.timestamp).toLocaleTimeString("it-IT"),
                }


                
            }));
            const filteredTransactionsArrayByType = await filterDataArrayByType(transactionsArray);
            const filteredTransactionsArray= await filterDataArrayByChain(filteredTransactionsArrayByType);

            setTableDataArray(filteredTransactionsArray.reverse());
        };
        
        renderTableData();

    }, [checkBoxes, chainCheckBoxes, refresh]);



    return (
        <Card> 
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
            <div style={{position: "absolute", top: 0, right: 0, alignSelf: "end", justifyItems: "start"}} >
                <Button size="sm" style={{backgroundColor: "gray", borderColor: "transparent"}} onClick={() => { setRefresh(prevState => ({ resfresh: !prevState.refresh }));}}><MdRefresh></MdRefresh></Button>
            </div>
            
             <Table 
                data={tableDataArray} 
                columns={columns} 
                onSort={onSort}
                className="table-all-transactions"
                headerStyle={{border: "1px solid #d9dddd", flex: "1 1 auto", backgroundImage: "linear-gradient(#7c8a9e, #616f83)"}}
                />
                
            </div>
        </Card>
    )
};

export default AllTransactionsTable