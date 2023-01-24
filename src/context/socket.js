import React, {useState, useContext, useCallback} from 'react'
import io from "socket.io-client";
import config from "../config.json";


export const socket = io.connect(config.server);
export const SocketContext = React.createContext();