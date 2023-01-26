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
    //Stake index
    //needed because of the way data is returned from api
    const [stakeIndex, setStakeIndex] = useState(0);
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
    const [agent, setAgent] = useState({
        id: "FF",
        timeForService: "000",
        type: "TYPE",
        upgradeLevel: 0,
    });

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

    //Ranking
    const [ranking, setRanking] = useState([]);

    const [note, setNote] = useState({
        show: false,
        type: "info",
        msg: "Default message",
        heading: "Test"
    })


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

    const updateChainsState = async (chainObj) => {
        // console.log(chainObj);
        setChains((chains) => {
            const oldChains = [...chains];

            //Check if chain already exists in the state
            const index = oldChains.findIndex(c => {
                return c.id === chainObj.id;
            });

            //If chain exists, update its state
            if(index !== -1) {
                oldChains[index].balance = chainObj.balance;
                oldChains[index].stake = chainObj.stake;

                //Check if block number is higher than the one in current state
                if(chainObj.blockNumber > oldChains[index].blockNumber){
                    //Checking if this is a first run, to calculate time difference between server and client
                    if(oldChains[index].timeDiff === undefined) { 
                        let difference = Date.now() - (new Date(oldChains[index].updatedAt)).getTime() - 10000;
                        setCookie('timeDiff', difference);  
                        oldChains[index].timeDiff = difference;
                    }          
                    
                    oldChains[index].updatedAt = Date.now() - oldChains[index].timeDiff
                    oldChains[index].blockNumber = chainObj.blockNumber; 
                }
   
                // console.debug("Time subtracted from current time: " + oldChains[index].timeDiff);

                return oldChains;
            } else if(index == -1 && chainObj.id !== undefined) {
                oldChains.push(chainObj);
                return oldChains;
            }
            
            return chains;         
        });

    }

    
    const updateOrdersState = (orderObj) => {
        console.log("ORDER EVENT");
        console.log(orderObj);
          setOrders((oldOrders) => {
            const orders = [...oldOrders];

            const index = orders.findIndex(c => {
                return c._id === orderObj.id;
            });

            if(index !== -1) {
                console.log("updating existing")
                console.log(orders[index]);
                orders[index].state = orderObj.state;
                orders[index].price = orderObj.price;
                return orders;
            } else if(index == -1 && orderObj.id !== undefined) {
                console.log("pushing");
                console.log(orderObj.chain._id);
                //The new object I get is not in the correct format, so I need to create a new one
                let newOrder = {};
                newOrder._id = orderObj.id;
                newOrder.chain = orderObj.chain._id;
                newOrder.state = orderObj.state;
                newOrder.service = orderObj.service._id;
                newOrder.price = orderObj.price;
                orders.push(newOrder);
                return orders;
            }
            
            return oldOrders;         
        });

    }

    const updateServiceState = (serviceObj) => {
        console.log("SERVICE EVENT")
        console.debug(serviceObj);
        setServicesAll((oldServices) => {
            const services = [...oldServices];

            const index = services.findIndex(c => {
                return c._id === serviceObj.id;
            });

            //Have to "manually" update keys, because the obejct from event doesn't have the same structure as the one in the state
            if(index !== -1) {
                console.debug("Updating service")
                services[index].state = serviceObj.state;
                services[index].updatedAt = Date.now();
                return services;
            } else if(index == -1) {
                console.debug("Pushing service")
                services.push(serviceObj);
                return services;
            }
            
            return oldServices;         
        });

        setService((oldService) => {
            let service = oldService;

            if(serviceObj.agent == agent.id) {
                console.debug("Updating user service")
                service.stateOld = service.state;
                service.state = serviceObj.state;
                service.updatedAt = Date.now();
                service.duration = serviceObj.duration;
                return service;
            }             
            return oldService;         
        });
        
    }

    const updateTransactionsState = (transObj) => {
        console.log("TRANSACTION EVENT");
        console.log(transObj);
        //   setOrders((oldTrans) => {
        //     const transactions = [...oldTrans];

        //     console.log(transactions)
        //     const index = transactions.findIndex(c => {
        //         return c.id === transObj.id;
        //     });
        //     console.log(index)
        //     if(index !== -1) {
        //         console.log("updating existing")
        //         transactions[index].state = transObj.state;
        //         return transactions;
        //     } else if(index == -1) {
        //         console.log("pushing");
        //         console.log(transObj.chain._id)
        //         transObj.chain = transObj.chain._id;
        //         transactions.push(transObj);
        //         console.log(transactions)
        //         return transactions;
        //     }
            
        //     return oldTrans;         
        // });

    }

    const updateRankingState = (rankingObj) => {
            console.log(rankingObj);
            setRanking((oldRanking) => {
                let ranking = [...oldRanking];
                ranking = rankingObj;
                return ranking;
            })
        }


    //--------------------- API requests ------------------------------------------------------


    /**
     * Fetches user's data
     * @returns {Object} user - User's object
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
     * @returns {Object[]} balances - Array of balances on all chains .
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
     * @returns {Object[]} stakes - Array of stakes on all chains .
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
     * @returns {Object} service - User's service object
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

    /**
     * Fetches user's purchased services
     * @param {Object[]} service - Array of user's services
     */
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

    /**
     * Register user function
     * @param {string} registerNumber - User's register number
     * @param {string} name - User's name
     * @param {string} email - User's email
     */
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

    /**
     * Login user function
     * @param {string} registerCode - User's register number
     * @param {string} password - User's password
     */
    const apiUserLogin = useCallback((registerCode, password) => {

        return new Promise(async (resolve, reject) => {
            try {
                let out = await axios.get(`user/login`, { 
                    params: { 
                        registerCode: registerCode, 
                        password: password } 
                    })
                resolve(out.data)
            } catch (e) {
                reject(e);
            }
        })
    }, []);

     /**
      * User's stake function
      * @param {Object} data - User's stake data. 
      * @param {string} data.amount - User's stake amount
      * @param {string} data.fee - User's stake fee
      * @param {string} data.chainId - User's stake chain id
      */
     const apiUserStake = useCallback((data ) => {
        return new Promise(async (resolve, reject) => {
            try {
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

    /**
     * User's unstake function
     * @param {Object} data - User's stake data.
     * @param {string} data.amount - User's stake amount
     * @param {string} data.fee - User's stake fee
     * @param {string} data.chainId - User's stake chain id
     */
    const apiUserUnstake = useCallback((data ) => {
        return new Promise(async (resolve, reject) => {
            try {                
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

    /**
     * User's create order function
     * @param {number} price - User's order price
     * @param {string} chainId - User's order chain id
     */
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

    /**
     * User's update order function
     * @param {number} price - User's updated order price
     * @param {string} orderId - User's order id
     */
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

    /**
     * User's cancel order function
     * @param {string} orderId - User's order id
     */
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

    /**
     * User's bid order function
     * @param {number} fee - User's bid fee
     * @param {string} orderId - User's order id
     */
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

    /**
     * User's get agent function
     * @returns {Object} - User's agent data
     */
    const apiUserAgentGet= useCallback(() => {
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

    /**
     * Api user bridge function
     * @param {number} amount - User's bridge amount
     * @param {number} fee - User's bridge fee
     * @param {string} chainIdFrom - User's bridge chain id from
     * @param {string} chainIdTo - User's bridge chain id to
     */
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

    /**
     * Api user create chain function
     * @param {string} chainId - User's chain id
     * @param {number} fee - User's chain fee
     */
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

    /**
     * Api user vote to attack a bridge function
     * @param {string} bridgeId - User's bridge id
     */
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

    /**
     * Api user retract vote to attack a bridge function
     * @param {string} bridgeId - User's bridge id
     */
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

    /**
     * Api user get user's steal votes function
     * @returns {Object[]} - User's steal votes data
     */
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

    /**
     * User vote to block a player function
     * @param {string} userId - User's id
     */
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


    /**
     * User retract vote to block a player function
     * @param {string} userId - User's id
     */
    const apiUserBlockOff = useCallback((userId) => {
        return new Promise(async (resolve, reject) => {
            try {

                // setLoading(true);
                let out = await axios.get(`user/attack/block/vote/off`, {
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


    /**
     * Api user get user's block votes function
     * @returns {Object[]} - User's block votes data
     */
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



    /**
     * Api get game data function
     * @returns {Object} - Game data
     */
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

    /**
     * Api get chains function
     * @returns {Object[]} - Chains data
     */
    const apiGameChains = useCallback(() => {
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

    /**
     * Api get users function
     * @returns {Object[]} - Users data
     */
    const apiGameUsers = useCallback(() => {
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

    /**
     * Api get agents function
     * @returns {Object[]} - Agents data
     */
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

    /**
     * Api get orders function
     * @returns {Object[]} - Orders data
     */
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

    /**
     * Api get transactions function
     * @returns {Object[]} - Transactions data
     */
    const apiGameTransactions = useCallback(() => {
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


    /**
     * Admin create game function.
     * Only admin can use it.
     */
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

    /**
     * Admin initialize game function.
     * Only admin can use it.
     */
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

    /**
     * Admin start game function.
     * Only admin can use it.
    */
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

    /**
     * Admin pause game function.
     * Only admin can use it.
     */
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

    /**
     * Admin stop game function.
     * Only admin can use it.
     */
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

    /**
     * Admin resume game function.
     * Only admin can use it.
     */
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

    /**
     * Api get services function
     * @returns {Object[]} - Services data
     */
    const apiGameServices = useCallback((gameId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await axios.get('game/services/get', { 
                    params: { 
                        // gameId: gameId,
                    }
                    });
                resolve(data.data);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }, [])

    /**
     * Api get bridges function
     * @returns {Object[]} - Bridges data
     */
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
            stakeIndex, setStakeIndex,
            apiUserBlockOn, apiUserBlockOff,
            ranking, setRanking,
            updateRankingState
        }}>
            {props.children}
        </AppContext.Provider>
    )
};