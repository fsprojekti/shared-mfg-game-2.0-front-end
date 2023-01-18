import {Col, Container, ListGroup, Row} from "react-bootstrap";

import {IconContext} from "react-icons";
import {
    FaHome,
    FaUserFriends,
    FaChartPie,
    FaChartBar,
    FaConnectdevelop,
    FaBusinessTime,
    FaMoneyBillAlt
} from 'react-icons/fa';

import classNames from "classnames";
import { AppContext } from "../../context/context";

import {useState, useContext, useEffect, useReducer} from "react";
import {GiStoneBridge, GiTakeMyMoney, GiTriquetra} from "react-icons/gi";
import UserInfo from "../misc/SidebarPanel/UserInfo";




const PanelSide = () => {

    const context = useContext(AppContext);


    return (
        <Col sm={12} md={3} lg={4} xl={3}>
{/*  //007676 */}
            <IconContext.Provider value={{color: "black", size: "20px"}}>
                <ListGroup className={"p-2"} style={{"marginTop": "5%", "borderRadius": "5px", "boxShadow": "var(--dark-shadow)"}}>
                    <ListGroup.Item tag='button' action={true}  type='button' onClick={() => context.setActive("home")}  className={classNames({active: context.active === "home"})}>
                        <div className={"d-flex w-100 justify-content-center align-items-center"}>
                            <div className={"p-1"}>
                                <FaHome/>
                            </div>
                            <div>
                                <h6 className={"mb-0 p-1"}>Home</h6>
                            </div>
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item tag='button' action={true}  type='button' onClick={() => context.setActive("trade")} className={classNames({active: context.active === "trade"})}>
                        <div className={"d-flex w-100 justify-content-center align-items-center"}>
                            <div className={"p-1"}>
                                <FaUserFriends/>
                            </div>
                            <div>
                                <h6 className={"mb-0 p-1"}>Trade</h6>
                            </div>
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item tag='button' action={true}  type='button' onClick={() => context.setActive("blockchain")} className={classNames({active: context.active === "blockchain"})}>
                        <div className={"d-flex w-100 justify-content-center align-items-center"}>
                            <div className={"p-1"}>
                                <FaChartPie/>
                            </div>
                            <div>
                                <h6 className={"mb-0 p-1"}>Blockchain</h6>
                            </div>
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item tag='button' action={true}  type='button' onClick={() => context.setActive("chains")} className={classNames({active: context.active === "chains"})}>
                        <div className={"d-flex w-100 justify-content-center align-items-center"}>
                            <div className={"p-1"}>
                                <FaConnectdevelop/>
                            </div>
                            <div>
                                <h6 className={"mb-0 p-1"}>Chains</h6>
                            </div>
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item tag='button' action={true}  type='button' onClick={() => context.setActive("bridge")} className={classNames({active: context.active === "bridge"})}>
                        <div className={"d-flex w-100 justify-content-center align-items-center"}>
                            <div className={"p-1"}>
                                <GiStoneBridge/>
                            </div>
                            <div>
                                <h6 className={"mb-0 p-1"}>Bridge</h6>
                            </div>
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item tag='button' action={true}  type='button' onClick={() => context.setActive("attack")} className={classNames({active: context.active === "attack"})}>
                        <div className={"d-flex w-100 justify-content-center align-items-center"}>
                            <div className={"p-1"}>
                                <GiTakeMyMoney/>
                            </div>
                            <div>
                                <h6 className={"mb-0 p-1"}>Attack</h6>
                            </div>
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item tag='button' action={true}  type='button' onClick={() => context.setActive("ranking")} className={classNames({active: context.active === "ranking"})} >
                        <div className={"d-flex w-100 justify-content-center align-items-center"}>
                            <div className={"p-1"}>
                                <FaChartBar/>
                            </div>
                            <div>
                                <h6 className={"mb-0 p-1"}>Ranking</h6>
                            </div>
                        </div>
                    </ListGroup.Item>
                    

                </ListGroup>
                
            </IconContext.Provider>

            { ((context.user.type == "PLAYER") && context.game.state == "RUN") ? ( 
                <UserInfo/>
            ) : (
                <></>
            ) 
            }

            
            
        </Col>
    )
}

export default PanelSide;