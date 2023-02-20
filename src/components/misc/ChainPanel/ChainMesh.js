import React, { useRef, useEffect, useContext } from 'react';
import { AppContext } from '../../../context/context';
import { Network } from "vis-network";
import { DataSet } from 'vis-data'
import ChainData from './ChainData';
import 'vis/dist/vis-network.min.css';


//TODO: Naredi te node clickable
const ChainMesh = () => {
  const { chains, bridges, activeChain } = useContext(AppContext);

  

	const visJsRef = useRef(null);

  function colorNodeOnRefresh(nodes, chain){
    nodes.update(chain);
  }


  //TODO: na Page refresh se obarva trenutni chain
  useEffect(() => {
    

    let nodes =  new DataSet (chains.chains.map((item, index) => {
      let currentChain = parseInt(activeChain);
      return { id: item.id, label: `<b>${item.name}</b>`, x: (200*index),y: 10,color: {background: `${index == currentChain ? '#FBBF0C' : '#7DCDF5'}`}, title: `Stake: ${item.stake}, Balance: ${item.balance}`};
    }));


    let edges =  new DataSet (bridges.map(item => {
      return { from: item.chainSource, to:item.chainTarget, title: `🔁Bridge: ${item.name}`};
    }));


    const setNodeNetwork = async () => {
      const network = await
			visJsRef.current &&
			new Network(
				visJsRef.current,
				{ nodes, edges},
				{
					autoResize: true,
          interaction: {
            hover: true,
            dragNodes: false,// do not allow dragging nodes
            zoomView: false, // do not allow zooming
            dragView: false  // do not allow dragging
          },
          edges: {
            color: "#411811",
            width: 2,
            arrows: "middle"
          },
          nodes: {
            shape: 'database', //box, database, square, circle, ellipse...
            physics:false,
            font: {
              // required: enables displaying <b>text</b> in the label as bold text
              multi: 'html',
              // optional: use this if you want to specify the font of bold text
              bold: '16px arial black'
          },

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
        network.canvas.body.container.style.cursor = 'help';
      });

      network.on("hoverEdge", function (params) {
        network.canvas.body.container.style.cursor = 'help';
      });



      network.on("blurNode", function (params) {
        network.canvas.body.container.style.cursor = 'default';
      }); 
      
      network.on("blurEdge", function (params) {
        network.canvas.body.container.style.cursor = 'default';
      });  

    //   network.moveTo({
    //     position: {x: 0, y: 0},
    //     scale: 1,
    // })
      
      // network.on('afterDrawing', function(){
      // 	let data = new DataSet (chains.chains.map((item, index) => {
      //     let currentChain = parseInt(activeChain);
      //     return { id: item.id, x:100*index, y:0};
      //   }));
      //   nodes.update(data);
      // })


      




  };

  setNodeNetwork();
	
	}, [chains.chains.length, activeChain, bridges.length]);

	return (
    <div style={{backgroundColor: "rgba(255, 255, 255, 0.8)", borderColor: "transparent", boxShadow: "var(--light-shadow)", borderRadius: "8px", marginTop: "5px", marginLeft: "5px", marginBottom: "5px", width: "100%"}}>
      <div style={{maxHeight: "16rem", height: "100rem", width: "100%"}} ref={visJsRef} />
      <ChainData />
    </div>
)
};

export default ChainMesh