import {Col, Container, Row} from "react-bootstrap";
import NoteDismissible from "../notifications/NoteDismissible";
import {useContext, useState} from "react";
import { AppContext } from "../../context/context";
import PanelSide from "../panels/PanelSide";
import PanelLogin from "../panels/PanelLogin";
import axios from "axios";
const config = require("../../config.json");
axios.defaults.baseURL = config.server;

const TabLogin = () => {
    const { active} = useContext(AppContext);

    return (
        <Container fluid>
            <Row>
                <PanelSide/>
                <Col  style={{backgroundColor: "white"}}>

                    <PanelLogin/>

                </Col>
            </Row>
        </Container>
    )
}

export default TabLogin;