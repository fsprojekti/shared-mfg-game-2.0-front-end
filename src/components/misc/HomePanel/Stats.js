import React, {useState, useEffect} from 'react'
import { Spinner } from 'react-bootstrap';
import balanceImg from '../../../assets/balance.png';
import stakeImg from '../../../assets/stake.png';
import ServiceBar from './ServiceBar';
import ServiceLoading from './ServiceLoading';
import { useGlobalContext } from '../../../context/context';


const Stats = () => {
    const { game, user, users, chains, cookies, activeChain, transactions, servicesAll, usersBalances, usersStakes, orders, services, agent, agents, service} = useGlobalContext();
    const [relativeStake, setRelativeStake] = useState(0);
    const [serviceDataArray, setServiceDataArray] = useState([]);
    const [otherServices, setOtherServices] = useState(["Service1","Service2"]);
    const [numOfService1, setNumOfService1] = useState({num: 0});
    const [numOfService2, setNumOfService2] = useState({num: 0});
    const [userService, setUserService] = useState([]);
    let backColor= "#ffffff";


    const getColor = (service) => {
        switch(service) {
            case "MECHANICAL":
                return "#f8e3a1";
            case "ELECTRICAL": 
                return "rgb(255, 255, 132, 0.5)";
            case "PROGRAMMING": 
                return "rgb(0, 99, 132, 0.5)";
            default:
                return "rgb(255, 255, 255)";
        }
    };


    //TODO: To popravi/odstrani:
    function millisToMinutesAndSeconds(millis) {
        let d = new Date(1000*Math.round(millis/1000));
        if (d.getUTCMinutes() === 0) {
            return ( d.getUTCSeconds() + 's' );
        } else {
            return ( d.getUTCMinutes() + 'min ' + d.getUTCSeconds() + 's' );
        }
    }

    useEffect(() => {
        console.log(chains)
 
        if(chains.includes("id")) {
            if (chains[cookies.activeChain].stake == 0 ||  chains[cookies.activeChain].stake == undefined) {
                setRelativeStake({stake: 0});
            } else {
                let stake = ((usersStakes[chains[cookies.activeChain].name] / chains[cookies.activeChain].stake) * 100).toFixed(1)
                setRelativeStake({stake: stake});
            } 
        } else {
            setRelativeStake(0);
        }

        
        const renderServiceData = async () => {
            // console.log(services);
            // // console.log(agent);
            const activeServices = await services.filter(service => service.state === "ACTIVE");
            console.log(activeServices);
            
            
            const userServices = await Promise.all(activeServices.map(async (item) => {

                const providerAgentObject = await agents.filter(agent => agent._id === item.agent);
                console.log(providerAgentObject)
                const providerUser = await users["users"].filter(user => user._id === providerAgentObject[0].user); 
                   
                      
                return ( 
                    {
                        id: item._id,
                        consumer: user.name,
                        provider: providerUser[0].name,
                        type: item.type,
                        duration: item.duration,
                        updatedAt: item.updatedAt,
                        state: item.state,

                    }
                )
            }));
            console.log(activeServices)
            setServiceDataArray(userServices);
        };
        renderServiceData();

        const renderService = async () => {
            //TODO: Services popravi, da jih pravilno vleče vn
            const service = await services.filter(service => service.agent === agent.id);
            console.log("Users service is: " + JSON.stringify(service));
            setUserService(service[0]);
        };
        renderService();

        const getOtherServiceTypes = async () => {
            let uniqueService = [...new Set(servicesAll.map(item => item.type))];
            uniqueService = uniqueService.filter(item => item !== service.type);
            setOtherServices({service1: uniqueService[0], service2: uniqueService[1]});
            const filledOrders = await services.filter(service => service.state === "DONE");


            let numOfFirst = filledOrders.filter(order => order.type === uniqueService[0]);
            let numOfSecond = filledOrders.filter(order => order.type === uniqueService[1]);

            setNumOfService1({num: numOfFirst.length});
            setNumOfService2({num: numOfSecond.length});

        };
        getOtherServiceTypes();
        


    }, [services, user, servicesAll]);

    return (
        <>
            <div className="d-flex" style={{padding: "5px", columnGap: "20px", rowGap: "20px", }} >
            
                <div className="w-25 p-3" style={{boxShadow: "var(--light-shadow)", borderRadius: "8px", fontSize: "30px", padding: "10px", backgroundColor: backColor}}>
                    <div className={"stats-image"}>
                        <img src={balanceImg} alt={"balance"}/>
                    </div>
                    <div className={"stats-value"}>
                        <p>{ Object.keys(usersBalances).length !== 0 ?  usersBalances[activeChain][`${chains[activeChain].name}`] : 0}</p>
                    </div>
                </div>
                <div className="w-100 p-3" style={{boxShadow: "var(--light-shadow)", padding: "10px", borderRadius: "8px", fontSize: "30px", background: (getColor(service.type))}}>
                    <div className="time-value">
                        <h2>{service.type}</h2>
                    </div>
                    <div className={`${(service.state !== "ACTIVE" ) ? 'time-value-available' : 'time-value-unavailable'}`}>
                        <h2>{(service.state !== "ACTIVE") ? 'Available' : 'Unavailable'}</h2>
                    </div>
                    <ServiceBar/>
                </div>
            </div>
            <div className="d-flex" style={{padding: "5px", columnGap: "20px", rowGap: "20px"}}>
                <div className="w-25 p-3" style={{boxShadow: "var(--light-shadow)", borderRadius: "8px", fontSize: "30px", padding: "10px", backgroundColor: backColor}}>
                    <div className="stake-image">
                        <img src={stakeImg} alt={"stake"}/>
                    </div>
                    <div className={"stake-value"}>
                        <p>{(Object.keys(usersStakes).length !== 0 ) ?  usersStakes[`${chains[activeChain].name}`] : 0}</p>
                        {/* <p>Hello</p> */}
                    </div>
                    <div className={"stake-value-proc"}>
                        <p>({relativeStake.stake}%)</p>
                    </div>
                </div>
                <div className="w-100 p-3" style={{boxShadow: "var(--light-shadow)", padding: "10px", borderRadius: "8px", fontSize: "30px", backgroundColor: backColor}}>
                    <div className="upgrade-value" >
                        <h3>Number of upgrades: {user.upgradeNumber}</h3>
                    </div>
                    <div className="upgrade-container">
                        <div className={`${(numOfService1.num > 0) ? 'upgrade-container-green' : 'upgrade-container-red'}`}>
                            <p>{`${numOfService1.num}`} &#215; {`${otherServices.service1}`}</p>
                        </div>
                        <div>
                            <p>+</p>
                        </div>
                        <div className={`${(numOfService2.num > 0) ? 'upgrade-container-green' : 'upgrade-container-red'}`}>
                            <p>{`${numOfService2.num}`} &#215; {`${otherServices.service2}`}</p>
                        </div>
                    </div>
                    <div className="upgrade-container">
                        <div className="upgrade-container-formula">
                            <p>{`${otherServices.service1}`} + {`${otherServices.service2}`} = &#8681; {millisToMinutesAndSeconds(user.timeForService - user.nextTimeForService)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="services-container">
                <h3>Purchased Services</h3>
                <div className="loading-services-container">
                    {
                        serviceDataArray.map((item) => (
                            <ServiceLoading item={item} key={item.id}/>
                        ))
                    }
                </div>
            </div>
        </>
    )
};

export default Stats