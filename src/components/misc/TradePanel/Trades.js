import React, {useState, useEffect, useContext} from 'react'
import { AppContext } from '../../../context/context';
import BarChart from './BarChart';
import ToggleSwitch from './ToggleSwitch';
import TradeModal from '../TradeModal';

const Trades = () => {
    const context = useContext(AppContext);
    const [dataArray1, setDataArray1] = useState([]);
    const [dataArray2, setDataArray2] = useState([]);
    const [dataArray3, setDataArray3] = useState([]);
    const [modifiedDataArray1, setModifiedDataArray1] = useState([]);
    const [modifiedDataArray2, setModifiedDataArray2] = useState([]);
    const [modifiedDataArray3, setModifiedDataArray3] = useState([]);
    const [otherServices, setOtherServices] = useState(["Service1","Service2"]);
    const [checkBoxes, setCheckBoxes] = useState([{chain: context.chains["chains"][0], isChecked: true}, {chain: context.chains["chains"][1], isChecked: true}]);

    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    let backColor= "#ffffff";

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

        return dataArray.filter(data => selectedChains.includes(data.chain));
    };



    const handleChange1 = nextChecked => {
        setChecked1(nextChecked);
    };

    const handleChange2 = nextChecked => {
        setChecked2(nextChecked);
    };

    const handleChange3 = nextChecked => {
        setChecked3(nextChecked);
    };

    const millisToFloat = (millis) => {
        const time = millis/60000;
        return time.toFixed(2);
    };

    const getColor = (chainName) => {
        switch(chainName) {
            case context.chains["chains"][0].name:
                return "#EC8F48";
            case context.chains["chains"][1].name: 
                return "#73bcd4";
            default:
                return "rgb(32, 123, 211)";
        }
    };


    useEffect(() => {
        const sortDataArrays = async () => { 
            // console.log(orders);
            const orders = await context.orders;
            const servicesAll = await context.servicesAll;
            const chains = await context.chains;
            const agents = await context.agents;
            const users = await context.users;
            const service = await context.service;
            let placedOrders = await orders.filter(order => order.state === "PLACED");

            const placedOrdersWithPlayerData = await placedOrders.map(function(ordr){ 
                let service=servicesAll["services"].filter(srvc=> srvc._id == ordr.service);
                
                ordr.serviceDuration=service[0].duration.toFixed(2);

                let chain = chains["chains"].filter(chain => chain.id === ordr.chain);

                const providerAgentObject = agents["agents"].filter(agent => agent._id === service[0].agent);
                const providerClient = users["users"].filter(user => user.id === providerAgentObject[0].user);
                ordr.serviceType=providerAgentObject[0].type;
                ordr.providerName = providerClient[0].name;
                ordr.agentId = providerAgentObject[0]._id;
                ordr.agentAccount = providerAgentObject[0].account;
                ordr.providerId = providerClient[0].id;
                ordr.chainName = chain[0].name;
                ordr.chainId = chain[0].id;

                return ordr
            })   
            
            const placedOrdersWithPlayerDataByChain = await filterDataArrayByChain(placedOrdersWithPlayerData);

            let uniqueService = [...new Set(servicesAll["services"].map(item => item.type))];
            uniqueService = uniqueService.filter(item => item !== service.type);
            setOtherServices(uniqueService)

            
            let array1 = await placedOrdersWithPlayerDataByChain.filter(item => item.serviceType === uniqueService[0]);
            let array2 = await placedOrdersWithPlayerDataByChain.filter(item => item.serviceType === uniqueService[1]);
            let array3 = await placedOrdersWithPlayerDataByChain.filter(item => item.serviceType === service.type);
            // console.log(array1)
            // console.log(array2)
            // console.log(array3)

            if (checked1) {
                await array1.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.chainName);
                });
                await array1.sort((a, b) => a.serviceDuration - b.serviceDuration);
                await array1.forEach((item) => {
                    item.height = millisToFloat(item.serviceDuration);
                });
                setDataArray1(array1);

            } else {
                await array1.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.chainName);
                });
                await array1.sort((a, b) => a.price - b.price);
                setDataArray1(array1);
            }
            if (checked2) {
                await array2.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.chainName);
                });
                await array2.sort((a, b) => a.serviceDuration - b.serviceDuration);
                await array2.forEach((item) => {
                    item.height = millisToFloat(item.serviceDuration);
                });
                setDataArray2(array2);

            } else {
                await array2.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.chainName);
                });
                await array2.sort((a, b) => a.price - b.price);
                setDataArray2(array2);
                
            }

            if (checked3) {
                await array3.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.chainName);
                });
                await array3.sort((a, b) => a.serviceDuration - b.serviceDuration);
                await array3.forEach((item) => {
                    item.height = millisToFloat(item.serviceDuration);
                });
                setDataArray3(array3);
            } else {
                await array3.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.chainName);
                });
                await array3.sort((a, b) => a.price - b.price);
                setDataArray3(array3);
            }
            //Kaj naredi to: ???
            let modifiedArray1 = await array1.map((item) => {
               if (item.price < 1) {
                   return {...item, price: 0.9};
               } else {
                   return {...item};
               }
            });
            let modifiedArray2 = await array2.map((item) => {
                if (item.price < 1) {
                    return {...item, price: 0.9};
                } else {
                    return {...item};
                }
            });
            let modifiedArray3 = await array3.map((item) => {
                if (item.price < 1) {
                    return {...item, price: 0.9};
                } else {
                    return {...item};
                }
            });
            setModifiedDataArray1(modifiedArray1);
            setModifiedDataArray2(modifiedArray2);
            setModifiedDataArray3(modifiedArray3);
            // console.log(array1);
            // console.log(array2);
            // console.log(array3);

        };
        sortDataArrays(); 

    }, [context.orders, checked1, checked2, checked3, checkBoxes, context.servicesAll["services"]]);

    return (
        <>  

                <div className="filter-all-transactions">                    
                    <div className="d-block" style={{position: "relative", margin: "10px"}}>
                        <b > Chains: </b>
                    </div>

                    {
                        checkBoxes.map((item) => (
                            <label className={`checkbox-container-${item.chain.name.toLowerCase()}`} key={item.chain.id}>{item.chain.name}
                                <input type="checkbox" name={item.chain.name} checked={item.isChecked} onChange={selectOne}/>
                                <span className="checkmark"></span>
                            </label>
                        ))
                    }
                </div>

            <div className="d-flex flex-row flex-wrap" style={{zIndex: 2}}>

                <div style={{width: "35vw", maxWidth: "100%", boxShadow: "var(--light-shadow)", borderRadius: "8px", margin: "5px", background: backColor }}>
                    <div style={{ textAlign: "center", paddingTop: "7px"}}>
                        <h3>{otherServices[0]}</h3>
                    </div>
                    <ToggleSwitch checked={checked1} onChange={handleChange1}/>
                    <div style={{ height: "300px", width: "auto", margin: "auto"}}>
                        <BarChart dataArray={dataArray1} modifiedData={modifiedDataArray1} checked={checked1}/>
                    </div>
                </div>
                <div style={{width: "35vw",boxShadow: "var(--light-shadow)", borderRadius: "8px", margin: "5px", background: backColor}}>
                    <div style={{ textAlign: "center", paddingTop: "7px"}}>
                        <h3>{`${otherServices[1]}`}</h3>
                    </div>
                    <ToggleSwitch checked={checked2} onChange={handleChange2}/>
                    <div style={{ height: "300px", width: "auto", margin: "auto"}}>
                        <BarChart dataArray={dataArray2} modifiedData={modifiedDataArray2} checked={checked2}/>
                    </div>
                </div>

                <div >
                    <div style={{width: "35vw",boxShadow: "var(--light-shadow)", borderRadius: "8px", margin: "5px", background: backColor}}>
                        <div style={{ textAlign: "center", paddingTop: "7px"}}>
                            <h3>{`${context.service.type}`}</h3>
                        </div>
                        <ToggleSwitch checked={checked3} onChange={handleChange3}/>
                        <div style={{ height: "300px", width: "auto", margin: "auto"}}>
                            <BarChart dataArray={dataArray3} modifiedData={modifiedDataArray3} checked={checked3}/>
                        </div>
                    </div>
                </div>


                <TradeModal/>
            </div>
        </>
    )
};

export default Trades;