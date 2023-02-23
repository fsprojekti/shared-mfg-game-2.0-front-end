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
        colors={{ scheme: 'category10' }}
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
                color: 'rgba(255, 255, 255, 0.9)',
                size: 4,
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
                    id: "You"
                },
                id: 'dots'
            },
        ]}

    /> 
    )
}

export default PieChart