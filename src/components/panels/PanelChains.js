import React, {useState, useEffect} from 'react';
import ChainMesh from '../misc/ChainPanel/ChainMesh';
import ChainData from '../misc/ChainPanel/ChainData';
import CreateSideChain from '../misc/ChainPanel/CreateChain';
import {Row, Container, Col} from "react-bootstrap";
import AttackCard from '../misc/AttackPanel/AttackCard';
import BridgeCard from '../misc/BridgePanel/BridgeCard';
import AttackInfo from '../misc/ChainPanel/AttackInfo';


const PanelChains = () => {


    return (

        <>
            <div className="d-flex flex-column">
            <Row style={{paddingRight: "0", paddingLeft: "0"}}>
                <Col className='d-flex' style={{paddingRight: "0", paddingLeft: "0", marginRight: "5px", marginBottom: "5px"}}>
                    <ChainMesh />
                </Col>
                <Col style={{paddingRight: "0", paddingLeft: "0", marginLeft: "5px", marginRight: "20px", marginBottom: "5px"}}>
                    <BridgeCard />
                </Col>
                </Row>
                <Row style={{paddingRight: "0", paddingLeft: "0"}}>
                
                <Col style={{paddingRight: "0", paddingLeft: "0", paddingLeft: "0", marginRight: "5px", marginLeft: "5px"}}>
                    <AttackInfo />
                </Col>
                <Col style={{paddingRight: "0", paddingLeft: "0", marginLeft: "5px", marginRight: "20px", marginBottom: "5px"}}>
                    <AttackCard />
                </Col>
            </Row>
            </div>

        </>
    )
};

export default PanelChains