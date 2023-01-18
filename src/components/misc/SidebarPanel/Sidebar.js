import React, {useState, useEffect, useReducer} from 'react';
import { Link } from 'react-router-dom';
import { links } from './Links';
import { FaMoneyBillAlt, FaBusinessTime, FaChartPie } from 'react-icons/fa';
import CreateOrderModal from '../CreateOrderModal';
import { useGlobalContext } from '../../../context/context';

const Sidebar = () => {
    // const { gameData, openCreateOrderModal } = useGlobalContext();
    const { game, openCreateOrderModal, chains, user, activeChain } = useGlobalContext();
    const [orderExists, setOrderExists] = useState(false);
    const [relativeStake, setRelativeStake] = useState(0);
    let [tableDataArray, setTableDataArray] = useState([]);

    let playerId = localStorage.getItem("playerId");
    let chainId = localStorage.getItem("activeChain");

    let userData = chains[localStorage.getItem("activeChain")].players.filter(players=> players.id === localStorage.getItem("playerId"));
    


    const orderNotExists = async () => {
        const order = user.orders.filter(item => item.provider === user._id);
        setOrderExists(!Array.isArray(order) || !order.length);
    };

    

    const checkLoggedInAndGame = async () => {
        let token = localStorage.getItem("auth-token");
        let playerId = localStorage.getItem("playerId");
        if (token !== (null || "") && playerId !== (null || "")) {
            // setChainNo(game.players[playerId].currentChain);
            // setPlayerId(playerId);
        } else {
            // setChainNo(0)
        }
        // console.log(chainNo)
        // console.log("Money: " + chains[chainNo].players[playerId].balance);
    };

    useEffect(() => {
        //Ta render ne dela pravilno ob spremembi chaina. Moreš prešaltat na drugo stran, da je prav. 
        const renderTableData = async () => {
            // Object.entries --> podobna funkcija kot "Array.from()". 
            let players = await Object.entries(chains[chainId].players)
            players = await players.sort((a, b) => parseInt(b.upgradeNumber) === parseInt(a.upgradeNumber) ? (parseInt(b.balance) + parseInt(b.stake)) - (parseInt(a.balance) + parseInt(a.stake)) : parseInt(b.upgradeNumber) - parseInt(a.upgradeNumber));
            const playersArray = await players.slice(0, 5);
            setTableDataArray(playersArray);
            console.log(playersArray)
        };
        renderTableData();

        // orderNotExists();
        let newRelativeStake = ((userData[0].stake / chains[game.players[playerId].currentChain].totalStake) * 100).toFixed(1);
        setRelativeStake(newRelativeStake);
        
        
        checkLoggedInAndGame();
        // setChainNo(game.players[playerId].currentChain);
        console.log("im in")

        playerId = localStorage.getItem("playerId");
        
    }, [game, chains, activeChain]);

    return (
        <div>
            

            <div >
                <h4> {chains[chainId].name} </h4> 
            </div>

            
            <div className="sidebar">
                <ul className='sidebar-links'>
                    {links.map((link) => {
                        const { id, url, text, icon } = link;
                        return (
                            <li key={id}>
                                <Link to={url}>
                                    {icon}
                                    {text}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {/* <div className="text-align-center overflow-hidden" style={{"margin-top": "15%", "border-radius": "5px", "width": "100%", "box-shadow": "var(--dark-shadow)", "background-color": "rgba(209, 209, 209, 0.8)"}}> */}
            <div className="text-align-center overflow-hidden" style={{"marginTop": "15%", "borderRadius": "5px", "width": "100%", "boxShadow": "var(--dark-shadow)", "background-color": "rgba(209, 209, 209, 0.8)"}}>
                <h3>Stats</h3>
                <div className="stats-sidebar-values">
                    <div className="stats-sidebar-values-stat">
                        <FaMoneyBillAlt style={{color: "green", fontSize: "22px"}}/>
                        <h4>{userData[0].balance}</h4>
                    </div>
                    <div className="stats-sidebar-values-stat">
                        <FaBusinessTime style={{color: "#38aaff", fontSize: "22px"}}/>
                        <h4 style={userData[0].amountOfAvailableService === 1 ? {color: "forestgreen", fontSize: "18px"} : {color: "darkred", fontSize: "18px"}}>{userData[0].amountOfAvailableService === 1 ? 'AVAILABLE' : 'UNAVAILABLE'}</h4>
                    </div>
                    <div className="stats-sidebar-values-stat">
                        <FaChartPie style={{color: "#ffba72", fontSize: "22px"}}/>
                        <h4>{userData[0].stake} ({relativeStake}%)</h4>
                    </div>
                    <hr />
                    <div className="stats-sidebar-values-stat">
                        <h4>Number of upgrades: {userData[0].upgradeNumber}</h4>
                    </div>
                    <div className="stats-sidebar-other-services">
                        <div className={`${(userData[0].amountOfOtherService1 > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                            <h4>{useReducer.typeOfOtherService1}</h4>
                        </div>
                        <div className={`${(userData[0].amountOfOtherService1 > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                            <h4>{userData[0].amountOfOtherService1}</h4>
                        </div>
                    </div>
                    <div className="stats-sidebar-other-services">
                        <div className={`${(userData[0].amountOfOtherService2 > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                            <h4>{useReducer.typeOfOtherService2}</h4>
                        </div>
                        <div className={`${(userData[0].amountOfOtherService2 > 0) ? 'stats-sidebar-container-green' : 'stats-sidebar-container-red'}`}>
                            <h4>{userData[0].amountOfOtherService2}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="create-order-container">
                {userData[0].amountOfAvailableService === 1 && orderExists ? <button className="create-order-btn" onClick={openCreateOrderModal}>Set Price</button> : ''}
            </div>
            {/* <div className="ranking-sidebar">
                <h3>Top 5 players</h3>
                <table className="table-all-rankings">
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Number of upgrades</th>
                    </tr>
                    </thead>
                    <tbody>

                    { 
                        tableDataArray.map((item, index) => (
                            <tr
                                key={item.id}
                                style={{background: `${item.playerName === user.playerName ? '#fffd6c' : ''}`}}
                            >
                                <td><strong>{index + 1}</strong></td>
                                <td>{item[1].playerName}</td>
                                <td>{item[1].upgradeNumber}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div> */}
            <CreateOrderModal/>
        </div>
    )
};

export default Sidebar