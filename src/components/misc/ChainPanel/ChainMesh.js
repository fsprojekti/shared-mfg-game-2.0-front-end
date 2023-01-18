import React, { useRef, useEffect, useContext } from 'react';
import { AppContext } from '../../../context/context';
import { Network } from "vis-network";
import { DataSet } from 'vis-data'
import { render } from '@testing-library/react';


//TODO: Naredi te node clickable
const ChainMesh = () => {
  const { chains,  setUser, setCookie, cookies, activeChain, updateActiveChain, apiUserFetch, bridges } = useContext(AppContext);

  

	const visJsRef = useRef(null);

  function colorNodeOnRefresh(nodes, chain){
    nodes.update(chain);
  }


  //TODO: na Page refresh se obarva trenutni chain
  useEffect(() => {

    console.log(chains);
    console.log(bridges);

    

    let nodes =  new DataSet (chains.map((item, index) => {
      let currentChain = parseInt(cookies.activeChain);
      return { id: item.id, label:item.name, color: {background: `${index == currentChain ? '#FBBF0C' : '#7DCDF5'}`}, title: 'Hello'};
    }));


    let edges =  new DataSet (bridges.map(item => {
      return { from: item.chainSource, to:item.chainTarget};
    }));


    const setNodeNetwork = async () => {
      const network = await
			visJsRef.current &&
			new Network(
				visJsRef.current,
				{ nodes, edges},
				{
					autoResize: true,
					edges: {
						color: "#411811"
					},
          interaction:{hover:true,},
          nodes: {
            shape: 'box' //box, database, square, circle, ellipse...
        },
          
				}
			)

      //TODO: Popravi da dela spet to šaltanje
      network.on("doubleClick", function (params) {
        if (params.nodes.length === 1) {
          // console.log(params.nodes[0])
          // console.log(localStorage.getItem("activeChain")+1);
          
          var previousNode = nodes.get(parseInt(cookies.activeChain));
          console.log(previousNode);
          // console.log(previousNode)
          previousNode.color = {
            background: '#7DCDF5',
          }
          nodes.update(previousNode);

          var nodeID = params.nodes[0];
          
          var clickedNode = nodes.get(nodeID);
          clickedNode.color = {
            background: '#FBBF0C',
          }
          
          nodes.update(clickedNode);
          updateActiveChain(nodeID);
          setCookie("activeChain",nodeID)

          apiUserFetch(cookies.userId, activeChain)
                .then(user => {
                    console.log("User" + user)
                    setUser({
                        id: user.id,
                        type: user.type,
                        state: user.state,
                        balance: user.balance,
                        stake: user.stake,
                        // typeOfService: user.typeOfService,

                    })
                }).catch(e => console.log(e))
  
         }
      });

      network.on("hoverNode", function (params) {
        network.canvas.body.container.style.cursor = 'grab';
        <span> <h2>Hello</h2></span>
      });

      network.on("blurNode", function (params) {
        network.canvas.body.container.style.cursor = 'default';
      });   

      




  };

  setNodeNetwork();
	
	}, [chains.length, cookies.activeChain]);

	return <div className="chain-network" ref={visJsRef} />;
};

export default ChainMesh