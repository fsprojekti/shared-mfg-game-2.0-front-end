import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';
import { FaTimes } from 'react-icons/fa';
import { Table } from "react-fluid-table";
import { Button } from 'react-bootstrap';

const TransactionsTable = () => {
    const context = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);
    const [checkBoxes, setCheckBoxes] = useState([{chain: context.chains["chains"][0], isChecked: true}, {chain: context.chains["chains"][1], isChecked: true}]);
    const [checkBoxesOwner, setCheckBoxesOwner] = useState([{type: "My tx", isChecked: false}]);

    const HeaderCell = ({ name, style }) => {
        const cellStyle = {
          ...style
        };
      
        const textStyle = { color: "white" };
      
        return (
          <div className="header-cell" style={cellStyle}>
            <div className="header-cell-text" style={textStyle}>
              {name}
            </div>
          </div>
        );
      };


      const userRow = (row) => {      
        // console.log(row)
        // console.log(agent)
        return (
          <div >
          
            {row.index}
            <button
                className='cancel-transaction-btn'
                // style={{backgroundColor: "transparent", borderColor: "transparent"}}
                onClick={() => { context.setCancelTransactionModalContent({open: true, data: row})}}
            >
                <FaTimes></FaTimes>
        </button>
          </div>
        );
      };
    


    const columns = [
        { 
            key: "index", 
            header: "No.", 
            sortable: true,
            content: ({ row }) => (row.ownerId == context.agent.account ? userRow(row) : row.index) 
        },
        { 
            key: "owner", 
            header: "Owner", 
            sortable: true,
        },
        { key: "type", header: "Type", sortable: true },
        { key: "chain", header: "Chain", sortable: true },
        { key: "fee", header: "Fee", sortable: true },
      ].map(c => ({
        ...c,
        header: props => <HeaderCell name={c.header} {...props} />
      }));


    //   const rowStyle = index => ({
    //     backgroundColor: (tableDataArray[index].owner == agent.account ? "#f0c808" : (index % 2 === 0 ? "#f0f3f5" : "#white") ),
    //   });


    const selectOne = async (e) => {
        // console.debug(e)
        let itemName = e.target.name;
        let checked = e.target.checked;

        let newArray = checkBoxes.map(item =>
            item.chain.name === itemName ? { ...item, isChecked: checked } : { ...item }
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

    const filterDataArrayByChain = (dataArray) => {

        const checkedChains = checkBoxes.filter(item => item.isChecked);
        // console.log(checkedChains)
        const selectedChains = checkedChains.map(item => item.chain.id);
        if (!Array.isArray(selectedChains) || !selectedChains.length) {
            return [];
        }

        return dataArray.filter(data => selectedChains.includes(data.chainId));
    };

    const filterDataArrayByOwner = (dataArray) => {
        const agent = context.agent;
        const checkedBoxes = checkBoxesOwner.filter(item => item.isChecked);
        if (!Array.isArray(checkedBoxes) || !checkedBoxes.length) {
            return dataArray;
        }
        // console.log(dataArray.filter(transaction => transaction.owner === agent.account))
        return dataArray.filter(transaction => transaction.ownerId === agent.account);
    };


    

    useEffect(() => {
        // console.log(chains["chains"]);
        const renderTableData = async () => {
            // console.log(transactions)
            const transactions = context.transactions;
            const chains = context.chains;
            const agents = context.agents;
            const users = context.users;
            let orderTransactions = await transactions.filter(transaction => transaction.state == "SEND");
            const transactionsByFee = await orderTransactions.sort((a, b) => parseInt(b.fee) - parseInt(a.fee));
            // console.log(transactionsByFee)
            const transactionsArray = await Promise.all(transactionsByFee.map(async (transaction, index) => {
                let { from, to, fee, amount, chain, owner} = transaction;

                let chainIndex = chains["chains"].findIndex((c) => c.id === chain);

                const consumerAgent = await agents["agents"].filter(agent => agent.account === from);
                let consumerUser;
                if(consumerAgent.length) consumerUser = await users["users"].filter(user => user.id === consumerAgent[0].user);

                const providerAgent = await agents["agents"].filter(agent => agent.account === to);
                let providerUser;
                if(providerAgent.length) providerUser = await users["users"].filter(user => user.id === providerAgent[0].user);
                
                
                const ownerAgent = await agents["agents"].filter(agent => agent.account === owner);
                let ownerUser;
                if(ownerAgent.length) ownerUser =  await users["users"].filter(user => user.id === ownerAgent[0].user);

                return (
                    {
                        id: transaction.id,
                        index: index+1,
                        consumer: (!consumerAgent.length ? chains["chains"][chainIndex].name : consumerUser[0].name) ,
                        provider: (!providerAgent.length ? chains["chains"][chainIndex].name : providerUser[0].name) ,
                        // both: `${(!consumerAgent.length ? chains["chains"][chainIndex].name : consumerUser[0].name)} 🔁 ${(!providerAgent.length ? chains["chains"][chainIndex].name : providerUser[0].name)}`,
                        price: amount,
                        fee: fee.toString(),
                        chain: chains["chains"][chainIndex].name,
                        chainId: chains["chains"][chainIndex].id,
                        owner: ownerUser[0].name,
                        ownerId: ownerAgent[0].account,
                        type: transaction.type,
                    }
                )
                
            }));

            // console.log(transactionsArray)
            const chainTransactionArray = await filterDataArrayByChain(transactionsArray);
            const filteredTransactionsArrayByOwner= await filterDataArrayByOwner(chainTransactionArray);

            setTableDataArray(filteredTransactionsArrayByOwner);
        };
        renderTableData();

    }, [context.transactions, checkBoxes, checkBoxesOwner]);



    return (
        <>
            <div className="pending-transactions-container">
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
                        ))
                }
                <div className="d-block" style={{position: "relative", margin: "10px"}}>
                    <b > Owner: </b>
                </div>
                        {
                        checkBoxesOwner.map((item) => (
                            <label className="checkbox-container" key={item.type}>{item.type}
                                <input type="checkbox" name={item.type} checked={item.isChecked} onChange={selectOwner}/>
                                <span className="checkmark"></span>
                            </label>
                        ))
                    }
                </div>
                <div className="table-pending-transactions-container">
                    <Table 
                    data={tableDataArray} 
                    columns={columns} 
                    className="table-all-transactions"
                    // rowStyle={rowStyle}
                    headerStyle={{border: "1px solid #d9dddd", flex: "1 1 auto", backgroundImage: "linear-gradient(#7c8a9e, #616f83)"}}
                    />
                </div>
            </div>
        </>
    )
};

export default TransactionsTable