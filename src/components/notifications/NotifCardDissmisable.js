import {Card, CloseButton} from 'react-bootstrap';


const NotifCardDissmisable = (props) => {
        return (
            <>
                {props.show == true ? (
                    <div className={`${'modal-confirm-overlay show-modal-confirm'}`}  >
                    
                    <Card style={{borderRadius: "8px", backgroundColor: props.color, padding: "2rem"}}>
                         <div style={{position: "absolute", top: 8, right: 8, alignSelf: "end", justifyItems: "start"}} >
                            <CloseButton onClick={props.reportHide}></CloseButton>
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