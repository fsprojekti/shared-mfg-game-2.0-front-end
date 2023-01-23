import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../../context/context';

const RankingTable = () => {
    const { game, users, cookies } = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);

    useEffect(() => {
        const renderTableData = async () => { //Treba poopravit v contectu v array te playerje
            const players = await users['users'].sort((a, b) => parseInt(b.upgradeNumber) === parseInt(a.upgradeNumber) ? (parseInt(b.balance) + parseInt(b.stake)) - (parseInt(a.balance) + parseInt(a.stake)) : parseInt(b.upgradeNumber) - parseInt(a.upgradeNumber));
            setTableDataArray(players);
            console.log(tableDataArray)
        };
        renderTableData();
    }, [game]);


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
                            </tr>
                            </thead>
                            <tbody>
                            {
                                tableDataArray.map((item, index) => (
                                    <tr
                                        key={item._id}
                                        style={{background: `${item.id === cookies.userId ? '#fffd8c' : '#ffffff'}`}}
                                    >
                                        <td><strong>{index + 1}</strong></td>
                                        <td>{item.name}</td>
                                        <td>{item.typeOfService}</td>
                                        <td>{item.upgradeNumber}</td>
                                        <td>{item.balance}</td>
                                        <td>{item.stake}</td>
                                        <td>{item.fromServiceBalance}</td>
                                        <td>{item.fromStakeBalance}</td>
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