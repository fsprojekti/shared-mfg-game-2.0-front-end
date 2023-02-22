import React, { useRef, useEffect, useContext } from 'react';
import { AppContext } from '../../../context/context';
import { Network } from "vis-network";
import { DataSet } from 'vis-data'
import ChainData from './ChainData';
import 'vis/dist/vis-network.min.css';
import {
  FaHome,
} from 'react-icons/fa';
import { IconContext } from 'react-icons';


//TODO: Naredi te node clickable
const ChainMesh = () => {
  const { chains, bridges, activeChain } = useContext(AppContext);

  const renderIcon = () => {
    return (
      <IconContext.Provider>
        <FaHome/>
      </IconContext.Provider>
    )
};

	const visJsRef = useRef(null);

  function colorNodeOnRefresh(nodes, chain){
    nodes.update(chain);
  }


  //TODO: na Page refresh se obarva trenutni chain
  useEffect(() => {
    

    let nodes =  new DataSet (chains.chains.map((item, index) => {
      return { id: item.id, value: (parseInt(item.balance) + parseInt(item.stake)), label: `<b>${item.name}</b>`, x: (200*index),y: 10, color: {background: (item.name == chains["chains"][0].name ? '#f0c808' : '#2274a5')}, title: `Stake: ${item.stake}, Balance: ${item.balance}`};
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
					autoResize: false,
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
            shape: 'hexagon', //box, database, square, circle, ellipse...
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


  };

  setNodeNetwork();
	
	}, [chains.chains.length, activeChain, bridges.length]);

	return (
    <div style={{backgroundColor: "rgba(255, 255, 255, 0.8)", borderColor: "transparent", boxShadow: "var(--light-shadow)", borderRadius: "8px", marginTop: "5px", marginLeft: "5px", marginBottom: "5px", width: "100%"}}>
      <div style={{maxHeight: "15.5rem", height: "100rem", width: "100%"}} ref={visJsRef} />
      <ChainData />
    </div>
)
};

export default ChainMesh