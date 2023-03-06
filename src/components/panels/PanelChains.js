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

        <div >
            <Row style={{paddingRight: "0", paddingLeft: "0"}}>
                <Col xs={6} md={6} className='d-flex' style={{paddingRight: "0", paddingLeft: "0", marginRight: "10px", marginBottom: "5px", marginLeft: "20px"}}>
                    <ChainMesh />
                </Col>
                <Col xs={6} md={5} className='d-flex' style={{paddingRight: "0", paddingLeft: "0", marginLeft: "0px", marginRight: "20px", marginBottom: "10px", marginTop: "5px"}}>
                    <BridgeCard />
                </Col>
            </Row>
            <Row style={{paddingRight: "0", paddingLeft: "0"}}>
                <Col xs={6} md={6} style={{paddingRight: "0", paddingLeft: "0", marginRight: "10px", marginBottom: "5px", marginLeft: "20px"}}>
                    <AttackInfo />
                    {/* <AttackCard /> */}
                </Col>
                <Col xs={6} md={5} style={{paddingRight: "0", paddingLeft: "0", marginRight: "20px", marginBottom: "5px", marginLeft: "0px"}}>
                    <AttackCard />
                </Col>
            </Row>
        </div>
    )
};

export default PanelChains