import React, {useState, useEffect, useContext} from 'react'
import { AppContext } from '../../../context/context';
import BarChart from './BarChart';
import ToggleSwitch from './ToggleSwitch';
import TradeModal from '../TradeModal';
import CancelOrderModal from '../CancelOrderModal';

const Trades = () => {
    const { game, users, orders, agents, servicesAll, service, chains, activeChain } = useContext(AppContext);
    const [dataArray1, setDataArray1] = useState([]);
    const [dataArray2, setDataArray2] = useState([]);
    const [dataArray3, setDataArray3] = useState([]);
    const [modifiedDataArray1, setModifiedDataArray1] = useState([]);
    const [modifiedDataArray2, setModifiedDataArray2] = useState([]);
    const [modifiedDataArray3, setModifiedDataArray3] = useState([]);
    const [otherServices, setOtherServices] = useState(["Service1","Service2"]);

    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    let backColor= "#ffffff";


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

    const getColor = (service) => {
        switch(service) {
            case "MECHANICAL":
                return "#db6d28";
            case "ELECTRICAL": 
                return "#388bfd";
            case "PROGRAMMING": 
                return "#a371f7";
            default:
                return "rgb(0, 0, 0)";
        }
    };


    useEffect(() => {
        console.log(orders);
        console.log(agents);
        const sortDataArrays = async () => { 
            console.log(orders);
            const placedOrders = orders.filter(order => order.chain === chains[activeChain].id  && order.state === "PLACED");   
            console.log(placedOrders);
            const placedOrdersWithPlayerData = await placedOrders.map(function(ordr){ 
                let service=servicesAll.filter(srvc=> srvc._id == ordr.service);

                ordr.serviceType=service[0].type;
                ordr.serviceDuration=service[0].duration;

                const providerAgentObject = agents.filter(agent => agent._id === service[0].agent);
                const providerClient = users["users"].filter(user => user.id === providerAgentObject[0].user);
                console.log(providerAgentObject[0])
                ordr.providerName = providerClient[0].name;
                ordr.agentId = providerAgentObject[0]._id;
                ordr.agentAccount = providerAgentObject[0].account;
                ordr.providerId = providerClient[0].id;

                return ordr
            })   
                

            let uniqueService = [...new Set(servicesAll.map(item => item.type))];
            uniqueService = uniqueService.filter(item => item !== service.type);
            setOtherServices(uniqueService)

            
            let array1 = await placedOrdersWithPlayerData.filter(item => item.serviceType === uniqueService[0]);
            let array2 = await placedOrdersWithPlayerData.filter(item => item.serviceType === uniqueService[1]);
            let array3 = await placedOrdersWithPlayerData.filter(item => item.serviceType === service.type);

            if (checked1) {
                await array1.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.serviceType);
                });
                await array1.sort((a, b) => a.serviceDuration - b.serviceDuration);
                await array1.forEach((item) => {
                    item.height = millisToFloat(item.serviceDuration);
                });
                setDataArray1(array1);

            } else {
                await array1.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.serviceType);
                });
                await array1.sort((a, b) => a.price - b.price);
                setDataArray1(array1);
            }
            if (checked2) {
                await array2.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.serviceType);
                });
                await array2.sort((a, b) => a.serviceDuration - b.serviceDuration);
                await array2.forEach((item) => {
                    item.height = millisToFloat(item.serviceDuration);
                });
                setDataArray2(array2);

            } else {
                await array2.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.serviceType);
                });
                await array2.sort((a, b) => a.price - b.price);
                setDataArray2(array2);
                
            }

            if (checked3) {
                await array3.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.serviceType);
                });
                await array3.sort((a, b) => a.serviceDuration - b.serviceDuration);
                await array3.forEach((item) => {
                    item.height = millisToFloat(item.serviceDuration);
                });
                setDataArray3(array3);
            } else {
                await array3.forEach((item) => {
                    item.price = parseInt(item.price);
                    item.color = getColor(item.serviceType);
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
            console.log(modifiedArray3)
            console.log(modifiedArray2)
            console.log(modifiedArray1)
            console.log(service)

        };
        sortDataArrays(); 

    }, [orders, checked1, checked2, checked3]);

    return (
        <>
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
                            <h3>{`${service.type}`}</h3>
                        </div>
                        <ToggleSwitch checked={checked3} onChange={handleChange3}/>
                        <div style={{ height: "300px", width: "auto", margin: "auto"}}>
                            <BarChart dataArray={dataArray3} modifiedData={modifiedDataArray3} checked={checked3}/>
                        </div>
                    </div>
                </div>


                <TradeModal/>
                <CancelOrderModal/>
            </div>
        </>
    )
};

export default Trades;