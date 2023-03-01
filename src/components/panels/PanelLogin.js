import {Alert, Button, Card, Form, FormControl, InputGroup} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import NoteDismissible from "../notifications/NoteDismissible";
import {useContext, useState} from "react";
import { AppContext } from "../../context/context";

const config = require("../../config");


const PanelLogin = () => {
    const context = useContext(AppContext);

    const navigate = useNavigate();


    let [registerNumberRegister, setRegisterNumberRegister] = useState("");
    let [registerNumberLogin, setRegisterNumberLogin] = useState("");
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [passwordLogin, setPasswordLogin] = useState("");

    let enter = (event) => {
        if (event.charCode === 13) {
            login();
          }
    }

    let register = async () => {
        try {
            let data = await context.apiUserRegister(registerNumberLogin, name, email);
            console.log(data)
            context.setNote((prevState) => {
                return({
                  ...prevState,
                  msg: "Check you email",
                  heading: 'Success',
                  show: true,
                  type: 'success'
                });
              });
        } catch (e) {
            console.log(e)
            context.setNote((prevState) => {
                return({
                  ...prevState,
                  msg: e.message,
                  heading: 'Error',
                  show: true,
                  type: 'danger'
                });
              });
        }
    }

    async function navigateGame() {
        
    }

    let login = async () => {
        try {
            //Login user
            let data = await context.apiUserLogin(registerNumberLogin, passwordLogin);

            //Set cookies
            await context.setCookie("authToken", data.token);
            await context.setCookie("userId", data.user.id);
            await context.setCookie('activeChain', 0);

            //Set cookies in context variables
            context.setUserId(data.user.id);

            //Set user
            context.setUser({
                state: data.user.state,
                id: data.user.id,
                type: data.user.type,
                name: data.user.name,
            });

            context.setNote((prevState) => {
                return({
                  ...prevState,
                  msg: data.message,
                  heading: 'Success',
                  show: true,
                  type: 'success'
                });
              });


            window.location.reload(true)


        } catch (e) {
            context.setNote((prevState) => {
                return({
                  ...prevState,
                  msg: e.message,
                  heading: 'Error',
                  show: true,
                  type: 'danger'
                });
              });
        }
    }

    return (
        <div>
            <div className="d-flex flex-row justify-content-center flex-wrap" style={{paddingTop: "15%"}}>
                <div className={"d-flex p-3"}>
                    <Card style={{width: '25rem', borderRadius: "8px"}} size="lg">
                        <Form>
                            <Card.Header style={{backgroundColor: "#F0C808"}}><h5>Register</h5></Card.Header>
                            <InputGroup className="mb-3 p-2">
                                <InputGroup.Text id="input-user-registration-number">Player
                                    id</InputGroup.Text>
                                <FormControl onChange={e => setRegisterNumberLogin(e.target.value)}></FormControl>
                            </InputGroup>
                            <InputGroup className="mb-3 p-2">
                                <InputGroup.Text id="input-user-name">Name</InputGroup.Text>
                                <FormControl onChange={e => setName(e.target.value)}></FormControl>
                            </InputGroup>
                            <InputGroup className="mb-3 p-2">
                                <InputGroup.Text id="input-user-email">Email</InputGroup.Text>
                                <FormControl onChange={e => setEmail(e.target.value)}></FormControl>
                            </InputGroup>
                            <div className="d-flex justify-content-end p-2">
                                <Button variant="dark" type="button" className="p-2" onClick={e => register()}>
                                    Register
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </div>
                <div className={"d-flex p-3"}>
                    <Card style={{width: '25rem', borderRadius: "8px"}} size="lg">
                    <Form>
                        <Card.Header  style={{backgroundColor: "#EC8F48"}}><h5>Login</h5></Card.Header>
                        <InputGroup className="mb-3 p-2">
                            <InputGroup.Text id="input-user-registration-number">Player Id</InputGroup.Text>
                            <FormControl onChange={e => setRegisterNumberLogin(e.target.value)}></FormControl>
                        </InputGroup>
                        <InputGroup className="mb-3 p-2">
                            <InputGroup.Text id="input-user-password">Password</InputGroup.Text>
                            <FormControl type="password" onChange={e => setPasswordLogin(e.target.value)} onKeyPress={(k) => enter(k)} ></FormControl>
                        </InputGroup>
                        <div className="d-flex justify-content-end p-2" >
                            <Button variant="dark" style={{marginTop: "4.3rem"}}  type="button" className="p-2" onClick={e => login()}>
                                Login
                            </Button>
                        </div>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>


    )
}

export default PanelLogin;