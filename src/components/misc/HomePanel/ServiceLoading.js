import React, {useState, useEffect, useRef} from 'react';
import  ReactTooltip from 'react-tooltip'

const ServiceLoading = (data) => {
    const { id, consumer, provider, type, updatedAt, duration } = data.item;

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
        let d = new Date(1000*Math.round(millis/1000));
        if (d.getUTCMinutes() === 0) {
            return ( d.getUTCSeconds() + 's' );
        } else {
            return ( d.getUTCMinutes() + 'min ' + d.getUTCSeconds() + 's' );
        }
    }

    useInterval(async () => {
        let timestamp = (new Date(updatedAt).getTime())
        // // let newServiceCompleted = Math.floor(((Date.now() - gameData.player.serviceTimestamp) / gameData.player.timeForService) * 100);
        // let newServiceCompleted = Math.floor(((Date.now() - timestamp) / (duration*1000)) * 100);
        // setServiceCompleted(newServiceCompleted);

        const calculateTimeLeft = async () => {
            // let timeLeft = timeForService - (Date.now() - serviceTimestamp);
            let timeLeft = (duration*1000) - (Date.now() - timestamp);

            let relativeTime = Math.floor(((Date.now() - timestamp) / (duration*1000)) * 100);

            if (relativeTime < 0 || timeLeft < 0) {
                relativeTime = 100;
                timeLeft = 0;
            }
            setTimeLeft(millisToMinutesAndSeconds(timeLeft));
            setServiceCompleted(relativeTime);
        };
        calculateTimeLeft();
    }, 50);


    return (
        <>
            <div className="service-container" data-tip data-for={id}>
                <p>{type}</p>
                <div id="divSpinner" className="spinner-loading">
                    <div className="loading-text">{serviceCompleted}%</div>
                </div>
                <ReactTooltip  id={id} place="right" type="dark" effect="solid" >
                    <ul>
                        <li>Consumer: {consumer}</li>
                        <li>Provider: {provider}</li>
                        <li>Time left: {timeLeft}</li>
                    </ul>
                </ReactTooltip>
                {/* <Tooltip className="service-tooltip">
                    <ul>
                        <li>Consumer: {consumer}</li>
                        <li>Provider: {provider}</li>
                        <li>Time left: {timeLeft}</li>
                    </ul>
                </Tooltip> */}
            </div>
        </>
    )
};

export default ServiceLoading