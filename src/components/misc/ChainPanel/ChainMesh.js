import React, { useRef, useEffect, useContext, useState } from 'react';
import { AppContext } from '../../../context/context';
import { Network } from "vis-network";
import { DataSet } from 'vis-data'
import 'vis/dist/vis-network.min.css';


//TODO: Naredi te node clickable
const ChainMesh = () => {
  const { chains, cookies, bridges } = useContext(AppContext);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

	const visJsRef = useRef(null);

  function colorNodeOnRefresh(nodes, chain){
    nodes.update(chain);
  }

  //TODO: Fix, so there is a addNode/Edge function that is run on every new chain/bridge in the state
  useEffect(() => {
    setNodes(new DataSet (chains.map((item, index) => {
      let currentChain = parseInt(cookies.activeChain);
      return { id: item.id, label:item.name, color: {background: `${index == currentChain ? '#FBBF0C' : '#7DCDF5'}`}, title: `Stake: ${item.stake}, Balance: ${item.balance}`};
    })))


    setEdges(new DataSet (bridges.map(item => {
      return { from: item.chainSource, to:item.chainTarget, title: `🔁Bridge: ${item.name}`};
    }))) 

  }, [bridges])


  //TODO: na Page refresh se obarva trenutni chain
  useEffect(() => {

    const setNodeNetwork = async () => {
      const network = await
			visJsRef.current &&
			new Network(
				visJsRef.current,
				{ nodes, edges},
				{
					autoResize: true,
          interaction:{hover:true},
          edges: {
            color: "#411811",
            width: 2,
          },
          nodes: {
            shape: 'dot', //box, database, square, circle, ellipse...,
      
        },
          
				}
			)

      //TODO: Popravi da dela spet to šaltanje
      // network.on("doubleClick", function (params) {
      //   if (params.nodes.length === 1) {
      //     // console.log(params.nodes[0])
      //     // console.log(localStorage.getItem("activeChain")+1);
          
      //     var previousNode = nodes.get(parseInt(cookies.activeChain));
      //     console.log(previousNode);
      //     // console.log(previousNode)
      //     previousNode.color = {
      //       background: '#7DCDF5',
      //     }
      //     nodes.update(previousNode);

      //     var nodeID = params.nodes[0];
          
      //     var clickedNode = nodes.get(nodeID);
      //     clickedNode.color = {
      //       background: '#FBBF0C',
      //     }
          
      //     nodes.update(clickedNode);
      //     updateActiveChain(nodeID);
      //     setCookie("activeChain",nodeID)

      //     apiUserFetch(cookies.userId, activeChain)
      //           .then(user => {
      //               console.log("User" + user)
      //               setUser({
      //                   id: user.id,
      //                   type: user.type,
      //                   state: user.state,
      //                   balance: user.balance,
      //                   stake: user.stake,
      //                   // typeOfService: user.typeOfService,

      //               })
      //           }).catch(e => console.log(e))
  
      //    }
      // });

      network.on("hoverNode", function (params) {
        network.canvas.body.container.style.cursor = 'grab';
      });


      network.on("blurNode", function (params) {
        network.canvas.body.container.style.cursor = 'default';
      }); 
      
      network.on("blurEdge", function (params) {
        network.canvas.body.container.style.cursor = 'default';
      });   


      




  };

  setNodeNetwork();
	
	}, [cookies.activeChain, nodes, edges]);

	return <div className="chain-network" ref={visJsRef} />;
};

export default ChainMesh