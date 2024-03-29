import React, {useContext} from 'react'
import { ResponsiveBar } from '@nivo/bar';
import { AppContext } from '../../../context/context';
import { patternDotsDef, patternSquaresDef, patternLinesDef } from '@nivo/core'
import { Card } from 'react-bootstrap';

const BarChart = ({dataArray, modifiedData, checked}) => {
    const {openTradeModal, setTradeModalContent, openCancelOrderModal, setCancelOrderModalContent, service,services, agent} = useContext(AppContext);
    const setTradeModal = (data) => {

        const modalService = services["services"].filter(service => service._id  == data.service && service.state == "MARKET");

        if (modalService.length == 0 && data.service != service["service"]._id && data.serviceType != service["service"].type) {
            setTradeModalContent(data);
            openTradeModal();
        } else if(modalService && data.service != service["service"]._id && data.serviceType != service["service"].type){
            setCancelOrderModalContent(data);
            openCancelOrderModal();
        }
    };

    const mouseHover = (data, event) => {
        if (data.serviceType !== service["service"].type) {
            event.target.style.cursor = 'pointer';
        } else {
            if (data.service === service["service"]._id) {
                event.target.style.cursor = 'not-allowed';
            }
            else {
                event.target.style.cursor = 'not-allowed';
            }
        }
    };

    const renderLabel = (data) => {
        const realData = dataArray.filter(item => item._id === data._id);
        if (!(!Array.isArray(realData) || !realData.length)) {
            if (!checked) {
                return ( realData[0].price.toString() + '');
            } else {
                return (realData[0].serviceDuration);
            }
        }
    };

    const toggleData = () => {
        if (!checked) {
            return [ 'heightPrice' ];
        } else {
            return [ 'heightTime' ]
        }
    };

    const toggleNameAxis = () => {
        if (!checked) {
            return ('PRICE');
        } else {
            return ('TIME FOR SERVICE');
        }
    };

    function millisToMinutesAndSeconds(millis) {
        // console.log(context.service.duration)
        let d = new Date(1000*Math.round(millis/1000));
        if (d.getUTCMinutes() === 0) {
            return ( d.getUTCSeconds() + 's' );
        } else {
            return ( d.getUTCMinutes() + 'min ' + d.getUTCSeconds() + 's' );
        }
    }


    return (
        <ResponsiveBar
            data={dataArray}
            onClick={(data) => setTradeModal(data.data)}
            onMouseEnter={(data, event) => mouseHover(data.data, event)}
            keys={toggleData()}
            indexBy="providerName"
            borderRadius="8px"
            borderWidth="1px"
            margin={{ top: 10, right: 20, bottom: 50, left: 70 }}
            padding={0.25}
            valueScale={{ type: 'symlog'}}
            theme={{ "fontSize": 14, fontFamily: "Roboto, sans-serif", axis: { legend: { text: { fontSize: "16px", fontWeight: "bold", fontFamily: "Roboto, sans-serif" } } } }}
            colors={d => d.data.color}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: toggleNameAxis(),
                legendPosition: 'middle',
                legendOffset: -50,
                tickValues: 3
            }}
            tooltip={({ data }) => {
                return (
                    <Card style={{opacity: "0.8"}}>
                        <b>Price: {(data.price == undefined ? '0' : (data.price))}</b>
                        <b>Time for service: {millisToMinutesAndSeconds(data.serviceDuration*1000)} </b>
                    </Card>

                )
            }}
            label={(data) => renderLabel(data.data)}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="white"
            animate={false}
            motionStiffness={90}
            motionDamping={15}
            defs={[
            // using helpers (cannot be used with http rendering API)
            // will use color from current element
            patternDotsDef('dots', { color: 'black', background: 'inherit', padding: 4, stagger: true }),
            patternLinesDef('lines-pattern', {
            "spacing": 10,
            "rotation": -55,
            "lineWidth": 2,
            "background": "inherit",
            "color": "#000000",
            
            }),
            // will use background color from current element
            patternSquaresDef('squares', { background: 'inherit' }),
            // using plain object
            { id: 'custom', type: 'patternSquares', size: 24 },
            ]}
            fill={[
                {
                match: 
                    d => d.data.data.agentId === agent.id,
                id: 'lines-pattern'
            },
                // { match: '*', id: 'custom' },
        ]}
        />
    )
};


export default BarChart