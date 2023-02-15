import React, {useContext} from 'react';
import {Card} from "react-bootstrap";
import { AppContext } from '../../../context/context';
import { getBridgeName } from '../HelperFunctions/functions';


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
                            <table className="table-all-transactions" style={{borderCollapse: "collapse", borderRadius: "8px", background: "auto", float: "left", cursor: "pointer"}}>
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
                                        <td>{getBridgeName(item.bridges[0], context.bridges)} </td>
                                    </tr>
                                ))
                            }
                                </tbody>
                            </table>      
                   
                </div>

            </div>
        </>
    )
};

export default AttacksTable