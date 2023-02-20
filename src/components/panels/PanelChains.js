import React, {useState, useEffect} from 'react';
import ChainMesh from '../misc/ChainPanel/ChainMesh';
import ChainData from '../misc/ChainPanel/ChainData';
import CreateSideChain from '../misc/ChainPanel/CreateChain';
import {Row, Container, Col} from "react-bootstrap";
import AttackCard from '../misc/AttackPanel/AttackCard';
import BridgeCard from '../misc/BridgePanel/BridgeCard';


const PanelChains = () => {


    return (

        <>
            <div className="d-flex flex-column">
            <Row style={{paddingRight: "0", paddingLeft: "0"}}>
                <Col className='d-flex' style={{paddingRight: "0", paddingLeft: "0", marginRight: "5px"}}>
                    <ChainMesh />
                </Col>
                <Col style={{paddingRight: "0", paddingLeft: "0", marginLeft: "5px", marginRight: "20px"}}>
                    <BridgeCard />
                </Col>
                </Row>
                <Row style={{paddingRight: "0", paddingLeft: "0"}}>
                
                <Col style={{paddingRight: "0", paddingLeft: "0", paddingLeft: "0", marginRight: "5px" }}>
                    <AttackCard />
                </Col>
                <Col style={{paddingRight: "0", paddingLeft: "0", marginLeft: "5px", marginRight: "20px"}}>
                    <div className="sidechain-info-container">
                        {/* <ChainData /> */}
                    </div>    
                </Col>
            </Row>
            </div>

        </>
    )
};

export default PanelChains