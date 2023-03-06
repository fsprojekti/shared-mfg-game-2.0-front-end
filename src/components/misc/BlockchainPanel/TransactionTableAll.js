import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Table } from "react-fluid-table";
import { Button, Card, ToggleButton} from 'react-bootstrap';
import { MdRefresh } from "react-icons/md";




const AllTransactionsTable = () => {
    const context = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);
    const [checkBoxes, setCheckBoxes] = useState([{type: "Programming", isChecked: false}, {type: "Electrical", isChecked: false}, {type: "Mechanical", isChecked: false}, {type: "Stake", isChecked: false}, {type: "Un-stake", isChecked: false},{type: "Bridge", isChecked: false}, {type: "Attack", isChecked: false}]);
    const [checkBoxesOwner, setCheckBoxesOwner] = useState([{type: "My tx", isChecked: false}]);
    const [chainCheckBoxes, setChainCheckBoxes] = useState([{chain: context.chains["chains"][0], isChecked: true}, {chain: context.chains["chains"][1], isChecked: true}]);
    const [refresh, setRefresh] = useState({refresh: false});
    const label = { inputProps: { 'aria-label': 'Switch demo' } };


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

    const selectOwner = async (e) => {
        // console.debug(e)
        let itemName = e.target.name;
        let checked = e.target.checked;
        const newArray = checkBoxesOwner.map(item =>
            item.type === itemName ? { ...item, isChecked: checked } : item
        );
        setCheckBoxesOwner(newArray);
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

        if (selectedTypes.includes("ATTACK")) {
            selectedTypes.push("ATTACK-GAIN");
            selectedTypes.push("ATTACK-LOSS-STAKE");
            selectedTypes.push("ATTACK-LOSS-BALANCE");
        }

        return dataArray.filter(data => selectedTypes.includes(data.type));
    };

    const filterDataArrayByChain = (dataArray) => {

        const checkedChains = chainCheckBoxes.filter(item => item.isChecked);
        const selectedChains = checkedChains.map(item => item.chain.id);
        if (!Array.isArray(selectedChains) || !selectedChains.length) {
            console.log("no chains selected")
            return [];
        }

        return dataArray.filter(data => selectedChains.includes(data.chain));
    };

    const filterDataArrayByOwner = (dataArray) => {
        const agent = context.agent;
        const checkedBoxes = checkBoxesOwner.filter(item => item.isChecked);
        if (!Array.isArray(checkedBoxes) || !checkedBoxes.length) {
            return dataArray;
        }
        // console.log(dataArray.filter(transaction => transaction.owner === agent.account))
        return dataArray.filter(transaction => transaction.owner === agent.account);
    };

    useEffect(() => {
        const renderTableData = async () => {
            const transactions = context.transactions;
            const chains = context.chains;
            const agents = context.agents;
            const users = context.users;

            const minedTransactions = await transactions.filter(transaction => transaction.state == "MINED");
            
            const transactionsArray = await Promise.all(minedTransactions.map(async (transaction) => {
                let { from, to, fee, amount} = transaction;


                let consumerAgent = await agents["agents"].filter(agent => agent.account === from);

                const chainIndex = await chains["chains"].findIndex((c) => c.id == transaction.chain);
                 
                
                
                let consumer;
                if(consumerAgent.length) consumer = await users["users"].filter(user => user.id === consumerAgent[0].user);
                
                
                let providerAgent = await agents["agents"].filter(agent => agent.account === to);

                let provider;
                if(providerAgent.length) provider = await users["users"].filter(user => user.id === providerAgent[0].user);

                if(chainIndex != -1) {
                    return {
                        id: transaction.id,
                        consumer: (!consumerAgent.length ? chains["chains"][chainIndex].name : consumer[0].name) ,
                        consumerId: (!consumerAgent.length ? chains["chains"][chainIndex].name : consumer[0].id) ,
                        provider: (!providerAgent.length ? chains["chains"][chainIndex].name : provider[0].name) ,
                        providerId: (!providerAgent.length ? chains["chains"][chainIndex].name : provider[0].id) ,
                        owner:transaction.owner,
                        amount: amount.toString(),
                        fee: fee.toString(),
                        type: (transaction.type === "SERVICE" ? providerAgent[0].type : transaction.type),
                        chain: transaction.chain,
                        chainName: chains["chains"][chainIndex].name,
                        timestamp: new Date(transaction.timestamp).toLocaleTimeString("it-IT"),
                    }
                } else { 
                    console.debug("chain not found");
                    console.debug(transaction);

            }


                


                
            }));
            const filteredTransactionsArrayByType = await filterDataArrayByType(transactionsArray);
            const filteredTransactionsArrayByChain= await filterDataArrayByChain(filteredTransactionsArrayByType);
            const filteredTransactionsArrayByOwner= await filterDataArrayByOwner(filteredTransactionsArrayByChain);

            // console.log(filteredTransactionsArrayByOwner)

            setTableDataArray(filteredTransactionsArrayByOwner.reverse());
        };
        
        renderTableData();

    }, [checkBoxes, chainCheckBoxes, checkBoxesOwner, refresh]);



    return (
        <Card className='d-flex' style={{borderColor: "transparent"}}> 
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
                    {
                        checkBoxesOwner.map((item) => (
                            <label className="checkbox-container" key={item.type}>{item.type}
                                <input type="checkbox" name={item.type} checked={item.isChecked} onChange={selectOwner}/>
                                <span className="checkmark"></span>
                            </label>
                        ))
                    }
                </div>
            <div className="table-all-transactions-overflow">
            <div style={{position: "absolute", top: 5, right: 15, alignSelf: "end", justifyItems: "start"}} >
                <Button size="sm" style={{backgroundColor: "gray", borderColor: "transparent", borderRadius: "8px"}} onClick={() => { setRefresh(prevState => ({ resfresh: !prevState.refresh }));}}><MdRefresh></MdRefresh></Button>
            </div>
            
             <Table 
                data={tableDataArray} 
                columns={columns} 
                tableWidth="100%"
                onSort={onSort}
                className="d-flex"
                headerStyle={{border: "1px solid #d9dddd", flex: "1 1 auto", backgroundImage: "linear-gradient(#7c8a9e, #616f83)", fontSize: "14px", color: "white", textAlign: "center", fontWeight: "lighter"}}
                />
                
            </div>
        </Card>
    )
};

export default AllTransactionsTable