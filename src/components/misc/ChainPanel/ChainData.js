import React, {useContext} from 'react';
import {AppContext} from "../../../context/context";


const ChainData = () => {
    const { chains, cookies, setCookie, updateActiveChain} = useContext(AppContext);


    async function changeChain(chainId){
        setCookie("activeChain", chainId);
        updateActiveChain(chainId);
        console.log(chains.chains[chainId]);
        console.log("ACtive chain:" + chains.chains[chainId].id);
    }


    return (
        <>
            <div className="d-flex justify-content-space-evenly flex-column" style={{boxShadow: "var(--light-shadow)", margin: "5px"}}>
                <div>
                    <div style={{height: "auto", overflow: "auto", border: '1px solid rgb(211, 211, 211)', borderRadius: "8px 8px 8px 8px"}}>
                        <table className="table-all-rankings">
                            <thead>
                            <tr>
                                <th>Chain ID</th>
                                <th>Chain Name</th>
                                <th>Block no.</th>
                                <th>Balance</th>
                                <th>Staked</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                chains.chains.map((item, index) => (
                                    <tr
                                        key={item._id} //TODO: Naredi da se gleda trenutni chain {}
                                        style={{background: `${item.name === chains.chains[cookies.activeChain].name ? '#FBBF0C' : ''}`, cursor:"pointer"}}
                                        // onClick={changeChain(index)}
                                        onClick={(item) => (changeChain(index))} 
                                    >
                                        <td><strong>{index + 1}</strong></td>
                                        <td>{item.name}</td>
                                        <td>{item.blockNumber}</td>
                                        <td>{item.balance}</td>
                                        <td>{item.stake}</td>
                                        {/* <td>{item.transactions.length()}</td> */}
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
};

export default ChainData