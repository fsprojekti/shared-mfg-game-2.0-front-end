import {Button, Card} from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';


const NotifCardDissmisable = (props) => {
        return (
            <>
                {props.show == true ? (
                    <div className={`${'modal-confirm-overlay show-modal-confirm'}`}  >
                    
                    <Card style={{borderRadius: "8px", backgroundColor: props.color, padding: "2rem"}}>
                         <div style={{position: "absolute", top: -5, right: -5, alignSelf: "end", justifyItems: "start"}} >
                            <Button style={{backgroundColor: "transparent", borderColor: "transparent"}} onClick={props.reportHide}><FaTimes></FaTimes></Button>
                        </div>
                        
                        <Card.Title style={{ fontSize: "24px"}}> {props.heading} </Card.Title>
                        <Card.Subtitle>{props.msg}</Card.Subtitle>
                       
                       
                    </Card>
                        
                    </div>
                    
                ) : (
                    <></>
                )}
            </>
        )

};

export default NotifCardDissmisable;