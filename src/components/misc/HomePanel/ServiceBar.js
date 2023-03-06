import {useContext, useState, useEffect, useCallback, useRef } from "react";
import { AppContext } from "../../../context/context";
import {ProgressBar } from 'react-bootstrap';

const ServiceBar = () => {
    const context = useContext(AppContext);
    const [serviceCompleted, setServiceCompleted] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    function millisToMinutesAndSeconds(millis) {
        // console.log(context.service.duration)
        let d = new Date(1000*Math.round(millis/1000));
        if (d.getUTCMinutes() === 0) {
            return ( d.getUTCSeconds() + 's' );
        } else {
            return ( d.getUTCMinutes() + 'min ' + d.getUTCSeconds() + 's' );
        }
    }

    useInterval(async () => {
        if (context.service.state === "ACTIVE" ) {
            let timestamp = (new Date(context.service.updatedAt).getTime())
            // console.log(timestamp)
            let newServiceCompleted = Math.floor(((Date.now() - timestamp) / (context.service.duration*1000)) * 100);
            if (newServiceCompleted > 100) newServiceCompleted = 100;

            setServiceCompleted(newServiceCompleted);
            let timeLeft = (context.service.duration*1000) - (Date.now() - timestamp);
            if (timeLeft < 0) timeLeft = 0;
            // console.log(millisToMinutesAndSeconds(timeLeft))
            setTimeLeft(millisToMinutesAndSeconds(timeLeft));
        } else {
            setServiceCompleted(100);
        }
    }, 50);


    return (
        <>
            <div className="time-container">
                <div className="bar-container">
                    {/* <div className="bar-filler" style={{width: `${serviceCompleted}%`}}>
                        <span className="bar-label">{`${serviceCompleted}%`}</span>
                    </div> */}
                    <ProgressBar striped variant="success" now={serviceCompleted} label={`${serviceCompleted}%`} animated={(serviceCompleted < 100 ? true : false)} style={{borderRadius: "8px", height: "35px"}}/>
                    <div className="bottom">
                        {
                            (context.service.state !== "ACTIVE") ? (
                                <p>Time for service = {(context.service.duration)} s</p>
                            ) : (
                                <p>Time left = {timeLeft}</p>
                            )
                        }
                        <i></i>
                    </div>
                </div>
            </div>
        </>
    )
};

export default ServiceBar