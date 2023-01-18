import React, {useState, useEffect, useContext} from 'react';
import {Button, Card, Spinner, OverlayTrigger, Tooltip, Row, Container, Col, Dropdown } from "react-bootstrap";
import { AppContext } from '../../../context/context';
import AttacksTable from './AttacksTable';


const AttackCard = () => {
    const context = useContext(AppContext);

    let [bridge, setbridgeNo] = useState(0);
    let [user, setUser] = useState(0);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    function attackbridge(number){
        setbridgeNo(number);
        console.log(bridge);
    }

    function attackUser(number){
        setUser(number);
        console.log(user);
    }

    const getChainsNamesFromBridgeObject = (index) => {
        let chainsArr = context.chains;
        // console.log(context.bridges[index])
        let bridgeChains = chainsArr.filter(item => item.id === context.bridges[index].chainSource || item.id === context.bridges[index].chainTarget);
        let names = bridgeChains.map(item => item.name);
        return names;
    };

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          You can remove your vote by clicking on the bridge/player in the table.
        </Tooltip>
      );
    

    useEffect(() => {
        const renderUserTable = async () => {
            const usersWithoutMainPlayer = await context.users['users'].filter(user => user._id != context.user.id);
            setUsers(usersWithoutMainPlayer);
        };
        renderUserTable();
        console.log(users)
    }, [])


    let voteStealBridge = async () => {
        try {
            
            setLoading(true);
            console.log("loadingtrue")
            console.log(context.bridges[0])
            await context.apiUserStealVoteON(context.bridges[bridge]._id);

            context.setNote({
                show: true,
                type: "success",
                msg: "Attack vote casted",
                heading: "Success! "
            })
            setLoading(false);
        } catch (e) {
            setLoading(false);
            context.setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Could not vote! "
            })
        }
    }

    let removeVoteStealBridge = async () => {
        try {
            setLoading(true);
            await context.apiUserStealVoteOFF(context.bridges[bridge].id);

            context.setNote({
                show: true,
                type: "success",
                msg: "Attack vote removed",
                heading: "Success!"
            })
            setLoading(false);
        } catch (e) {
            setLoading(false);
            context.setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Chain not created! "
            })
        }
    }


    return (
        <>
        {/* <div className="d-flex" style={{padding: "5px", columnGap: "20px", rowGap: "20px"}}> */}
                <div className="d-flex align-items-start">
                <Container>
                <Row >
                <Col>
                <Card className='attack-card-1' style={{width: "100%", margin: "5px", justifyContent: "space-evenly", borderRadius: "8px", boxShadow: "var(--light-shadow)", minHeight: "30vh" }}>
                            <Card.Body>
                            <Card className='d-flex flex-column' style={{backgroundColor: "rgba(222, 243, 239, 0.5)", borderColor: "red", borderRadius: "8px", margin: "10px", padding: "10px"}}>
                            <Card.Body>
                            
                                <Card.Title style={{padding: "10px"}}> Vote To Steal From a Bridge </Card.Title>
                                <Card.Text>
                                <b> Select the bridge you wish to steal from </b> 
                                </Card.Text>
                                
                                <Card.Text>

                                <Dropdown  className='d-flex' style={{justifyContent: "center", width: "auto", wordBreak: "break-all"}}>
                            
                                <Dropdown.Toggle className='d-flex'  variant="outline-secondary" id="dropdown-basic" >
                                 <b> {getChainsNamesFromBridgeObject(bridge)[0]} 🌉 {getChainsNamesFromBridgeObject(bridge)[1]} </b> 
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu>

                                {
                                    context.bridges.map((item, index) => (
                                        
                                        <Dropdown.Item onClick={(item) => (attackbridge(index))} > {getChainsNamesFromBridgeObject(index)[0]} - {getChainsNamesFromBridgeObject(index)[1]} </Dropdown.Item>

                                    ))
                                }
                                </Dropdown.Menu>
                                
                                </Dropdown>
                                
                                
                                </Card.Text>
                                
                            </Card.Body>
                        
                        </Card>

                        <Button variant="danger" style={{borderRadius: "8px"}} onClick={voteStealBridge}> 
                            {loading ? (
                                <div>
                                    <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <text> Adding vote </text>
                                </div>
                            ) : ( <text> Vote to Steal  </text>)
                            
                            }   
                            
                        </Button>
                        </Card.Body>
                        
                    </Card>
                    </Col>
                    <Col>
                    <Card className='attack-card-1' style={{width: "100%", margin: "5px", justifyContent: "space-evenly", borderRadius: "8px", boxShadow: "var(--light-shadow)", minHeight: "30vh" }}>
                            <Card.Body>
                            <Card className='d-flex flex-column' style={{backgroundColor: "rgba(222, 243, 239, 0.5)", borderColor: "red", borderRadius: "8px", margin: "10px", padding: "10px"}}>
                            <Card.Body>
                            
                                <Card.Title style={{padding: "10px"}}> Vote To Block a Player </Card.Title>
                                <Card.Text>
                                <b> Select the player you wish to block </b> 
                                </Card.Text>
                                
                                <Card.Text>

                                <Dropdown  className='d-flex' style={{justifyContent: "center"}}>
                            
                                <Dropdown.Toggle className='d-flex' style={{justifyContent: "center"}} variant="outline-secondary" id="dropdown-basic" >
                                    <b> {users.length > 0 ? users[user].name : "player"} </b> 
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu>

                                {
                                    users.map((item, index) => (
                                        
                                        <Dropdown.Item  onClick={() => (attackUser(index))} > {item.name} </Dropdown.Item>

                                    ))
                                }
                                </Dropdown.Menu>
                                
                                </Dropdown>
                                
                                
                                </Card.Text>
                                
                            </Card.Body>
                        
                        </Card>

                        <Button variant="danger" style={{borderRadius: "8px"}} onClick={voteStealBridge}> 
                            {loading ? (
                                <div>
                                    <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <text> Adding vote </text>
                                </div>
                            ) : ( <text> Vote to Block  </text>)
                            
                            }   
                            
                        </Button>
                        </Card.Body>
                        
                    </Card>
                    </Col>
            </Row>
            </Container>
                </div>  
                    <div className='' style={{backgroundColor: "rgba(255, 255, 255, 0.8)", boxShadow: "var(--light-shadow)", borderRadius: "8px", margin: "5px", textAlign: "center"}}>
                        <div className='d-flex'>
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 0, hide: 400 }}
                                overlay={renderTooltip}
                                >
                                <Button variant="info" size="sm" className='d-flex justify-content-start' style={{margin: "5px", position: "absolute", fontWeight: "bold"}}>i</Button>
                                </OverlayTrigger>
                            <h3 style={{textAlign: "center", width:"100%"}} >Attack status</h3> 
                        </div>    
                            <AttacksTable />
                    </div>

            {/* </div> */}
        </>
    )
};

export default AttackCard