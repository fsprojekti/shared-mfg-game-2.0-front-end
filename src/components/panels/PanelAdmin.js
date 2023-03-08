import {Alert, Button, Card, Col, Container, InputGroup, Row, Spinner} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import { AppContext } from "../../context/context";
import NoteDismissible from "../notifications/NoteDismissible";
import $ from 'jquery';

const PanelAdmin = () => {

    const context = useContext(AppContext);
    const [loading, setLoading] = useState("");


    const [note, setNote] = useState({
        show: false,
        type: "info",
        msg: "Default message",
        heading: "Test"
    })

    let create = async () => {
        try {
            setLoading("create");
            let gameDoc = await context.apiGameCreate();
            setNote({
                show: true,
                type: "success",
                msg: "New game created",
                heading: "Success. "
            });
            setLoading("");
        } catch (e) {
            setLoading("");
            setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Creation of game failed! "
            })
        }
    }

    let initialize = async () => {
        try {
            setLoading("init");
            await context.apiGameInitialize(context.game.id);
            setNote({
                show: true,
                type: "success",
                msg: "Initialization of game succeeded!",
                heading: "Success "
            })
            setLoading("");
        } catch (e) {
            setLoading("");
            setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Initialization of game failed! "
            })
        }

    }

    let start = async () => {
        setLoading("start");
        try {
            console.log(context.game)
            await context.apiGameStart(context.game.id);
            setNote({
                show: true,
                type: "success",
                msg: "Game started",
                heading: "Success! "
            })
            setLoading("");
        } catch (e) {
            setLoading("");
            setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Game not started! "
            })
        }
    }

    let pause = async () => {
        setLoading("pause");
        try {
            console.log(context.game)
            await context.apiGamePause();
            setNote({
                show: true,
                type: "success",
                msg: "Game started",
                heading: "Success! "
            })
            setLoading("");
        } catch (e) {
            setLoading("");
            setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Game not paused! "
            })
        }
    }

    let end = async () => {
        setLoading("stop");
        try {
            console.log(context.game)
            await context.apiGameStop();
            setNote({
                show: true,
                type: "success",
                msg: "Game ended",
                heading: "Success! "
            })
            setLoading("");
        } catch (e) {
            setLoading("");
            setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Game still running! "
            })
        }
    }

    let resume = async () => {
        setLoading("resume");
        try {
            console.log(context.game)
            await context.apiGameResume();
            setNote({
                show: true,
                type: "success",
                msg: "Game ended",
                heading: "Success! "
            })
            setLoading("");
        } catch (e) {
            setLoading("");
            setNote({
                show: true,
                type: "danger",
                msg: e.response.data.message,
                heading: "Game still running! "
            })
        }
    }

    // let end = async () => {
    //     try {
    //         await context.apiGameEnd();
    //         setNote({
    //             show: true,
    //             type: "success",
    //             msg: "Game ended",
    //             heading: "Success! "
    //         })
    //     } catch (e) {
    //         setNote({
    //             show: true,
    //             type: "danger",
    //             msg: e.response.data.message,
    //             heading: "Game still running! "
    //         })
    //     }
    // }

    useEffect(() => {

    }, [context.users])


    return (
        <>
            {
                context.user.type === "ADMIN" ?
                    <Container>
                        {/* <h2> Manage game: {context.game ? <span style={{color: 'red'}}> {context.game.id}  </span> : <text> Please create a game </text>} </h2> */}
                        <Row className="p-2">
                            <Col className={"p-2"}>
                                <Card>  
                                    <Card.Header className={"bg-dark text-white"}> Control of the game</Card.Header>
                                    <Card.Body>
                                        <div className={"d-flex justify-content-between flex-wrap"}>
                                            <div className={"p-2 align-self-center"}>
                                                Initialise selected game
                                            </div>
                                            <div className={"p-2 align-self-center"}>
                                                <Button onClick={initialize} style={{minWidth: '100px'}}
                                                        variant={"danger"}>
                                                {loading === "init" ? (
                                                    <div>
                                                        <Spinner
                                                        as="span"
                                                        animation="grow"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                    <text> Initializing</text>
                                                    </div>
                                                ):(
                                                    
                                                    <text> Initialize </text>
                                                )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className={"d-flex justify-content-between flex-wrap"}>
                                            <div className={"p-2 align-self-center"}>
                                                Start the game
                                            </div>
                                            <div className={"p-2 align-self-center"}>
                                                <Button onClick={start} style={{minWidth: '100px'}}>
                                                {loading === "start" ? (
                                                    <div>
                                                        <Spinner
                                                        as="span"
                                                        animation="grow"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                    <text> Starting </text>
                                                    </div>
                                                ):(
                                                    
                                                    <text> Start  </text>
                                                )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className={"d-flex justify-content-between flex-wrap"}>
                                            <div className={"p-2 align-self-center"}>
                                                Stop the game
                                            </div>
                                            <div className={"p-2 align-self-center"}>
                                                <Button onClick={end} style={{minWidth: '100px'}}>
                                                {loading === "stop" ? (
                                                    <div>
                                                        <Spinner
                                                        as="span"
                                                        animation="grow"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                    <text> Stoping </text>
                                                    </div>
                                                ):(
                                                    
                                                    <text> Stop </text>
                                                )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className={"d-flex justify-content-between flex-wrap"}>
                                            <div className={"p-2 align-self-center"}>
                                                Pause the game
                                            </div>
                                            <div className={"p-2 align-self-center"}>
                                                <Button onClick={pause} style={{minWidth: '100px'}}>
                                                {loading === "pause" ? (
                                                    <div>
                                                        <Spinner
                                                        as="span"
                                                        animation="grow"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                    <text> Pausing </text>
                                                    </div>
                                                ):(
                                                    
                                                    <text> Pause </text>
                                                )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className={"d-flex justify-content-between flex-wrap"}>
                                            <div className={"p-2 align-self-center"}>
                                                Resume the game
                                            </div>
                                            <div className={"p-2 align-self-center"}>
                                                <Button onClick={resume} style={{minWidth: '100px'}}>
                                                {loading === "resume" ? (
                                                    <div>
                                                        <Spinner
                                                        as="span"
                                                        animation="grow"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                    <text> Resuming </text>
                                                    </div>
                                                ):(
                                                    
                                                    <text> Resume </text>
                                                )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className={"d-flex justify-content-between flex-wrap"}>
                                            <div className={"p-2 align-self-center"}>
                                                Create new game
                                            </div>
                                            <div className={"p-2 align-self-center"}>
                                                <Button onClick={create} style={{minWidth: '100px'}}
                                                        variant={"warning"}>
                                                    {loading === "create" ? (
                                                    <div>
                                                        <Spinner
                                                        as="span"
                                                        animation="grow"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                    <text> Creating </text>
                                                    </div>
                                                ):(
                                                    
                                                    <text> Create </text>
                                                )}
                                                </Button>
                                            </div>
                                        </div>
                                        
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col className={"p-2"}>
                                <Card>  
                                    <Card.Header className={"bg-dark text-white"}>Current status</Card.Header>
                                    <Card.Body>
                                    <div className={"d-flex justify-content-between flex-wrap"}>
                                            <div className={"p-2 align-self-center"}>
                                                State
                                            </div>
                                            <div className={"p-2 align-self-center"} style={{minWidth: '115px'}}>
                                                <InputGroup.Text>{context.game ? context.game["game"].state : <text>No game</text>}</InputGroup.Text>
                                            </div>
                                        </div>
                                    <div className={"d-flex justify-content-between flex-wrap"}>
                                        <div className={"p-2 align-self-center"}>
                                            Players
                                        </div>
                                        <div className={"p-2 align-self-center"} style={{minWidth: '115px'}}>

                                            <InputGroup.Text>{context.users["users"].length}</InputGroup.Text>
                                        </div>
                                    </div>
                                    <div className={"d-flex justify-content-between flex-wrap"}>
                                        <div className={"p-2 align-self-center"}>
                                            Chains created
                                        </div>
                                        <div className={"p-2 align-self-center"} style={{minWidth: '115px'}}>

                                            {/* <InputGroup.Text>{context.chains["chains"].length}</InputGroup.Text> */}
                                        </div>
                                    </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <div className="d-flex flex-row justify-content-center">
                                            <NoteDismissible show={note.show}
                                                             msg={note.msg}
                                                             variant={note.type}
                                                             heading={note.heading}
                                                             reportHide={() => {
                                                                 setNote({...(note.show = false)});
                                                             }}/>
                                        </div>

                        </Row>
                        







                    </Container>
                    
                    
                    

                    :
                    <Container className={"p-2"}>
                        <Alert className={"p-2"} variant={"info"}>You do not have administration rights</Alert>

                    </Container>

            }
        </>
    )
}


export default PanelAdmin;