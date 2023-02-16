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
            <Row>
            <Col className='d-flex'>
                <div className="d-flex flex-column" style={{zIndex: 2, position: "absolute", borderRadius: "8px", margin: "15px", textAlign: "center", alignSelf: "end"}}> 
                    {/* <CreateSideChain /> */}
                    {/* <ChainData /> */}
                </div> 
                        <ChainMesh />
                        {/* <Row>
                            <ChainData />
                        </Row> */}
                        
                    {/* </div> */}
                </Col>
                <Col>
                    <BridgeCard />
                </Col>
                </Row>
                <Row>
                
                <Col>
                    <AttackCard />
                </Col>
                <Col>
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