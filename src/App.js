import logo from './logo.svg';
import './App.css';
import {useContext, useState, useEffect, useCallback, useRef } from "react";
import {AppContext} from "./context/context";
import { SocketContext } from './context/socket';
import {Container, Spinner, Navbar, Button, Card} from "react-bootstrap";
import TabAdmin from './components/tabs/TabAdmin';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Avatar from 'react-avatar';

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Error from './components/panels/Error';
import TabGame from './components/tabs/TabGame';
import TabLogin from './components/tabs/TabLogin';

function App() {
    const context = useContext(AppContext);
    const socket = useContext(SocketContext);
    const [messages, setMessages] = useState({});


    const navigate = useNavigate();

    function logOut() {
        context.removeCookie("authToken");
        context.removeCookie("userId");
    }


    async function navigateLogin(event) {
        event.preventDefault();
        navigate("/login", {replace: true});
    }


    async function navigateAdmin(event) {
        //TODO: Kaj je preventDefault?
        event.preventDefault();
        navigate("/admin", {replace: true});
        console.log("navigated admin")
    }

    async function navigateLogout(event) {
        event.preventDefault();
        navigate("/", {replace: true});
        console.log("logged out")
        context.removeCookie("authToken");
        context.removeCookie("userId");
        context.removeCookie("activeChain");
        context.setUser({
            id: "",
            type: "",
            state: ""
        })
    }

    useEffect(() => {
        context.setLoadingMain(true);

        //Load last active chain id from cookies
        context.setActiveChain(context.cookies.activeChain);

        //Load game
        context.apiGameFetch().then(game => {
            context.setGame(game)
        })

        //Load all logged in users and their data
        context.apiGameUsers().then(users => {
            context.setUsers({users})
            context.setLoadingMain(false);
        }).catch(e => {console.log(e); context.setLoadingMain(false);})

        //Load all trancactions
        context.apiGameTransactions().then(trnsctns => {
            context.setTransactions(trnsctns);
        }).catch(e => console.log(e))   ;

        //Load all services
        context.apiGameServices().then(services => {
            context.setServicesAll(services);
        }).catch(e => console.log(e));

        //Load orders
        context.apiGameOrders().then(orders => {
            context.setOrders(orders);
        }).catch(e => console.log(e));

        //Load user agent
        context.apiUserAgentGet().then(agent => {
            context.setAgent(agent);
        }).catch(e => console.log(e));

        //Load agents
        context.apiGameAgents().then(agents => {
            // alert(JSON.stringify(agents));
            context.setAgents(agents);
        }).catch(e => console.log(e));

        //Load user service
        context.apiUserFetchService().then(service => {
            // alert(JSON.stringify(service))  
            context.setService(service);
        }).catch(e => console.log(e));

        //Load user's purchased and active services
        context.apiUserFetchServices().then(services => {
            console.log("MY SERVICE ARRAY:")
            // alert(JSON.stringify(services["services"]));
            context.setServices(services["services"]);
        }).catch(e => console.log(e));

        //Load users balances on different chains
        context.apiUserFetchBalance().then(balance => {
            console.log("BALANCE: " + JSON.stringify(balance))
            for(let i = 0; i < balance.length; i++) {
                console.log(balance[i])
            }
            var object = balance.reduce((obj, item) => (item.key, obj) ,{});

            context.setUsersBalances(balance);
        }).catch(e => console.log(e));
    
        //Load users stakes on different chains
        context.apiUserFetchStake().then(stakes => {
            console.log("STAKES: " + JSON.stringify(stakes))
            if(stakes[0] != undefined) context.setUsersStakes(stakes[0]);
        }).catch(e => console.log(e));

        //Load all chains
        context.apiGameChains().then(chains => {
            console.log(JSON.stringify(chains))
            context.setChains(chains);
        }).catch(e => console.log(e))

        //Load all bridges
        context.apiGameBridges().then(bridges => {
            console.log(JSON.stringify(bridges))
            context.setBridges(bridges);
        }).catch(e => console.log(e))

        //Load user's steal votes
        context.apiUserStealGet().then(stealVotes => {
            console.log((stealVotes))
            context.setStealVotes(stealVotes);
        }).catch(e => console.log(e))

        //Load user's block votes
        context.apiUserBlockGet().then(blockVotes => {
            console.log(JSON.stringify(blockVotes))
            context.setBlockVotes(blockVotes);
        }).catch(e => console.log(e))

        //Load user data
        context.apiUserFetch()
            .then(data => {
                let user = context.user;
                user.id = data.id;
                user.type = data.type;
                user.name = data.name;

                context.setUser({
                    ...user
                })

            }).catch(e => console.log(e))

    }, [navigate])

    useEffect(() => {
        console.log(socket)

        // subscribe to socket events
        socket.on("chain", context.updateChainsState);
        socket.on("game", context.updateGameState);
        socket.on("order", context.updateOrdersState);
        socket.on("transactions", context.updatetransactionsState);;

        return () => {
          socket.off("chain");
          socket.off("game");
          socket.off("order");
          socket.off("transactions");
        };
      }, [socket]);

    return (
        <div className="App">
            <Navbar style={{backgroundColor: "#272c34", height: "60px"}}>
                <Container>
                    <Navbar.Brand style={{color: "#eddeff"}} className='nav-brand' href="/">
                    <h4> Shared Manufacturing game </h4>
                    </Navbar.Brand>

                    {context.loadingMain ? (
                            <div >
                                <Spinner animation="border" variant="light" size="sm"/>
                                <b className='d-flex flex-column' style={{color: "white", fontSize: "0.7rem"}}>Loading game data...</b>
                            </div>

                        ):( <div></div>)

                }

                    {
                    //Popravi to da se gleda local id in pol al je logged al ne
                    (context.cookies.authToken !== undefined) ? (
                        <div className='d-flex'  >
                            <NavDropdown title={<Avatar name={`${context.user.name}`}  round={true} size="45" />} id="navbarScrollingDropdown">
                            <p style={{fontWeight: "bold", textAlign: "center", color: "#8957e5"}}>{context.user.name}</p>

                            <NavDropdown.Item style={{textAlign: "center"}} onClick={navigateLogout}>Log Out</NavDropdown.Item>
                            {(context.user.type === "ADMIN") ?
                            <NavDropdown.Item  style={{textAlign: "center"}} onClick={navigateAdmin}>Manage game</NavDropdown.Item>
                            :
                            <div></div>
                        }
                            </NavDropdown>

                        </div>
                    ) : (
                        <Button variant="outline-light" onClick={navigateLogin}>Log In</Button>
                    )
                    }

                </Container>
            </Navbar>
            <div>

            <Routes>
                <Route exact path={"/login"} element={<TabLogin />}/>
                <Route exact path={"/admin"} element={<TabAdmin/>}/>
                <Route exact path={"/"} element={<TabGame/>}/>
                <Route exact path={"/home"} element={<TabGame/>}/>
                <Route path='*' element={<Error />} />
            </Routes>
        </div>
        </div>
    );
}

export default App;
