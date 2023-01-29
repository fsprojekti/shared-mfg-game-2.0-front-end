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


export const checkNumber = async (input1, input2, balance) => {
   console.log("Im in");
   if ((input1 === undefined || input1 === "" || input1 == 0)) {
   return ({state: -1, msg:"You must enter a value"});
   } else {
      if ((isNaN(input1) || input1 < 0) || (isNaN(input2) || input2 < 0)) {
         return ({state: -1, msg: "You must enter positive numbers"});
      } else {
         if (countDecimals(input1) > 0)  {
               return ({state: -1,msg:"Amount must be an integer"});
         } else {
               if (parseInt(input1) + parseInt(input2) > balance) {
                  return ({state: -1, msg:"Amount + TxFee is bigger than balance"});
               } else {
                  return ({state: 1, msg:"OK"});
               }
         }
      }
   }

};

const countDecimals = (value) => {
   if(Math.floor(value).toString() === value) return 0;
   return value.toString().split(".")[1].length || 0;
};