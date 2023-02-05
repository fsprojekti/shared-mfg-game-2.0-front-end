import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';

const RankingTable = () => {
    const context = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);

    useEffect(() => {
        const renderTableData = async () => { //Treba poopravit v contectu v array te playerje
            const players = await context.ranking.sort((a, b) => parseInt(b.upgrades) === parseInt(a.upgrades) ? (parseInt(b.balance) + parseInt(b.stake)) - (parseInt(a.balance) + parseInt(a.stake)) : parseInt(b.upgrades) - parseInt(a.upgrades));
            const playersWithNames = await players.map(function(player){ 
                const agentObject = context.agents["agents"].filter(agent => agent._id === player.agent);
                const userObject = context.users["users"].filter(user => user.id === agentObject[0].user);

                player.userName = userObject[0].name;

                return player
            })   

            
            setTableDataArray(playersWithNames);
        };
        renderTableData();
    }, [context.ranking]);


    return (
        <>
            <div className="d-flex flex-column" style={{boxShadow: "var(--light-shadow)", borderRadius: "8px", width: "100%", margin: "5px", justifyContent: "space-evenly"}}>
                <div className="table-all-transactions-container">
                    <h2>Players Ranking</h2>
                    <div className="table-ranking">
                        <table className="table-all-rankings">
                            <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Type of service</th>
                                <th>Number of upgrades</th>
                                <th>Balance</th>
                                <th>Stake</th>
                                <th>Revenue from trade</th>
                                <th>Revenue from stake</th>
                                <th>Revenue from attacks</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                tableDataArray.map((item, index) => (
                                    <tr
                                        key={item._id}
                                        style={{background: `${item.agent === context.agent.id ? '#fffd8c' : '#ffffff'}`}}
                                    >
                                        <td><strong>{index + 1}</strong></td>
                                        <td>{item.userName}</td>
                                        <td>{item.type}</td>
                                        <td>{item.upgrades}</td>
                                        <td>{item.balance}</td>
                                        <td>{item.stake}</td>
                                        <td>{item.revenueTrade}</td>
                                        <td>{item.revenueStake}</td>
                                        <td>{item.revenueAttack}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
};

export default RankingTable