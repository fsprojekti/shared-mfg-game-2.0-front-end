import {Alert, Button, Card, Form, FormControl, InputGroup, ListGroup} from "react-bootstrap";
import NoteDismissible from "../notifications/NoteDismissible";
import {useContext, useState} from "react";
import { AppContext } from "../../context/context";
import axios from "axios";
import PanelAdmin from "../panels/PanelAdmin";
const config = require("../../config.json");
axios.defaults.baseURL = config.server;




const TabAdmin = () => {
    const {userRegister} = useContext(AppContext);

    const [note, setNote] = useState({
        show: false,
        type: "info",
        msg: "Default message",
        heading: "Test"
    })

    let [registerNumber, setRegisterNumber] = useState("");
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");

    return (
        <div> <PanelAdmin/>
            <div className="d-flex flex-row justify-content-center">
                <NoteDismissible show={note.show}
                                 msg={note.msg}
                                 variant={note.type}
                                 heading={note.heading}
                                 reportHide={() => {
                                     setNote({...(note.show = false)});
                                 }}/>
            </div>
        </div>
    )
}

export default TabAdmin;