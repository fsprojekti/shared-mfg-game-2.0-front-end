import {Alert, Button, Card, Col, Container, InputGroup, Row, Spinner} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import { AppContext } from "../../../context/context";

const AttackInfo = () => {

    const context = useContext(AppContext);
    const [loading, setLoading] = useState("");
    const [dataArray, setDataArray] = useState([]);

    useEffect(() => {
        const createDataArray = async () => { 
            const transactions = context.transactions;
            
            let AllAttackTransactions =  await transactions.filter(transaction => transaction.type === "ATTACK-GAIN" || transaction.type === "ATTACK-LOSS-STAKE" || transaction.type === "ATTACK-LOSS-BALANCE");
            console.log(AllAttackTransactions)
            let differentAttack = [];
            if (AllAttackTransactions.length > 0) {
                differentAttack.push(AllAttackTransactions[0]);
                await AllAttackTransactions.map((item) => {
                    let difference = item.timestamp - differentAttack[differentAttack.length-1].timestamp;
                    if(difference > 10000) differentAttack.push(item);
                    
                });
            }
            // console.log(differentAttack)
            


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
        <>
                    <Card style={{ borderRadius: "8px", boxShadow: "var(--light-shadow)", width: "100%", backgroundColor: "(255, 255, 255, 0.8)", borderColor: "transparent", height: "300px" }}>
                        <Row className="p-2">
                        <Col className={"p-2"}>

                        <h3> Attack status</h3>
                                <Card style={{ width: "100%",  borderColor: "transparent" }}>  
                                
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
                            </Col>

                        </Row>
                        







                    </Card>


        </>
    )
}


export default AttackInfo;