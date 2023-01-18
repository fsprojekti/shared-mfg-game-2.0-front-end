import React, {useState, useEffect, useContext} from 'react';
import {Card, OverlayTrigger } from "react-bootstrap";
import { AppContext } from '../../../context/context';
import { getChainsNamesFromBridgeObject } from '../HelperFunctions/functions';

const AttacksTable = () => {
    const context = useContext(AppContext);
    const [tableDataArray, setTableDataArray] = useState([]);
    const [sortBy, setSortBy] = useState('time');
    const [orderOfSort, setOrderOfSort] = useState('ascending');
    const [checkBoxes, setCheckBoxes] = useState([{type: "Mechanical service", isChecked: false}, {type: "Electrical service", isChecked: false}, {type: "IT service", isChecked: false}, {type: "Stake", isChecked: false}, {type: "Unstake", isChecked: false}]);


    const displayTime = async (time) => {
        const createdMillis = await new Date(time);
        return createdMillis.toLocaleTimeString('it-IT');
    };

    const openCancelVoteModal = async (item) => {
        context.setIsCancelVoteModalOpen(true);
        context.setCancelVoteModalContent(item);
    };

    const selectOne = async (e) => {
        let itemName = e.target.name;
        let checked = e.target.checked;
        const newArray = await checkBoxes.map(item =>
            item.type === itemName ? { ...item, isChecked: checked } : item
        );
        setCheckBoxes(newArray);
    };



    useEffect(() => {


    }, [checkBoxes, orderOfSort]);


    return (
        <>
        <div className="d-flex flex-column" style={{padding: "5px"}}>
            <div className="d-flex align-items-start">
                 <Card className='attack-card-1' style={{width: "60%", margin: "5px", justifyContent: "space-evenly", borderRadius: "8px", boxShadow: "var(--light-shadow)", paddingRight: "5px"}}>
                    {/* <Card.Title>Bridges</Card.Title> */}
                    <Card.Body>
                        <Card className='d-flex flex-column' style={{    borderRadius: "8px", margin: "10px", padding: "10px"}}>
                            <table className="table-all-transactions" style={{borderCollapse: "collapse", background: "auto", float: "left"}}>
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
                                        onClick={(item) => (openCancelVoteModal(item))} 
                                    >
                                        <td>{getChainsNamesFromBridgeObject(item.bridges[0], context.bridges, context.chains)[0]} - {getChainsNamesFromBridgeObject(item.bridges[0], context.bridges, context.chains)[1]} </td>
                                    </tr>
                                ))
                            }
                                </tbody>
                            </table>      
                        </Card>

                    </Card.Body>

                </Card>

            <Card className='attack-card-1' style={{width: "60%", margin: "5px", justifyContent: "space-evenly", borderRadius: "8px", boxShadow: "var(--light-shadow)", paddingRight: "5px"}}>
                    {/* <Card.Title>Players</Card.Title> */}
                    <Card.Body>
                    <Card className='d-flex flex-column' style={{    borderRadius: "8px", margin: "10px", padding: "10px"}}>
                            <table className="table-all-transactions" style={{borderCollapse: "collapse", background: "auto", float: "left", borderRadius: "8px"}}>
                                <thead>
                                <tr>
                                    <th> Player </th>
                                   <th> Status </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    tableDataArray.map((item) =>
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
                        </Card>


                </Card.Body>
                
            </Card>
                   
                </div>

            </div>
        </>
    )
};

export default AttacksTable