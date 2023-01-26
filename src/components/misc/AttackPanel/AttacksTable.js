import React, {useContext} from 'react';
import {Card} from "react-bootstrap";
import { AppContext } from '../../../context/context';
import { getChainsNamesFromBridgeObject } from '../HelperFunctions/functions';

const AttacksTable = () => {
    const context = useContext(AppContext);


    const openCancelVoteModal = async (item) => {
        console.log("clicked");
        context.setIsCancelVoteModalOpen(true);
        context.setCancelVoteModalContent(item);
    };


    return (
        <>
        <div className="d-flex flex-column" style={{padding: "5px"}}>
            <div className="d-flex align-items-start">
                 <Card className='attack-card-1' style={{width: "60%", margin: "5px", justifyContent: "space-evenly", borderRadius: "8px", boxShadow: "var(--light-shadow)", paddingRight: "5px"}}>
                    {/* <Card.Title>Bridges</Card.Title> */}
                    <Card.Body>
                            <table className="table-all-transactions" style={{borderCollapse: "collapse", background: "auto", float: "left", cursor: "pointer"}}>
                                <thead>
                                <tr>
                                    <th> Bridge </th>
                                   <th> Status </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    context.stealVotes.map((item, index) => (
                                    <tr
                                        key={item._id} 
                                        onClick={(index) => (openCancelVoteModal(item))} 
                                    >
                                        <td>{getChainsNamesFromBridgeObject(item.bridges[0], context.bridges, context.chains)[0]} - {getChainsNamesFromBridgeObject(item.bridges[0], context.bridges, context.chains)[1]} </td>
                                    </tr>
                                ))
                            }
                                </tbody>
                            </table>      

                    </Card.Body>

                </Card>

            <Card className='attack-card-1' style={{width: "60%", margin: "5px", justifyContent: "space-evenly", borderRadius: "8px", boxShadow: "var(--light-shadow)", paddingRight: "5px"}}>
                    {/* <Card.Title>Players</Card.Title> */}
                    <Card.Body>
                            <table className="table-all-transactions" style={{borderCollapse: "collapse", background: "auto", float: "left", borderRadius: "8px"}}>
                                <thead>
                                <tr>
                                    <th> Player </th>
                                   <th> Status </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    context.blockVotes.map((item) =>
                                        (
                                            <tr key={item.bridge}>
                                                <td>{item.votes}</td>
                                                <td>{item.percentage}</td>
                                                <td>{item.status}</td>
                                            </tr>
                                        )
                                    )
                                }
                                </tbody>
                            </table>      


                </Card.Body>
                
            </Card>
                   
                </div>

            </div>
        </>
    )
};

export default AttacksTable