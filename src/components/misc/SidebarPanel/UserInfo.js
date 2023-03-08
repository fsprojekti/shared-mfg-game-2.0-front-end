import {Col, Row, Button, CloseButton} from "react-bootstrap";

import {IconContext} from "react-icons";
import {
    FaChartPie,
    FaMoneyBillAlt
} from 'react-icons/fa';

import { AppContext } from "../../../context/context";
import MiningBar from "../BlockchainPanel/MiningBar";

import {useState, useContext, useEffect, useReducer} from "react";
import {OverlayTrigger} from "react-bootstrap";
import {Tooltip} from "react-bootstrap";





const UserInfo = () => {

    const { chains, setCookie, updateActiveChain, user, activeChain, usersBalances, usersStakes, servicesAll, services, service, stakeIndex, setStakeIndex, setIsCreateOrderModalOpen, setIsCancelUserOrderModalOpen} = useContext(AppContext);

    const [relativeStake, setRelativeStake] = useState(0);
    const [otherServices, setOtherServices] = useState(["Service1","Service2"]);
    const [numOfService1, setNumOfService1] = useState(0);
    const [numOfService2, setNumOfService2] = useState(0);
    const renderTooltip1 = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          <h5> {relativeStake.stake1} %</h5>
        </Tooltip>
    );

    const renderTooltip2 = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          <h5> {relativeStake.stake2} %</h5>
        </Tooltip>
    );

    const serviceState = (service) => {
        switch(service.state) {
            case "IDLE":
                return ( 
                    <div>
                        <Button className="create-order-btn" variant="btn btn-primary" onClick={() =>  setIsCreateOrderModalOpen({open: true, mode: "set"})}>Set Price</Button> 
                    </div>
                )
            case "DONE":
                return ( 
                    <div>
                        <Button className="create-order-btn" variant="btn btn-primary" onClick={() =>  setIsCreateOrderModalOpen({open: true, mode: "set"})}>Set Price</Button> 
                    </div>
                )
            case "MARKET": 
                return (
                    <div className="d-flex">
                        <Button variant="btn btn-warning btn" onClick={() =>  setIsCreateOrderModalOpen({open: true, mode: "update"})}><b>UPDATE PRICE</b></Button>
                        <CloseButton className="btn btn-primary btn-lg" style={{marginLeft: "1rem", backgroundColor: "#E73936", justifyContent: "center", alignItems: "center", height: "1.7rem", width: "1.7rem"}} onClick={() =>  setIsCancelUserOrderModalOpen({open: true, mode: "set"})}>
                        </CloseButton>
                    </div>
                )
            case "ACTIVE": 
                switch(service.type) {
                    case "PROGRAMMING":
                        return <h4 style={{color: "forestgreen", fontSize: "18px", fontWeight: "bold"}}> 👩‍💻 ACTIVE 👩‍💻</h4>; 
                    case "MECHANICAL": 
                        return <h4 style={{color: "forestgreen", fontSize: "18px", fontWeight: "bold"}}> 👩‍🔧 ACTIVE 👨‍🔧</h4>; 
                    case "ELECTRICAL": 
                        return <h4 style={{color: "forestgreen", fontSize: "18px", fontWeight: "bold"}}> ⚡ ACTIVE ⚡</h4>; 
                }
            default:
                return "";
        }
    };

    async function changeChain(chainId){
        setCookie("activeChain", chainId);
        updateActiveChain(chainId);
        console.log(chains.chains[chainId]);
        console.log("ACtive chain:" + chains.chains[chainId].id);
    }
    
    useEffect(() => {
        const renderStakeData = async () => {
            if(Object.keys(usersStakes).length == 0) return;

            let stakesKeys = [];
            for(let i = 0; i < Object.keys(usersStakes).length; i++) {
                stakesKeys[i] = Object.keys(usersStakes[i])[0];
            }
            let stakeIndex1 =  stakesKeys.indexOf(chains["chains"][0].name);
            let stakeIndex2 =  stakesKeys.indexOf(chains["chains"][1].name);
            setStakeIndex([stakeIndex1, stakeIndex2]);


            let stake1 = 0;
            let stake2 = 0;
            if (chains["chains"][0].stake != 0 &&  chains["chains"][0].stake != undefined) {
                stake1 = ((usersStakes[stakeIndex1][`${chains["chains"][0].name}`] / chains["chains"][0].stake) * 100).toFixed(1)
            }

            if(chains["chains"][1].stake != 0 && chains["chains"][1].stake != undefined) {
                stake2 = ((usersStakes[stakeIndex2][`${chains["chains"][1].name}`] / chains["chains"][1].stake) * 100).toFixed(1)
            } 

            setRelativeStake({stake1: stake1, stake2: stake2});
        };
        renderStakeData();

        const getOtherServiceTypes = async () => {
            let uniqueService = [...new Set(servicesAll["services"].map(item => item.type))];
            uniqueService = uniqueService.filter(item => item !== service.type);
            setOtherServices({service1: uniqueService[0], service2: uniqueService[1]});
            const filledOrders = await services["services"].filter(service => service.state === "DONE");


            let numOfFirst = filledOrders.filter(order => order.type === uniqueService[0]);
            let numOfSecond = filledOrders.filter(order => order.type === uniqueService[1]);

            // let sum = numOfFirst.length + numOfSecond.length;
            // let upgrades = Math.floor(sum / 2); 
            let upgrades = 0;

            if(numOfFirst.length >= numOfSecond.length) {
                upgrades = numOfSecond.length;
            } else if (numOfFirst.length < numOfSecond.length) {
                upgrades = numOfFirst.length;
            } else {
                upgrades = 0;
            }

            setNumOfService1({num: numOfFirst.length - upgrades});
            setNumOfService2({num: numOfSecond.length - upgrades});

        };
        getOtherServiceTypes();

    }, [services["services"], user, servicesAll["services"], usersStakes]);

    return (

        <>
         <Row>
            <Col>
                <div className="d-flex flex-column overflow-hidden" style={{marginTop: "5%", borderRadius: "5px", width: "100%", boxShadow: "var(--dark-shadow)", zIndex: 1}}>
                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px", paddingTop: "15px"}}>
                    <div className={'stats-sidebar-container-blue'}>
                        <h4>{`${service.type.slice(0, 4)}. S.`} </h4>
                    </div>
                    {/* <FaBusinessTime style={{color: "#38aaff", fontSize: "22px"}}/> */}
                    {serviceState(service)}
                    
                </div>
                <hr />
                        
                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                            <h4>Number of upgrades: {user.upgradeNumber}</h4>
                        </div>
                        
                        <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                            <div className={`${(numOfService1["num"] > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                                <h4>{otherServices.service1}</h4>
                            </div>
                            <div className={`${(numOfService1["num"]  > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                                <h4>{numOfService1["num"] }</h4>
                            </div>
                        </div>
                        <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px", paddingBottom: "10px"}}>
                            <div className={`${(numOfService2["num"]  > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                                <h4>{otherServices.service2 }</h4>
                            </div>
                            <div className={`${(numOfService2["num"]  > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                                <h4>{numOfService2["num"] }</h4>
                            </div>
                        </div>   
                </div>
            </Col>
            
        </Row>
        <Row>
        <Col>

        <IconContext.Provider value={{color: "black", size: "20px"}}>

        <div className="d-flex flex-column overflow-hidden" style={{marginTop: "5%", borderRadius: "5px", width: "100%", boxShadow: "var(--dark-shadow)", zIndex: 1}}>

            <div className='d-flex-row d-inline-block' style={{backgroundColor: "#ec8f48"}}>
                <h4 className="d-inline-block">
                    {chains["chains"][0].name}
                </h4>
            </div>
            
            <div style={{justifyContent: "space-around", width: "100%", alignItems: "center", padding: "5px", zIndex: 1}}>
                                
                
                <MiningBar showText="true" version="-side" />  

                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                    <FaMoneyBillAlt style={{color: "green", fontSize: "22px"}}/>
                    <h4>{Object.keys(usersBalances).length !== 0  ?  usersBalances[0][`${chains["chains"][0].name}`] : 0}</h4>
                </div>  
                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                    <FaChartPie style={{color: "#ffba72", fontSize: "22px"}}/>

                     <OverlayTrigger
                    placement="right"
                    delay={{ show: 40, hide: 400 }}
                    overlay={renderTooltip1}
                    >
                        <h4>{Object.keys(stakeIndex).length !== 0 ?  usersStakes[stakeIndex[0]][`${chains["chains"][0].name}`] : 0} </h4>
                    </OverlayTrigger>

                </div>     
                    
            </div>

        </div>
        
        </IconContext.Provider>

        </Col>
        <Col>

        <IconContext.Provider value={{color: "black", size: "20px"}}>

        <div className="d-flex flex-column overflow-hidden" style={{marginTop: "5%", borderRadius: "5px", width: "100%", boxShadow: "var(--dark-shadow)", zIndex: 1}}>

            <div className='d-flex-row d-inline-block' style={{backgroundColor: "#73bcd4"}}>
                <h4 className="d-inline-block">
                    {chains["chains"][1].name}
                </h4>
            </div>
            
            <div style={{justifyContent: "space-around", width: "100%", alignItems: "center", padding: "5px", zIndex: 1}}>
                                
                
                <MiningBar showText="true" version="-side" />  

                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                    <FaMoneyBillAlt style={{color: "green", fontSize: "22px"}}/>
                    <h4>{Object.keys(usersBalances).length !== 0  ?  usersBalances[1][`${chains["chains"][1].name}`] : 0}</h4>

                </div>  
                <div className="d-flex" style={{alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "20px", paddingLeft: "20px"}}>
                    <FaChartPie style={{color: "#ffba72", fontSize: "22px"}}/>
                    <OverlayTrigger
                    placement="right"
                    delay={{ show: 40, hide: 400 }}
                    overlay={renderTooltip2}
                    >
                        <h4>{Object.keys(stakeIndex).length !== 0 ?  usersStakes[stakeIndex[1]][`${chains["chains"][1].name}`] : 0} </h4>
                    </OverlayTrigger>
                    
                </div>
                
      
                    
            </div>

        </div>
        
        </IconContext.Provider>

        </Col>
        </Row>

        <Row>
        
        </Row>       
        </>

        

    )
}

export default UserInfo;


