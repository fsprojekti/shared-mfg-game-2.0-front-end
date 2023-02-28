import {React, useContext} from "react";
import { AppContext } from "../../../context/context";
import { ResponsivePie } from '@nivo/pie'

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

const PieChart = ({ data}) => {
    const context = useContext(AppContext);

    return (
    


    <ResponsivePie 
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.2}
        cornerRadius={3}
        sortByValue={true}
        // enableArcLinkLabels={false}
        animate={false}
        colors={{ scheme: 'pastel1' }}
        activeOuterRadiusOffset={4}
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
        arcLinkLabelsDiagonalLength={30}
        arcLinkLabelsSkipAngle={9}
        // arcLinkLabelsTextColor="#333333"
        // arcLinkLabelsThickness={2}
        // arcLinkLabelsColor={{ from: 'color' }}
        // arcLabelsSkipAngle={2}
        // arcLabelsTextColor={{
        //     from: 'color',
        //     modifiers: [
        //         [
        //             'darker',
        //             2
        //         ]
        //     ]
        // }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: '#e73936',
                color: '#f0c808',
                size: 3,
                padding: 1,
                stagger: true,
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
            },
        ]}

    /> 
    )
}

export default PieChart