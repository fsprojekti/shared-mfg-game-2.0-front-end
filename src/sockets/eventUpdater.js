import { SocketContext } from "../context/socket";
import { AppContext } from "../context/context";
import {useContext, useState, useEffect, useCallback} from "react";

const EventUpdater = () => {
    const context = useContext(AppContext);
    const socket = useContext(SocketContext);

    const socketChain = (chainUpdate) => {
        console.log("Message received: ", chainUpdate);
        console.log(context.chains)
        // const chains = context.chains;
        // console.log(context.chains.findIndex(c => c.id === chainUpdate.id))
        // let index = context.chains.findIndex(c => c.id === chainUpdate.id);
        // const index = context.chains.findIndex(c => {
        //     return c.id === chainUpdate.id;
        //   });
        // console.log(chains)
        // const index = chains.findIndex(c => {
        //     return c.id === chainUpdate.id;
        //   });
        //   console.log(index)
        
        // console.log(context.chains[index])
        // let chains = context.chains;
        // chains[index] = chainUpdate;
        // console.log(chains[index])
        
        // context.setChains({...context.chains, index:{chainUpdate}});
        // context.setChains((prevChains) => {
        //   const chains = {...prevChains};
        //   console.log(chains)
        //   const index = chains.findIndex(c => {
        //     return c.id === chainUpdate.id;
        //   });
        //   console.log(index)
        //   if(index !== -1) {
        //     chains[index] = chainUpdate;
        //     console.log(chains[index])
        //     return chains;
        //   }
        //     return prevChains;         
        // });
      };

    useEffect(() => {    
        // subscribe to socket events
        socket.on("chain", socketChain); 
    
        return () => {
          socket.off("chain");
        };
      }, [socket]);




};

export default EventUpdater