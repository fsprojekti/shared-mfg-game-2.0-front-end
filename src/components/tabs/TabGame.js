import {Col, Container, Row, Spinner} from "react-bootstrap";
import React, {Suspense, useContext, useEffect} from "react";
import { AppContext } from "../../context/context";
import PanelSide from "../panels/PanelSide";
import NotificationCard from "../notifications/NotificationCard";
import NoteDismissible from "../notifications/NoteDismissible";
import NotifCardDissmisable from "../notifications/NotifCardDissmisable";
import CreateOrderModal from "../misc/SidebarPanel/CreateOrderModal";
import CancelOrderModal from "../misc/SidebarPanel/CancelOrderModal";

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
                <Suspense fallback={<div>  <Spinner animation="border" style={{margin: "30%"}}></Spinner> Rendering Panel </div>}>
                <Col  style={{zIndex: 1}}>

                    { 
                        (context.game["game"].state === 'RUN' && context.user.id != "NULL") ? (
                            <>
                                {(context.loadingMain) ? (<Spinner animation="grow" style={{margin: "30%"}}></Spinner>) : 
                                (renderGroup(context.active))}
                            </>
   
                        ): (
                            <div className='d-flex flex-column'>
                            { (context.cookies.userId != undefined) ? (
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
            <div className="d-flex align-self-end justify-content-center"  style={{zIndex: 200, position: "absolute", bottom: 0}}>
                    <NoteDismissible show={context.note.show}
                        msg={context.note.msg}
                        variant={context.note.type}
                        heading={context.note.heading}
                        reportHide={() => {
                            context.setNote({...(context.note.show = false)});
                        }}/>
            </div>

            <div className="d-flex align-self-center justify-content-center"  style={{zIndex: 100, position: "absolute"}}>
                    <NotifCardDissmisable show={context.notifCard.show}
                        msg={context.notifCard.msg}
                        color={context.notifCard.color}
                        heading={context.notifCard.heading}
                        reportHide={() => {
                            context.setNote({...(context.notifCard.show = false)});
                        }}/>
            </div>

            {
                (context.loadingMain) ? ( null ) : (
                    <div>
                        <CreateOrderModal />
                        <CancelOrderModal />
                    </div>
                )
                    
            }
            
            </Row>
            
            
             </Container>


        </div>

    )
}

export default TabGame;