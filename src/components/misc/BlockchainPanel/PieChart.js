import {React, useContext} from "react";
import { AppContext } from "../../../context/context";
import { ResponsivePie } from '@nivo/pie'
import AutoSizer from "react-virtualized-auto-sizer";

const CenteredMetric = ({ centerX, centerY }) => {
    const { chains, cookies } = useContext(AppContext);
    
    let chainId = cookies.activeChain;
    let total = chains[chainId].totalStake;
    return (
        <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
                fontSize: '25px',
                fontWeight: '500',
            }}
        >
            {total}
        </text>
    )
};

// const PieChart = ({ data }) => (
//     <ResponsivePie
//         data={data}
//         theme={{ "fontSize": 16, fontFamily: "Roboto, sans-serif", axis: { legend: { text: { fontSize: "16px", fontWeight: "bold", fontFamily: "Roboto, sans-serif" } } } }}
//         margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
//         innerRadius={0.3}
//         padAngle={1}
//         cornerRadius={3}
//         // colors={{ scheme: 'yellow_orange_red' }}
//         borderWidth={1}
//         borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
//         enableRadialLabels={false}
//         sliceLabelsSkipAngle={10}
//         sliceLabelsTextColor="#333333"
//         sortByValue={true}
//         layers={['slices', 'sliceLabels', CenteredMetric]}
//     />
// );




const PieChart = ({ data}) => {
    const context = useContext(AppContext);

    return (
    


    <ResponsivePie 
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}


        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.2
                ]
            ]
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: context.user.name
                },
                id: 'dots'
            }
        ]}
        // legends={[
        //     {
        //         anchor: 'bottom',
        //         direction: 'row',
        //         justify: false,
        //         translateX: 0,
        //         translateY: 56,
        //         itemsSpacing: 0,
        //         itemWidth: 100,
        //         itemHeight: 18,
        //         itemTextColor: '#999',
        //         itemDirection: 'left-to-right',
        //         itemOpacity: 1,
        //         symbolSize: 18,
        //         symbolShape: 'circle',
        //         effects: [
        //             {
        //                 on: 'hover',
        //                 style: {
        //                     itemTextColor: '#000'
        //                 }
        //             }
        //         ]
        //     }
        // ]}
    /> 
    )
}

export default PieChart