export const getChainsNamesFromBridgeObject = (bridgeId, bridges, chains) => {
   let bridge = bridges.filter(item => item._id === bridgeId);

   // console.log(bridge[0]);
   let bridgeChains = chains.filter(item => item.id === bridge[0].chainSource || item.id === bridge[0].chainTarget);
   let names = bridgeChains.map(item => item.name);
   return names;
};


    
export const justAnAlert = () => {
   alert('hello');
};