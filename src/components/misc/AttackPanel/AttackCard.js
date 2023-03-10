import React, {useState, useContext} from 'react';
import {Button, Card, Spinner, Row, Col } from "react-bootstrap";
import { AppContext } from '../../../context/context';


const AttackCard = () => {
    const context = useContext(AppContext);

    // let [bridge, setbridgeNo] = useState(0);
    const [loading, setLoading] = useState("");

    let voteStealBridge = async () => {
        try {
            
            setLoading("steal");

            // console.log(context.bridges[0])
            await context.apiUserStealVoteON(context.bridges[0]._id);

            context.setNote({
                show: true,
                type: "success",
                msg: "Attack vote casted",
                heading: "Success! "
            })
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e)
            context.setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Could not vote! "
            })
        }
    }

    const confirmVoteOff = async () => {
        try {
            setLoading("steal");
            const res = await context.apiUserStealVoteOFF(context.stealVotes["stealVotes"].bridges[0]);
            setLoading(false);
            context.setNote({
                show: true,
                type: "success",
                msg: res,
                heading: "Success! "
            })
            setLoading(false);
        } catch(e) {
            setLoading(false);
            console.log(e)
            context.setNote({
                show: true,
                type: "danger",
                msg: e.message,
                heading: "Could not retract! "
            })
        }
    };




    return (
        <div style={{justifyContent: "center", alignItems: "center" }}>
        <Card  style={{ borderRadius: "8px", boxShadow: "var(--light-shadow)", width: "100%", backgroundColor: "(255, 255, 255, 0.8)", borderColor: "transparent", height: "255px"}}>
            <Row >
            <Col>
                <h3 style={{paddingTop: "1rem"}}> Attack {context.bridges[0].name} </h3>
                        <Card style={{backgroundColor: "rgba(222, 243, 239, 0.5)", borderColor: "red", borderRadius: "8px", margin: "10px", padding: "10px"}}>
                        {context.bridges.length > 0 ? (
                        <Card.Body>
                            
                            {
                                context.stealVotes["stealVotes"] !== undefined ? (
                                    <Card.Title style={{padding: "10px"}}> {context.stealVotes["stealVotes"].bridges.length === 0 ? `Vote To Steal From ${context.bridges[0].name}` : 'Your vote was casted'}   </Card.Title>
                                )
                                :
                                (
                                    <Card.Title style={{padding: "10px"}}> Vote to steal from  {context.bridges[0].name} </Card.Title>
                                )
                            }
                            
                            
                            <Card.Text>

                            
                            </Card.Text>
                            
                        </Card.Body>
                        ):
                        (
                            <Card.Body>
                        
                                <Card.Title style={{padding: "10px"}}> Vote To Steal From a Bridge </Card.Title>
                                <Card.Text>
                                    <b> Create a bridge (chain) first to use this function </b> 
                                </Card.Text>
                            
                            </Card.Body>
                        )}

                        
                            
                            {
                            (context.stealVotes["stealVotes"] === undefined || context.stealVotes["stealVotes"].bridges.length === 0) ? (

                                <>
                                
                                <Button variant="danger" style={{borderRadius: "8px", alignSelf: "center", marginBottom: "20px", backgroundColor: "#e73936"}} onClick={voteStealBridge} > 
                                    {loading === "steal" ? (
                                        <div>
                                            <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span> VOTING </span>
                                        </div>
                                    ) : ( <span> VOTE  </span>)
                                    
                                    }   
                                    
                                </Button>    
                                </>
                            ): (
                                <>
                                <Button variant="success" style={{borderRadius: "8px", alignSelf: "center", marginBottom: "20px", backgroundColor: "#34ad6a", borderColor: "#34ad6a"}} onClick={confirmVoteOff} > 
                                    {loading === "steal" ? (
                                        <div>
                                            <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span> REMOVING </span>
                                        </div>
                                    ) : ( <span> REMOVE VOTE  </span>)
                                    
                                    }   
                                    
                                </Button>    
                                </>

                            )
                        }
                            

                        

                    
                    </Card>

                            
                    
                </Col>
                {/* <Col>
                    <AttackInfo />
                </Col> */}
        </Row>
        </Card>
        </div>
    )
};

export default AttackCard