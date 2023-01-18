import React from 'react';
import {
    FaHome,
    FaUserFriends,
    FaChartPie,
    FaChartBar,
    FaConnectdevelop
} from 'react-icons/fa';
import {
    GiStoneBridge,
    GiTakeMyMoney,
} from 'react-icons/gi';


export const links = [
    {
        id: 1,
        url: '/',
        text: 'Home',
        icon: <FaHome />,
    },
    {
        id: 2,
        url: '/trade',
        text: 'Trade',
        icon: <FaUserFriends />,
    },
    {
        id: 3,
        url: '/blockchain',
        text: 'Blockchain',
        icon: <FaChartPie />,
    },
    {
        id: 4,
        url: '/ranking',
        text: 'Ranking',
        icon: <FaChartBar />,
    },
    {
        id: 5,
        url: '/chains',
        text: 'Chains',
        icon: <FaConnectdevelop />,
    },
    {
        id: 6,
        url: '/bridge',
        text: 'Bridge',
        icon: <GiStoneBridge />,
    },
    {
        id: 7,
        url: '/attack',
        text: 'Attack',
        icon: <GiTakeMyMoney />,
    }
];
