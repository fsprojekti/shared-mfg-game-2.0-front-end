import logo from './logo.svg';
import './App.css';
import {useContext, useState, useEffect } from "react";
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


    const navigate = useNavigate();

    function logOut() {
        context.removeCookie("authToken");
        context.removeCookie("userId");
        context.removeCookie("activeChain");
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
        context.removeCookie("timeDiff");
        context.setUser({
            id: "",
            type: "",
            state: ""
        })
    }

    useEffect(() => {
        context.setLoadingMain(true);

        //Load last cookies into context state
        context.setActiveChain(context.cookies.activeChain);
        // context.setTimeDiff({difference: context.cookies.timeDiff});

        //Load game
        const game = context.apiGameFetch().then(game => {
            //TODO: Reset active chain if idle game
            context.setGame(game);
        })

        //Load all logged in users and their data
        const users = context.apiGameUsers().then(users => {
            context.setUsers({users})
        }).catch(e => {console.log(e); context.setLoadingMain(false);})

        //Load all trancactions
        const transactions = context.apiGameTransactions().then(trnsctns => {
            context.setTransactions(trnsctns);
        }).catch(e => console.log(e))   ;

        //Load all services
        const  services = context.apiGameServices().then(services => {
            context.setServicesAll(services);
        }).catch(e => console.log(e));

        //Load orders
        const orders = context.apiGameOrders().then(orders => {
            context.setOrders(orders);
        }).catch(e => console.log(e));

        //Load user agent
        const agent = context.apiUserAgentGet().then(agentObj => {
            let agent = context.agent;
            agent.id = agentObj.id;
            agent.type = agentObj.type;
            agent.timeForService = agentObj.timeForService;
            agent.upgradeLevel = agentObj.upgradeLevel;

            context.setAgent({ ...agent });
        }).catch(e => console.log(e));

        //Load agents
        const agents = context.apiGameAgents().then(agents => {
            console.log(JSON.stringify(agents));
            context.setAgents(agents);
            return true;
        }).catch(e => console.log(e));

        //Load user service
        const service = context.apiUserFetchService().then(service => {
            context.setService(service);
            return true;
        }).catch(e => console.log(e));

        //Load user's purchased and active services
        const userServices = context.apiUserFetchServices().then(services => {
            context.setServices(services["services"]);
        }).catch(e => console.log(e));

        //Load users balances on different chains
        const balance = context.apiUserFetchBalance().then(balance => {
            context.setUsersBalances(balance);
        }).catch(e => console.log(e));
    
        //Load users stakes on different chains
        const stakes = context.apiUserFetchStake().then(stakes => {
            console.log(stakes)
            context.setUsersStakes(stakes);
        }).catch(e => console.log(e));

        //Load all chains
        const chains = context.apiGameChains().then(chains => {

            let chainsObj = chains;
            console.debug(context.cookies.timeDiff)
            if(context.cookies.timeDiff !== undefined) {
                console.debug("Setting time difference")
                chainsObj[0].timeDiff = parseInt(context.cookies.timeDiff);
                chainsObj[0].updatedAt = (new Date(chains[0].updatedAt)).getTime() - parseInt(context.cookies.timeDiff);
            }
            console.log(chains);

            context.setChains( chainsObj );
        }).catch(e => console.log(e))

        //Load all bridges
        const bridges = context.apiGameBridges().then(bridges => {
            // console.log((bridges))
            context.setBridges(bridges);
        }).catch(e => console.log(e))

        //Load user's steal votes
        const stealVotes = context.apiUserStealGet().then(stealVotes => {
            // console.log((stealVotes))
            context.setStealVotes(stealVotes);
        }).catch(e => console.log(e))

        //Load user's block votes
        const blockVotes = context.apiUserBlockGet().then(blockVotes => {
            // console.log(JSON.stringify(blockVotes))
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

            Promise.all([game, chains,  agents, agent, orders,  bridges, stealVotes, blockVotes, users, transactions, services, service, userServices,
                balance, stakes]).then(() => {
                context.setLoadingMain(false);
            });

    }, [navigate, context.game.state])

    useEffect(() => {
        console.log(socket)

        // subscribe to socket events
        socket.on("chain", context.updateChainsState);
        socket.on("game", context.updateGameState);
        socket.on("order", context.updateOrdersState);
        socket.on("transactions", context.updatetransactionsState);
        socket.on("service", context.updateServiceState);
        socket.on("agent", context.updateAgentsState);
        socket.on("balancesAgents", context.updateBalancesState);
        socket.on("balanceChain", context.updateBalanceChain);
        socket.on("balanceBridge", context.updateBalanceBridge);
        socket.on("stakesAgents", context.updateStakesState);

        return () => {
          socket.off("chain");
          socket.off("game");
          socket.off("order");
          socket.off("transactions");
          socket.off("service");
          socket.off("agent");
          socket.off("balancesAgents");
          socket.off("balanceChain");
          socket.off("balanceBridge");
          socket.off("stakesAgents");
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
