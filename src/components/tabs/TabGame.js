import {Col, Container, Row} from "react-bootstrap";
import React, {Suspense, useContext} from "react";
import { AppContext } from "../../context/context";
import PanelSide from "../panels/PanelSide";
import NotificationCard from "../notifications/NotificationCard";
import NoteDismissible from "../notifications/NoteDismissible";

//Lazy loading, to improve performance
const Trades = React.lazy(() => import('../misc/TradePanel/Trades'));
const BridgeCard = React.lazy(() => import('../misc/BridgePanel/BridgeCard'));
const AttackCard = React.lazy(() => import('../misc/AttackPanel/AttackCard'));
const BlockchainData = React.lazy(() => import('../misc/BlockchainPanel/BlockchainData'));
const Stats = React.lazy(() => import('../misc/HomePanel/Stats'));
const RankingTable = React.lazy(() => import('../misc/RankingPanel/RankingTable'));
const PanelChains = React.lazy(() => import('../panels/PanelChains'));
const PanelLogin = React.lazy(() => import('../panels/PanelLogin'));


const renderGroup = (active) => {
    switch(active) {
        case "home":
            return <Stats/>;
        case "trade":
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
                <Suspense fallback={<div className="justify-content-center" >Loading...</div>}>
                <Col  style={{backgroundColor: "white", zIndex: 1}}>

                    { (context.game.state === 'RUN' && context.cookies.userId !== undefined) ? (
                        renderGroup(context.active)
                    ): (
                        <div className='d-flex flex-column'>
                        { (context.game.state !== 'RUN' && context.cookies.userId !== undefined) ? (
                            <div className="d-flex flex-column align-items-center justify-content-center" style={{ margin: "15px", height: "400px"}}>
                                <NotificationCard  heading="Please wait for the game to start" />
                            </div>
                        ) : (
                            <PanelLogin/>
                        )
                        }
                        </div>

                    )
                    }
                </Col>
                </Suspense>
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