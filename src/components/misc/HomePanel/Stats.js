import React, {useState, useEffect, useContext} from 'react'
import { Spinner } from 'react-bootstrap';
import balanceImg from '../../../assets/balance.png';
import stakeImg from '../../../assets/stake.png';
import ServiceBar from './ServiceBar';
import ServiceLoading from './ServiceLoading';
import { AppContext } from '../../../context/context';


const Stats = () => {
    const { stakeIndex, user, users, chains, cookies, activeChain, transactions, servicesAll, usersBalances, usersStakes, orders, services, agent, agents, service} = useContext(AppContext);
    const [relativeStake, setRelativeStake] = useState(0);
    const [serviceDataArray, setServiceDataArray] = useState([]);
    const [otherServices, setOtherServices] = useState(["Service1","Service2"]);
    const [numOfService1, setNumOfService1] = useState({num: 0});
    const [numOfService2, setNumOfService2] = useState({num: 0});
    const [sumBalance, setSumBalance] = useState({balance: 0});
    const [sumStake, setSumStake] = useState({stake: 0});

    let backColor= "#ffffff";


    const getColor = (service) => {
        switch(service) {
            case "IDLE":
                return "white";
            case "ACTIVE": 
                return "white";
            case "MARKET": 
                return "white";
            default:
                return "rgb(255, 255, 255)";
        }
    };


    useEffect(() => {
        

        const renderStakeData = async () => {

            let stakesKeys = [];
            for(let i = 0; i < Object.keys(usersStakes).length; i++) {
                stakesKeys[i] = Object.keys(usersStakes[i])[0];
            }
            let stakeIndex1 =  stakesKeys.indexOf(chains["chains"][0].name);
            let stakeIndex2 =  stakesKeys.indexOf(chains["chains"][1].name);
            let stakeIndexes = [stakeIndex1, stakeIndex2];

            const stakes = usersStakes;
            let sum = usersStakes.reduce((prev,next, index) => prev + next[[`${chains["chains"][stakeIndexes[index]].name}`]],0);
            setSumStake({stake: sum});
            };
        renderStakeData();

        const renderBalanceData = async () => {
                const balances = usersBalances;
                let sum = await balances.reduce((prev,next, index) => prev + next[[`${chains["chains"][index].name}`]],0);
                console.log(sum)
                setSumBalance({balance: sum});
        };
        renderBalanceData();

        
        const renderServiceData = async () => {
            // console.log(services)
            const activeServices = await services["services"].filter(service => service.state === "ACTIVE");            
            // console.log(activeServices)
            const userServices = await Promise.all(activeServices.map(async (item) => {

                // console.log(item)

                const providerAgentObject = await agents["agents"].filter(agent => agent._id === item.agent);
                // console.log(providerAgentObject)

                const providerUser = await users["users"].filter(user => user.id === providerAgentObject[0].user); 
                // console.log(providerUser)
                   
                      
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
            if(userServices.length == 0) return [];
            setServiceDataArray(userServices);
        };
        renderServiceData();


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

        // console.log(services)
        


    }, [services["services"], activeChain, user, servicesAll["services"], usersStakes, stakeIndex]);

    return (
        <>
            <div className="d-flex" style={{padding: "5px", columnGap: "20px", rowGap: "20px", }} >
            
                <div className="w-25 p-3" style={{boxShadow: "var(--light-shadow)", borderRadius: "8px", fontSize: "30px", padding: "10px", backgroundColor: backColor}}>
                    <div className={"stats-image"}>
                        <img src={balanceImg} alt={"balance"}/>
                    </div>
                    <div className={"stats-value"}>
                        <p>{ Object.keys(usersBalances).length !== 0 ?  sumBalance.balance : 0}</p>
                    </div>
                </div>
                <div className="w-100 p-3" style={{boxShadow: "var(--light-shadow)", padding: "10px", borderRadius: "8px", fontSize: "30px", background: (getColor(service.state))}}>
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
                        <p>{sumStake.stake}</p>
                    </div>
                    {/* <div className={"stake-value-proc"}>
                        <p>({relativeStake.stake}%)</p>
                    </div> */}
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
                            <p>{`${otherServices.service1}`} + {`${otherServices.service2}`} = &#8681; {(agent.timeForService - agent.timeForServiceNext).toFixed(2)} s</p>
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