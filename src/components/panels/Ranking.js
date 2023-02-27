import React, { useEffect } from 'react';
import { useGlobalContext } from '../../context/context';
import Sidebar from '../misc/SidebarPanel/Sidebar';
import Modal from '../misc/Modal';
import RankingTable from '../misc/RankingPanel/RankingTable';


const Ranking = () => {
    const { game, user, isGameOn, setModalContent} = useGlobalContext();


    useEffect(() => {
        const checkLoggedInAndGame = async () => {
            let token = localStorage.getItem("auth-token");
            let playerId = localStorage.getItem("playerId");
            if ((token === null || token === "") && (playerId === null || playerId === "")) {
                setModalContent('Please log in!');
            } else {
                if (game.state != "RUNNING") {
                    setModalContent('Wait for the admin to start the game!');
                }
            }
        };
        checkLoggedInAndGame();
    }, []);

    return (
        <div>
            <div>

                <div>
                    <div className="home-grid">
                        <div className="item-content">
                            <RankingTable/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Ranking