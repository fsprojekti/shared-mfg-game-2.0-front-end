import React, {useState, useEffect} from 'react';
import ChainMesh from '../misc/ChainPanel/ChainMesh';
import ChainData from '../misc/ChainPanel/ChainData';
import CreateSideChain from '../misc/ChainPanel/CreateChain';


const PanelChains = () => {


    return (

        <>
            <div className="d-flex flex-column" style={{width: "100%"}}>
             {/* Naredi tako, da je ta chain mesh večji od ta druge kartice */}
             {/* boxShadow: "var(--light-shadow)" */}
                <div className="d-flex flex-column" style={{zIndex: 2, position: "absolute", borderRadius: "8px", margin: "15px", textAlign: "center", alignSelf: "end"}}> 
                    <CreateSideChain />
                </div> 
                <div className="d-flex" style={{zIndex: 1}}>
                    <ChainMesh />
                </div>
                <div className="sidechain-info-container">
                    <ChainData />
                </div>                        
            </div>

        </>
    )
};

export default PanelChains