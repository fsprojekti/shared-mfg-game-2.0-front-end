import React, {useState, useContext, useCallback} from 'react'
import axios from "axios";
import {useCookies} from "react-cookie";
import config from "../config.json";
axios.defaults.baseURL = config.server;

// /**
//  * Context object type.
//  * @typedef ICTXDefault
//  */

// /**
//  * @type {ICTXDefault}
//  */
// const defaultContext = {};

// /**
//  * @type {import("react").Context<ICTXDefault>}
//  */ 
export const AppContext = React.createContext(null);

export const ContextWrapper = (props) => {

    //--------------------- STATE VARIABLES ------------------------------------------------------

    //Panel navigation state variable
    const [active, setActive] = useState("home");
    //Cookies
    const [cookies, setCookie, removeCookie] = useCookies(['authToken', 'userId', 'activeChain', 'timeDiff']);
    //Active chain
    const [activeChain, setActiveChain] = useState(0);
    //User auth token
    const [authToken, setAuthToken] = useState(cookies.authToken);
    //User id
    const [userId, setUserId] = useState(cookies.userId);
    //Loading state on page refresh
    const [loadingMain, setLoadingMain] = useState(false);
    
    //User
    const [user, setUser] = useState(
        {
            //State of user ["NONE","LOGGED-IN","LOGGED-OUT"]
            state: "NONE",
            id: "",
            //Type ADMIN, USER
            role: "",
            stake: 0,
            balance: "NULL",
        })

    //User's balance on all chains
    const [usersBalances, setUsersBalances] = useState({});
    
    //User's stake on all chains
    const [usersStakes, setUsersStakes] = useState({});


    //Users
    const [users, setUsers] = useState({})

    //Game properties
    const [game, setGame] = useState({
        //Game states ["NONE","IDLE","RUNNING","STOPPED","ENDED"]
        state: "NONE",
    })

    //User's asigned agent
    const [agent, setAgent] = useState({});

    //All agents in the game
    const [agents, setAgents] = useState({})

    //User's service
    const [service, setService] = useState({
            //Id of last service
        id:"serviceId",
        state:"IDLE",
        duration:100,
        //If service in state ACTIVE this is begin time of its execution
        beginAt:0
    });
    
    //All User's purchased services in state: ACTIVE
    const [services, setServices] = useState([]);

    //All services in the game
    const [servicesAll, setServicesAll] = useState([]);

    //Chains
    const [chains, setChains] = useState([]);

    //Bridges
    const [bridges, setBridges] = useState([]);

    //Transactions
    const [transactions, setTransactions] = useState([]);

    //Orders
    const [orders, setOrders] = useState([]);

    //Steal votes
    const [stealVotes, setStealVotes] = useState([]);

    //Block votes
    const [blockVotes, setBlockVotes] = useState([]);

    const [note, setNote] = useState({
        show: false,
        type: "info",
        msg: "Default message",
        heading: "Test"
    })

    const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [confirmModalContent, setConfirmModalContent] = useState('');
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
    
    const [tradeModalContent, setTradeModalContent] = useState({})
    const [cancelOrderModalContent, setCancelOrderModalContent] = useState({});

    const [cancelVoteModalContent, setCancelVoteModalContent] = useState({});
    const [isCancelVoteModalOpen, setIsCancelVoteModalOpen] = useState(false);

    const [cancelBlockMocalContent, setCancelBlockModalContent] = useState({});
    const [isCancelBlockModalOpen, setIsCanclBlockModalOpen] = useState(false);

    

    //--------------------- FUNCTIONS ------------------------------------------------------

    //--------------------- State updaters ------------------------------------------------------


    const openCreateOrderModal = () => {
        setIsCreateOrderModalOpen(true);
    };

    const closeCreateOrderModal = () => {
        setIsCreateOrderModalOpen(false);
    };

    const openCancelOrderModal = () => {
        setIsCancelOrderModalOpen(true);
    };

    const closeCancelOrderModal = () => {
        setIsCancelOrderModalOpen(false);
    };


    const openTradeModal = () => {
        setIsTradeModalOpen(true);
    };

    const updateActiveChain = (chainId) => {
        setActiveChain(chainId);
    }

    const updateChainsState = (chainObj) => {
        console.log(chainObj);
          setChains((chains) => {
            const oldChains = [...chains];

            const index = oldChains.findIndex(c => {
                return c.id === chainObj.id;
            });

            if(index !== -1) {
                oldChains[index].balance = chainObj.balance;
                oldChains[index].stake = chainObj.stake;
                if(chainObj.blockNumber > oldChains[index].blockNumber){
                    if(oldChains[0].load == true) { 
                        console.log(oldChains[index].updatedAt)
                        setCookie('timeDiff', Date.now() - (new Date(oldChains[index].updatedAt)).getTime() - 10000);  
                        console.log(Date.now() - (new Date(oldChains[index].updatedAt)).getTime() - 10000)
                        oldChains[0].load = false
                    }
                    
                    oldChains[index].updatedAt = Date.now() - cookies.timeDiff;
                    
                    oldChains[index].blockNumber = chainObj.blockNumber; 
                    console.log("Time diff: " + cookies.timeDiff);
                }


                return oldChains;
            } else if(index == -1 && chainObj.id !== undefined) {
                oldChains.push(chainObj);
                return oldChains;
            }
            
            return chains;         
        });

    }

    
    const updateOrdersState = (orderObj) => {
        console.log(orderObj);
          setOrders((oldOrders) => {
            const orders = [...oldOrders];

            const index = orders.findIndex(c => {
                return c._id === orderObj.id;
            });
            console.log(index)
            if(index !== -1) {
                orders[index] = orderObj;
                // console.log(oldChains[index])
                return orders;
            } else if(index == -1 && orderObj.id !== undefined) {
                console.log("pushing");
                console.log(orderObj.chain._id);
                let newOrder = {};
                newOrder._id = orderObj.id;
                newOrder.chain = orderObj.chain._id;
                newOrder.state = orderObj.state;
                newOrder.service = orderObj.service._id;
                newOrder.price = orderObj.price;
                orders.push(newOrder);
                console.log(orders);
                return orders;
            }
            
            return oldOrders;         
        });

    }

    const updateServiceState = (serviceObj) => {
        console.log(serviceObj);
    }

    const updateTransactionsState = (transObj) => {
        console.log(transObj);
          setOrders((oldTrans) => {
            const transactions = [...oldTrans];

            const index = transactions.findIndex(c => {
                return c.id === transObj.id;
            });
            if(index !== -1) {
                transactions[index] = transObj;
                return transactions;
            } else if(index == -1 && transObj.id !== undefined) {
                transactions.push(transObj);
                return transactions;
            }
            
            return oldTrans;         
        });

    }


    //--------------------- API requests ------------------------------------------------------


    /**
     * Fetches user's data
     * @param {Object} user - User's object
     * @param {string} user.id - User's id
     * @param {string} user.name - User's name
     * @param {string} user.type - "PLAYER" or "ADMIN"
     * @param {string} user.state - "LOGGED-IN"
     * @example {id: '63a576228ac157377b59bcec', type: 'MECHANICAL', upgradeLevel: 0, timeForService: 100}
     */
    const apiUserFetch = useCallback(() => {
        // console.log("Chain id " + chainId)
        return new Promise(async (resolve, reject) => {
            try {

                let out = await axios.get(`user`, 
                 {
                    headers: {
                        authorization: cookies.authToken
                      }
                })
                console.log(out.data.user)
                resolve(out.data.user)
            } catch (e) {
                reject(e);
            }
        })
    }, [])

    /**
     * Fetches user's balance on all chains.
     * @param {Object[]} balances - Array of balances on all chains .
     * @example [{"KingsLanding": 18}, {"Chamberpad": 100}]
     */
    const apiUserFetchBalance = useCallback(() => {
        // console.log("Chain id " + chainId)
        return new Promise(async (resolve, reject) => {
            // alert(cookies.authToken)
            try {

                let out = await axios.get(`user/balances/get`,{
                    params: {
                        // gameId: gameId,
                    },
                    headers: {
                      authorization: cookies.authToken
                    }
                })
                // alert(JSON.stringify(out.data));
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, [])


    /**
     * Fetches user's stake from API
     * @param {Object[]} stakes - Array of stakes on all chains .
     * @example [{"KingsLanding": 18}, {"Chamberpad": 100}]
     */
    const apiUserFetchStake = useCallback(() => {
        return new Promise(async (resolve, reject) => {
            try {

                let out = await axios.get(`user/stakes/get`,{
                    params: {
                        // gameId: gameId,
                    },
                    /**
                     * headers
                     * @param {string} authorization - authToken
                     */
                    headers: {
                        authorization: cookies.authToken
                    }
                })
                // console.log(out);
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, [])

    /**
     * Fetches user's service
     * @param {Object} service - User's service object
     * @param {string} service.id - Id of the service
     * @param {string} service.type - Type of the service
     * @param {number} service.upgradeLevel - Level of the service
     * @param {number} service.timeForService - Time to execute the service
     * @example id: '63a576228ac157377b59bcec', 
     * type: 'MECHANICAL', 
     * upgradeLevel: 0, 
     * timeForService: 100}
     */
    const apiUserFetchService = useCallback((gameId) => {

        return new Promise(async (resolve, reject) => {
            try {

                let out = await axios.get(`user/service`,{
                    params: {
                        // gameId: gameId,
                    },
                    headers: {
                        authorization: cookies.authToken
                    }
                })
                console.log(JSON.stringify(out.data));
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, [])

    //get users purchased services in state active
    const apiUserFetchServices = useCallback((gameId) => {

        return new Promise(async (resolve, reject) => {
            try {

                let out = await axios.get(`user/services`,{
                    params: {
                        // gameId: gameId,
                    },
                    headers: {
                        authorization: cookies.authToken
                    }
                })
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, [])

    //Register user
    // sign out the user, memoized
    const apiUserRegister = useCallback((registerNumber, name, email) => {
        return new Promise(async (resolve, reject) => {
            try {
                let out = await axios.post('player/createPlayer', {
                    playerId: registerNumber,
                    name: name,
                    email: email
                })
                // user.id=out.id;
                // //Update user id
                // setUser(user);
                resolve(out)
            } catch (e) {
                reject(e);
            }
        })
    }, []);

    //Login user
    const apiUserLogin = useCallback((registerNumber, password) => {

        return new Promise(async (resolve, reject) => {
            try {
                let out = await axios.get(`user/login`, { 
                    params: { 
                        registerCode: registerNumber, 
                        password: password } 
                    })
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, []);

     //User stake function
     const apiUserStake = useCallback((userId, data ) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("User id " + userId)
                console.log(data.amount);
                console.log(data.fee);
                console.log(data.chainId);
                
                let out = await axios.get(`user/stake/add`,{
                    params: {
                        amount: data.amount,
                        fee: data.fee,
                        chainId: data.chainId,
                    },
                    headers: {
                      authorization: cookies.authToken
                    }
                })
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, []);

    //User unstake function
    const apiUserUnstake = useCallback((userId, data ) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("User id " + userId)
                
                let out = await axios.get(`user/stake/remove`,{
                    params: {
                        amount: data.amount,
                        fee: data.fee,
                        chainId: data.chainId,
                    },
                    headers: {
                      authorization: cookies.authToken
                    }
                })
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, []);

    //User create order function
    const apiUserCreateOrder= useCallback((price, chainId) => {
        return new Promise(async (resolve, reject) => {
            try {                
                let out = await axios.get(`user/order/place`,{
                    params: {
                        price: price,
                        chainId: chainId,
                    },
                    headers: {
                      authorization: cookies.authToken
                    }
                })
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, []);

    //User create order function
    const apiUserUpdateOrder= useCallback((price, orderId) => {
        return new Promise(async (resolve, reject) => {
            try {                
                let out = await axios.get(`user/order/update`,{
                    params: {
                        price: price,
                        orderId: orderId,
                    },
                    headers: {
                      authorization: cookies.authToken
                    }
                })
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, []);

    //User create order function
    const apiUserCancelOrder= useCallback((orderId) => {
        return new Promise(async (resolve, reject) => {
            try {                
                let out = await axios.get(`user/order/cancel`,{
                    params: {
                        orderId: orderId,
                    },
                    headers: {
                      authorization: cookies.authToken
                    }
                })
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, []);

    //User bid order function
    const apiUserBidOrder= useCallback((fee, orderId) => {
        return new Promise(async (resolve, reject) => {
            try {                
                let out = await axios.get(`user/order/bid`,{
                    params: {
                        fee: fee,
                        orderId: orderId,
                    },
                    headers: {
                      authorization: cookies.authToken
                    }
                })
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, []);

    //User stake function
    const apiUserAgentGet= useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {                
                let out = await axios.get(`user/agent`,{
                    params: {
                        // gameId: gameId,
                    },
                    headers: {
                        authorization: cookies.authToken
                    }
                })
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, []);

    //User bridge function
    const apiUserBridge = useCallback((amount, fee, chainIdFrom, chainIdTo ) => {
        return new Promise(async (resolve, reject) => {
            try {
                let out = await axios.get(`user/bridge`,{
                    params: {
                        amount: amount,
                        fee: fee,
                        sourceChainId: chainIdFrom,
                        targetChainId: chainIdTo
                    },
                    headers: {
                        authorization: cookies.authToken
                    }
                })
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, []);

    //User create sidechain function
    const apiUserCreateChain = useCallback((chainId, fee) => {
        return new Promise(async (resolve, reject) => {
            try {

                // setLoading(true);
                let out = await axios.get(`user/chain/create`, {
                    params: {
                        chainId: chainId,
                        fee: fee,
                    },
                    headers: {
                        authorization: cookies.authToken
                        }
                });
                // setLoading(false);
                resolve(out.data)
            } catch (e) {
                // setLoading(false);
                reject(e);
            }
        })
    }, []);

    //User attack a chain function
    const apiUserStealVoteON = useCallback((bridgeId) => {
        return new Promise(async (resolve, reject) => {
            try {
                // alert("Stealing")
                let out = await axios.get(`user/attack/steal/vote/on`, {
                    params: {
                        // gameId: gameId,
                        bridgeId: bridgeId,
                    },
                    headers: {
                        authorization: cookies.authToken
                        }
                });
                // setLoading(false);
                resolve(out.data)
            } catch (e) {
                // setLoading(false);
                reject(e);
            }
        })
    }, []);

    //User attack a chain function vote OFF
    const apiUserStealVoteOFF = useCallback((bridgeId) => {
        return new Promise(async (resolve, reject) => {
            try {

                // setLoading(true);
                let out = await axios.get(`user/attack/steal/vote/off`, {
                    params: {
                        // gameId: gameId,  
                        bridgeId: bridgeId,
                    },
                    headers: {
                        authorization: cookies.authToken
                        }
                });
                // setLoading(false);
                resolve(out.data)
            } catch (e) {
                // setLoading(false);
                reject(e);
            }
        })
    }, []);

    //User attack a chain api to get all uesr's steal votes
    const apiUserStealGet = useCallback(() => {
        return new Promise(async (resolve, reject) => {
            try {

                // setLoading(true);
                let out = await axios.get(`user/attack/steal/get`, {
                    params: {

                    },
                    headers: {
                        authorization: cookies.authToken
                        }
                });
                // setLoading(false);
                resolve(out.data)
            } catch (e) {
                // setLoading(false);
                reject(e);
            }
        })
    }, []);

    //User block a player Vote
    const apiUserBlockOn = useCallback((userId) => {
        return new Promise(async (resolve, reject) => {
            try {

                // setLoading(true);
                let out = await axios.get(`user/attack/block/vote/on`, {
                    params: {
                        userId: userId,
                    },
                    headers: {
                        authorization: cookies.authToken
                        }
                });
                // setLoading(false);
                resolve(out.data)
            } catch (e) {
                // setLoading(false);
                reject(e);
            }
        })
    }, []);

    //User attack a chain function vote OFF
    const apiUserBlockGet = useCallback(() => {
        return new Promise(async (resolve, reject) => {
            try {

                // setLoading(true);
                let out = await axios.get(`user/attack/block/get`, {
                    params: {

                    },
                    headers: {
                        authorization: cookies.authToken
                        }
                });
                // setLoading(false);
                resolve(out.data)
            } catch (e) {
                // setLoading(false);
                reject(e);
            }
        })
    }, []);



    //Fetch data of the latest game
    const apiGameFetch = useCallback(() => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await axios.get('game/get', {
                    params: { 

                         }
                });
                // console.log("Game data: " + alert(JSON.stringify(data.data)));
                resolve(data.data);
            } catch (e) {
                reject(e);
            }
        })
    }, [])

    //Fetch data of the latest game
    const apiGameChains = useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let chains = await axios.get('/game/chains/get', {
                    params: { 
                        
                         }
                });
                // alert(JSON.stringify(chains))
                console.log(chains)
                resolve(chains.data['chains']);
            } catch (e) {
                reject(e);
            }
        })
    }, [])

    //Fetch data of all the logged in players
    const apiGameUsers = useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {

                let data = await axios.get('/game/players/get', {
                    params: { 
                        
                         }
                });

                resolve(data.data);
            } catch (e) {
                reject(e);
            }
        })
    }, [])

    //Fetch data of all agents in the game
    const apiGameAgents = useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {

                let data = await axios.get('/game/agents/get', {
                    params: { 
                       
                         }
                });
                // console.log(data)
                resolve(data.data);
            } catch (e) {
                reject(e);
            }
        })
    }, [])

    //Fetch data of the latest game
    const apiGameOrders = useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await axios.get('/game/orders/get', { 
                    params: { 
                       
                    }
                    });
                resolve(data.data);
            } catch (e) {
                reject(e);
            }
        })
    }, [])

    //Fetch data of the latest game
    const apiGameTransactions = useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await axios.get('/game/transactions/get', { 
                    params: { 
                        
                    }
                    });
                resolve(data.data);
            } catch (e) {
                reject(e);
            }
        })
    }, [])


    //Create new game
    const apiGameCreate = useCallback(() => {
        return new Promise(async (resolve, reject) => {
            
            try {
                let data = await axios.get('game/control/create', {
                    headers: {
                        authorization: cookies.authToken
                    }
                  })
                resolve(data.data);
            } catch (e) {
                reject(e);
            }
        })
    }, [])

    //Initialize new game
    const apiGameInitialize = useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await axios.get('game/control/initialize', {
                    params: {
                        gameId: gameId,
                    },
                    headers: {
                        authorization: cookies.authToken
                    }
                  });
                resolve(data.data);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }, [])

    //Start the game
    const apiGameStart = useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await axios.get(`game/control/start`, {
                    params: {
                        // gameId: gameId
                    },
                    headers: {
                        authorization: cookies.authToken
                    }
                  });
                resolve(data.data);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }, [])

    //Pauset the game
    const apiGamePause= useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await axios.get(`game/control/pause`, {
                    params: {
                        // gameId: gameId
                    },
                    headers: {
                        authorization: cookies.authToken
                    }
                  });
                resolve(data.data);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }, [])

    //End the game
    const apiGameStop = useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await axios.get(`game/control/stop`, {
                    params: {
                        // gameId: gameId
                    },
                    headers: {
                        authorization: cookies.authToken
                    }
                  });
                resolve(data.data);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }, [])

    //Resume the game
    const apiGameResume= useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await axios.get(`game/control/resume`, {
                    params: {
                        // gameId: gameId
                    },
                    headers: {
                        authorization: cookies.authToken
                    }
                  });
                resolve(data.data);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }, [])

    

    // //End game
    // const apiGameEnd = useCallback(() => {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let data = await axios.get('game/end', {
    //                 headers: {
    //                     authorization: cookies.authToken
    //                 }
    //               });
    //             resolve(data.data);
    //         } catch (e) {
    //             console.log(e);
    //             reject(e);
    //         }
    //     })
    // }, [])

    const apiGameServices = useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await axios.get('game/services/get', { 
                    params: { 
                        gameId: gameId,
                    }
                    });
                resolve(data.data);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }, [])

    const apiGameBridges = useCallback(() => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await axios.get('game/bridges/get');
                resolve(data.data);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }, [])






    return (
        <AppContext.Provider value={{
            user, setUser,
            users, setUsers,
            game, setGame,
            chains, setChains,
            openCreateOrderModal,
            closeCreateOrderModal,
            openCancelOrderModal,
            confirmModalContent,
            modalContent, setModalContent,
            tradeModalContent, setTradeModalContent,
            cancelOrderModalContent, setCancelOrderModalContent,
            openTradeModal,
            updateActiveChain,
            activeChain,setActiveChain,
            active, setActive,
            cookies, setCookie, removeCookie,
            apiUserFetch,
            apiUserRegister,
            apiUserLogin,
            apiGameFetch,
            apiGameCreate,
            apiGameInitialize,
            apiGameChains,
            apiGameServices,
            apiGameStart,
            apiGameUsers,
            services, setServices,
            apiUserStake,
            apiUserBridge,
            apiUserCreateChain,
            loadingMain, setLoadingMain,
            apiUserUnstake,
            apiGameOrders,
            orders, setOrders,
            transactions, setTransactions,
            isTradeModalOpen, setIsTradeModalOpen,
            apiUserCreateOrder,
            apiUserFetchBalance,
            apiUserFetchStake,
            apiUserAgentGet,
            agent, setAgent,
            usersBalances, setUsersBalances,
            usersStakes, setUsersStakes,
            apiUserFetchService,
            service, setService,
            apiUserFetchServices,
            servicesAll, setServicesAll,
            apiUserBidOrder,
            apiGameTransactions,
            apiGameAgents,
            agents, setAgents,
            updateChainsState,
            updateOrdersState,
            updateTransactionsState,
            isCancelOrderModalOpen, setIsCancelOrderModalOpen,
            closeCancelOrderModal,
            apiUserUpdateOrder,
            apiUserCancelOrder,
            apiUserStealVoteON,
            apiUserStealVoteOFF,
            note, setNote,
            apiGamePause,
            apiGameStop,
            apiGameResume,
            isCancelVoteModalOpen, setIsCancelVoteModalOpen,
            cancelVoteModalContent, setCancelVoteModalContent,
            bridges, setBridges,
            apiGameBridges,
            apiUserBlockGet, apiUserStealGet,
            stealVotes, setStealVotes,
            blockVotes, setBlockVotes,
            cancelBlockMocalContent, setCancelBlockModalContent,
            isCancelBlockModalOpen, setIsCanclBlockModalOpen,
            updateServiceState,
            authToken, setAuthToken,
            userId, setUserId,
        }}>
            {props.children}
        </AppContext.Provider>
    )
};

export const useGlobalContext = () => {
    return useContext(AppContext)
};