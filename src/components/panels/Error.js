import React, {useContext} from 'react';
import Modal from '../misc/Modal';
import { AppContext } from '../../context/context';


const Error = () => {
    const {setModalContent} = useContext(AppContext);

    setModalContent('This page does not exist 🤯!');

    return (
        // <div className="d-flex flex-row justify-content-center flex-wrap">
        //     <h1> </h1>
        // </div>

        <>
            <Modal/>
        </>
    )
};

export default Error