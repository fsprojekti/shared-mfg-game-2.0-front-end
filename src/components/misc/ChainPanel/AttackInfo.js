import {Card, Col, InputGroup, Row} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import { AppContext } from "../../../context/context";

const AttackInfo = () => {

    const context = useContext(AppContext);
    const [dataArray, setDataArray] = useState([]);

    useEffect(() => {
        const createDataArray = async () => { 
            const transactions = context.transactions;
            
            let AllAttackTransactions =  await transactions.filter(transaction => transaction.type === "ATTACK-GAIN" || transaction.type === "ATTACK-LOSS-STAKE" || transaction.type === "ATTACK-LOSS-BALANCE");
            // console.log(AllAttackTransactions)
            let differentAttack = [];
            if (AllAttackTransactions.length > 0) {
                differentAttack.push(AllAttackTransactions[0]);
                await AllAttackTransactions.map((item) => {
                    let difference = item.timestamp - differentAttack[differentAttack.length-1].timestamp;
                    if(difference > 10000) differentAttack.push(item);
                    
                });
            }


            let AttackGainArray = transactions.filter(transaction => transaction.type === "ATTACK-GAIN" && transaction.to == context.agent.account);
            // console.log(AttackGainArray)
            const gainAmount = AttackGainArray.reduce((prev,next) => prev + next.amount,0);
            // console.log("Gain amount: " + gainAmount);

            let AttackLossArray = transactions.filter(transaction => (transaction.type === "ATTACK-LOSS-STAKE" && transaction.from == context.agent.account) || (transaction.type === "ATTACK-LOSS-BALANCE" && transaction.from == context.agent.account));
            // console.log(AttackGainArray)
            const lossAmount = AttackLossArray.reduce((prev,next) => prev + next.amount,0);
            // console.log("Loss amount: " + lossAmount);


            setDataArray({noAttack: (differentAttack.length), gain: gainAmount, loss: lossAmount});
        };
        createDataArray();
    }, [context.transactions]);


    return (
        <div style={{justifyContent: "center", alignItems: "center" }}>
            <Card  style={{ borderRadius: "8px", boxShadow: "var(--light-shadow)",  backgroundColor: "(255, 255, 255, 0.8)", borderColor: "transparent"}}>

                <h3> Attack status</h3>
                        <Card style={{  borderColor: "transparent" }}>  
                        
                            <Card.Body>
                            <div className={"d-flex justify-content-between flex-wrap"}>
                                    <div className={"p-2 align-self-center"}>
                                        <b>No. of attacks</b>
                                    </div>
                                    <div className={"p-2 align-self-center"} style={{minWidth: '115px'}}>
                                    <InputGroup.Text><b>{dataArray.noAttack}</b></InputGroup.Text>
                                    </div>
                                </div>
                            <div className={"d-flex justify-content-between flex-wrap"}>
                                <div className={"p-2 align-self-center"}>
                                    <b>Attack gain</b>
                                </div>
                                <div className={"p-2 align-self-center"} style={{minWidth: '115px'}}>
                                    
                                    <InputGroup.Text><b>{dataArray.gain}</b></InputGroup.Text>
                                </div>
                            </div>
                            <div className={"d-flex justify-content-between flex-wrap"}>
                                <div className={"p-2 align-self-center"}>
                                    <b>Attack loss</b>
                                </div>
                                <div className={"p-2 align-self-center"} style={{minWidth: '115px'}}>

                                    <InputGroup.Text><b>{dataArray.loss}</b></InputGroup.Text>
                                </div>

                            </div>
                            </Card.Body>
                        </Card>
            </Card>
        </div>
    )
}


export default AttackInfo;