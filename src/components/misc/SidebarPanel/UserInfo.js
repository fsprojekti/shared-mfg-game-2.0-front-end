import {Col, Card, Button} from "react-bootstrap";

import {IconContext} from "react-icons";
import {
    FaChartPie,
    FaBusinessTime,
    FaMoneyBillAlt
} from 'react-icons/fa';

import { AppContext } from "../../../context/context";
import CreateOrderModal from "./CreateOrderModal";
import MiningBar from "../BlockchainPanel/MiningBar";

import {useState, useContext, useEffect, useReducer} from "react";





const UserInfo = () => {

    const { game, chains, user, activeChain, cookies, orders, usersBalances, usersStakes, servicesAll, services, service} = useContext(AppContext);


    const [orderExists, setOrderExists] = useState(false);
    const [relativeStake, setRelativeStake] = useState(0);
    const [otherServices, setOtherServices] = useState(["Service1","Service2"]);
    const [numOfService1, setNumOfService1] = useState(0);
    const [numOfService2, setNumOfService2] = useState(0);
    const [orderModal, setOrderModal] = useState({
        show: false,
    })

    const serviceState = (service) => {
        switch(service.state) {
            case "IDLE" || "DONE":
                return  <Button className="create-order-btn" class="btn btn-primary btn-lg" onClick={openCreateOrderModal}>Set Price</Button>;
            case "MARKET": 
                return <Button class="btn btn-info btn" onClick={openCreateOrderModal}><b>UPDATE PRICE</b></Button>;
            case "ACTIVE": 
                switch(service.type) {
                    case "PROGRAMMING":
                        return <h4 style={{color: "forestgreen", fontSize: "18px", fontWeight: "bold"}}> 👩‍💻 ACTIVE 👩‍💻</h4>; 
                    case "MECHANICAL": 
                        return <h4 style={{color: "forestgreen", fontSize: "18px", fontWeight: "bold"}}> 👩‍🔧 ACTIVE 👨‍🔧</h4>; 
                    case "ELECTRICAL": 
                        return <h4 style={{color: "forestgreen", fontSize: "18px", fontWeight: "bold"}}> ⚡ ACTIVE 💡</h4>; 
                }
            default:
                return "";
        }
    };

    const orderNotExists = async () => {
        const order = user.orders.filter(item => item.provider === user._id);
        setOrderExists(!Array.isArray(order) || !order.length);
    };

    const openCreateOrderModal = () => {
        setOrderModal({
            show: true,
        });
    };
    
    useEffect(() => {
        //Ta render ne dela pravilno ob spremembi chaina. Moreš prešaltat na drugo stran, da je prav. 
        // console.log(usersStakes[chains[cookies.activeChain].name])
        // console.log(chains[cookies.activeChain])

        if(chains.length > 0) { 
            if (chains[cookies.activeChain].stake == 0 ||  chains[cookies.activeChain].stake == undefined) {
                setRelativeStake(0);
            } else {
                setRelativeStake(((usersStakes[chains[cookies.activeChain].name] / chains[cookies.activeChain].stake) * 100).toFixed(1));
            } 
        } else {
            setRelativeStake(0);
        }

        const getOtherServiceTypes = async () => {
            let uniqueService = [...new Set(servicesAll.map(item => item.type))];
            uniqueService = uniqueService.filter(item => item !== service.type);
            setOtherServices(uniqueService)
            const filledOrders = await services.filter(service => service.state === "DONE");


            let numOfFirst = filledOrders.filter(order => order.type === uniqueService[0]);
            let numOfSecond = filledOrders.filter(order => order.type === uniqueService[1]);

            setNumOfService1(numOfFirst.length);
            setNumOfService2(numOfSecond.length);

        };
        getOtherServiceTypes();

    }, [user, chains, activeChain]);

    return (

        <div className="d-flex flew-column">

        <IconContext.Provider value={{color: "black", size: "20px"}}>

       

        <div className="d-flex flex-column overflow-hidden" style={{marginTop: "5%", borderRadius: "5px", width: "100%", boxShadow: "var(--dark-shadow)", zIndex: 1}}>
        
        {/* , boxShadow: "var(--dark-shadow)" */}
            <div className="d-flex " style={{zIndex: 2, position: "absolute", flexWrap: "wrap",  borderRadius: "10px", maxWidth: "400px", backgroundColor: "rgba(251, 170, 12)", alignSelf: "center"}}>
                <CreateOrderModal 
                    show={orderModal.show}
                    reportHide={() => {
                                    setOrderModal({...(orderModal.show = false)});
                                }}
                    />
            </div>

            
            {/* <h4 className="d-flex flex-column" style={{backgroundColor: "#FFBF00", textAlign: "center", marginBottom: "2px", paddingBottom: "2px"}}> { chains.length < 1  ? "null" : chains[activeChain].name  } </h4>  */}
            
            <div style={{justifyContent: "space-around", width: "100%", alignItems: "center", padding: "5px", zIndex: 1}}>
            
                <MiningBar showText="false" version="-side" />  
                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                    <FaMoneyBillAlt style={{color: "green", fontSize: "22px"}}/>
                    <h4>{Object.keys(usersBalances).length !== 0  ?  usersBalances[activeChain][`${chains[activeChain].name}`] : 0}</h4>
                    {/* {console.log(user.balance)} */}
                </div>  
                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                    <FaChartPie style={{color: "#ffba72", fontSize: "22px"}}/>
                    <h4>{Object.keys(usersStakes).length !== 0  ?  usersStakes[`${chains[activeChain].name}`] : 0} ({relativeStake}%)</h4>
                </div>
                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                    <FaBusinessTime style={{color: "#38aaff", fontSize: "22px"}}/>
                    {serviceState(service)}
                    
                </div>
                <hr />

                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                    <h4>Number of upgrades: {user.upgradeNumber}</h4>
                </div>
                
                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                    <div className={`${(numOfService1 > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                        <h4>{otherServices[0]}</h4>
                    </div>
                    <div className={`${(numOfService1 > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                        <h4>{numOfService1}</h4>
                    </div>
                </div>
                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                    <div className={`${(numOfService2 > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                        <h4>{otherServices[1]}</h4>
                    </div>
                    <div className={`${(numOfService2 > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                        <h4>{numOfService2}</h4>
                    </div>
                </div>        
                    
            </div>
            

            </div>
        </IconContext.Provider>

        </div>
        

    )
}

export default UserInfo;