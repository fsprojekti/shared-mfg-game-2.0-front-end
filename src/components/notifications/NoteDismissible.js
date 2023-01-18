import {Alert} from 'react-bootstrap';


const NoteDismissible = (props) => {
        return (
            <>
                {props.show == true ? (
                    <Alert style = {{marginTop: "10px"}} variant={props.variant} onClose={() => {props.reportHide()}} dismissible>
                    <b>{props.heading} </b>
                    {props.msg}
                </Alert>
                ) : (
                    <></>
                )}
            </>
        )

};

export default NoteDismissible;