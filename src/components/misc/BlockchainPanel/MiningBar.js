import React, {useState, useEffect, useRef, useContext} from 'react';
import { AppContext } from '../../../context/context';

const MiningBar = (props) => {
    const context = useContext(AppContext);
    const [timeLeft, setTimeLeft] = useState('');
    const [width, setWidth] = useState(0);

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
        const createdMillis = new Date(context.chains[context.activeChain].updatedAt).getTime();
        let timeLeft = 10000 - (Date.now() - createdMillis);
        let width = Math.floor((((Date.now() - createdMillis) / 10000)) * 100);
        if (width < 0 || timeLeft < 0) {
            width = 0;
            timeLeft = 0;
        }
        setTimeLeft((timeLeft/1000).toFixed(2));
        setWidth(width);
    }, 50);


    return (
        <>
            <div className={`mining-progress-container${props.version}`}>
                <div className={`mining-progress-flex${props.version}`}>
                
                    <div className={`mining-progress${props.version}`}>
                        <div className={`mining-progress-filler${props.version}`} style={{width: `${width}%`}}></div>
                    </div>
                </div>
                {props.showText === "false" ? null : <span className="mining-progress-text">Time left: {timeLeft}  s</span>}
                
            </div>
        </>
    )
};

export default MiningBar