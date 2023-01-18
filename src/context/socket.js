import React, {useState, useContext, useCallback} from 'react'
import io from "socket.io-client";


export const socket = io.connect('localhost:8000');
export const SocketContext = React.createContext();