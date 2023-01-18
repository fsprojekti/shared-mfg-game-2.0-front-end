import React, {useState, useEffect} from 'react';
import { useGlobalContext } from '../../../context/context';
import {Alert, Button, Card, Form, FormControl, InputGroup, ListGroup} from "react-bootstrap";

const DeleteSideChain = () => {
    const { game, chainMain, chains} = useGlobalContext();


    return (
        <>
            <div className="ranking-container">
                <div className="table-all-transactions-container">
                <Card style={{width: '25rem'}} size="lg">
                        <Form>
                            <Card.Header className={"bg-dark text-white"}><h5>Delete Side Chain</h5></Card.Header>
                            <InputGroup className="mb-3 p-2">
                                <InputGroup.Text id="input-user-registration-number">Chain Name</InputGroup.Text>
                                <FormControl ></FormControl>
                            </InputGroup>
                            <InputGroup className="mb-3 p-2">
                                <InputGroup.Text id="input-user-name">Block Time</InputGroup.Text>
                                <FormControl ></FormControl>
                            </InputGroup>
                            <InputGroup className="mb-3 p-2">
                                <InputGroup.Text id="input-user-password">Neki Neki</InputGroup.Text>
                                <FormControl ></FormControl>
                            </InputGroup>
                            <div className="d-flex justify-content-end p-2">
                                <Button variant="dark" type="button" className="p-2">
                                    Create
                                </Button>
                            </div>
                        </Form>
                    </Card>

                </div>
            </div>
        </>
    )
};

export default DeleteSideChain