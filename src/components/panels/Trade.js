import React, { useEffect } from 'react';
import { useGlobalContext } from '../../context/context';
import Sidebar from '../misc/SidebarPanel/Sidebar';
import Modal from '../misc/Modal';
import Trades from '../misc/TradePanel/Trades';
import TradeModal from '../misc/TradeModal';
import CancelOrderModal from '../misc/CancelOrderModal';



const Trade = () => {
    const { game, user, setModalContent } = useGlobalContext();


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
                {
                    (game.state == "RUNNING" && localStorage.getItem("auth-token") !== null) ? (

                        <div>
                            <div className="home-grid">
                                <div className="item-sidebar">
                                    <Sidebar/>
                                </div>
                                <div className="item-content">
                                    <Trades/>
                                </div>
                            </div>
                            <TradeModal/>
                            <CancelOrderModal/>
                        </div>

                    ) : (
                        <>
                            <Modal/>
                        </>
                    )
                }
            </div>
        </div>
    )
};

export default Trade