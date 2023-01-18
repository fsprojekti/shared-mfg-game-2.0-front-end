import {Alert, Card} from "react-bootstrap";


const NotificationCard = (props) => {
        return (
            
            <>
                <Card style={{borderRadius: "8px", margin: "10px", marginTop: "10px", backgroundColor: "#FFCE00"}}>
                    <Card.Title style={{margin: "8rem", fontSize: "36px"}}> {props.heading} </Card.Title>
                </Card>
            </>
        )

};

export default NotificationCard;