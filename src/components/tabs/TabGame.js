import {Col, Container, Row} from "react-bootstrap";
import {useContext, useState, useEffect, useCallback} from "react";
import { AppContext } from "../../context/context";
import { SocketContext } from "../../context/socket";
import PanelSide from "../panels/PanelSide";
import Stats from '../misc/HomePanel/Stats';
import BlockchainData from "../misc/BlockchainPanel/BlockchainData";
import Trades from "../misc/TradePanel/Trades";
import RankingTable from "../misc/RankingPanel/RankingTable";
import BridgeCard from "../misc/BridgePanel/BridgeCard";
import AttackCard from '../misc/AttackPanel/AttackCard';
import PanelLogin from "../panels/PanelLogin";
import NotificationCard from "../notifications/NotificationCard";
import PanelChains from "../panels/PanelChains";
import NoteDismissible from "../notifications/NoteDismissible";
const config = require("../../config.json");


// axios.defaults.baseURL = config.server;


const renderGroup = (active) => {
    switch(active) {
        case "home":
            return <Stats/>;
        case "trade": //manjka še trademodal in cancel cancelordermodal. In modal.
            return <Trades/>;
        case "blockchain":
            return <BlockchainData/>
        case "ranking":
            return <RankingTable/>
        case "chains":
            return <PanelChains/>
        case "bridge":
            return <BridgeCard/>
        case "attack":
            return <AttackCard/>
        default:
            return <Stats/>;
    }
};

const TabGame = () => {
    const context = useContext(AppContext);


    return (
        <div style={{zIndex: 1}}>
            <Container fluid>
            <Row  style={{zIndex: 1}}>
                <PanelSide/>
                <Col  style={{backgroundColor: "white", zIndex: 1}}>

                    { (context.game.state == 'RUN' && context.cookies.userId != undefined) ? (
                        renderGroup(context.active)
                    ): (
                        <div className='d-flex flex-column'>
                        { (context.game.state !== 'RUN' && context.cookies.userId != undefined) ? (
                            <div className="d-flex flex-column align-items-center justify-content-center" style={{ margin: "15px", height: "400px"}}>
                                <NotificationCard  heading="Please wait for the game to start" />
                            </div>
                        ) : (
                            <NotificationCard  heading="You are not logged in" />   
                        )
                        }
                        </div>

                    )
                    }
                    </Col>

            <div className="d-flex align-self-end justify-content-center"  style={{zIndex: 2, position: "absolute", bottom: 0}}>
                    <NoteDismissible show={context.note.show}
                        msg={context.note.msg}
                        variant={context.note.type}
                        heading={context.note.heading}
                        reportHide={() => {
                            context.setNote({...(context.note.show = false)});
                        }}/>
            </div>



            </Row>

             </Container>


        </div>

    )
}

export default TabGame;