import {Button, Card, Form, FormControl, InputGroup, Row, Col} from "react-bootstrap";
import {useContext, useState} from "react";
import { AppContext } from "../../context/context";
import { Formik } from 'formik';
import * as yup from 'yup';

const registratonSchema = yup.object().shape({
    registerPlayerId: yup.number()
        .required("Player ID is required")
        .min(5, "Player ID must be at least 5 characters long"),
    name: yup.string()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters long"),
    email: yup.string()
        .required("Email is required"),
  });

const loginSchema = yup.object().shape({
    loginPlayerId: yup.number()
        .required("Player ID is required"),
    password: yup.string()
        .required("Password is required")
    });


const PanelLogin = () => {
    const context = useContext(AppContext);

    let register = async (registerPlayerId, registerName, registerEmail) => {
        try {
            let data = await context.apiUserRegister(registerPlayerId, registerName, registerEmail);
            context.setNote((prevState) => {
                return({
                  ...prevState,
                  msg: "Check you email!",
                  heading: 'Successfully registered',
                  show: true,
                  type: 'success'
                });
              });
        } catch (e) {
            console.log(e)
            context.setNote((prevState) => {
                return({
                  ...prevState,
                  msg: e.message,
                  heading: 'Error',
                  show: true,
                  type: 'danger'
                });
              });
        }
    }


    let login = async (logiPlayerId, loginPassword) => {
        try {
            //Login user
            let data = await context.apiUserLogin(logiPlayerId, loginPassword);

            //Set cookies
            await context.setCookie("authToken", data.token);
            await context.setCookie("userId", data.user.id);

            //Set cookies in context variables
            context.setUserId(data.user.id);

            //Set user
            context.setUser({
                state: data.user.state,
                id: data.user.id,
                type: data.user.type,
                name: data.user.name,
            });

            context.setNote((prevState) => {
                return({
                  ...prevState,
                  msg: data.message,
                  heading: 'Success',
                  show: true,
                  type: 'success'
                });
              });


            window.location.reload(true)


        } catch (e) {
            // console.log(e)
            context.setNote((prevState) => {
                return({
                  ...prevState,
                  msg: e.response.data.message,
                  heading: 'Error',
                  show: true,
                  type: 'danger'
                });
              });
        }
    }

    return (
        <div>
            <div className="d-flex flex-row justify-content-center flex-wrap" style={{paddingTop: "15%"}}>
                <div className={"d-flex p-3"}>
                    <Card as={Row} style={{width: '25rem', borderRadius: "8px"}} size="lg">
                    <Card.Header style={{backgroundColor: "#F0C808"}}><h5>Register</h5></Card.Header>
                    <Formik
                        validationSchema={registratonSchema}
                        initialValues={{
                            registerPlayerId: '',
                            name: '',
                            email: '',
                        }}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            setSubmitting(true);
                            register(values.registerPlayerId, values.name, values.email);
                            resetForm();
                            setSubmitting(false);
                        }}                      
                        >
                        {}
                        {( {
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            isSubmitting,
                            values,
                            touched,
                            errors,
                            dirty
                        }) => (
                        <Form noValidate onSubmit={handleSubmit} >
                            
                            <Form.Group className="mb-3 p-2" controlId="validationFormik01" style={{textAlign: "start"}}>
                                <Form.Label >Player Id</Form.Label>
                                <Form.Control 
                                    onChange={handleChange}
                                    type="number"
                                    placeholder="Your student ID"
                                    name="registerPlayerId"
                                    value={values.registerPlayerId}
                                    isInvalid={!!errors.registerPlayerId && touched.registerPlayerId}
                                    isValid={touched.registerPlayerId && !errors.registerPlayerId}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid" style={{position: "absolute"}}>
                                    {errors.registerPlayerId}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" style={{position: "absolute"}}>
                                    Looks good!
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3 p-2" controlId="validationFormik02" style={{textAlign: "start"}}>
                                <Form.Label id="input-user-name">User Name</Form.Label>
                                <Form.Control 
                                    onChange={handleChange} 
                                    type="text"
                                    placeholder="NameS[urname]"
                                    name="name"
                                    value={values.name}
                                    isInvalid={!!errors.name && touched.name}
                                    isValid={touched.name && !errors.name}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid" style={{position: "absolute"}}>
                                    {errors.name}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" style={{position: "absolute"}}>
                                    Looks good!
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3 p-2" controlId="validationFormik03" style={{textAlign: "start"}}>
                                <Form.Label id="input-user-email">Email</Form.Label>
                                <Form.Control 
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    placeholder="xx@student.uni..."
                                    value={values.email}
                                    isInvalid={!!errors.email && touched.email}
                                    isValid={touched.email && !errors.email}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid" style={{position: "absolute"}}>
                                    {errors.email}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" style={{position: "absolute"}}>
                                    Looks good!
                                </Form.Control.Feedback>
                            </Form.Group>
                            <div className="d-flex justify-content-end p-2">
                                <Button variant="dark" type="submit" className="p-2" disabled={isSubmitting || !dirty}>
                                    Register
                                </Button>
                            </div>
                        </Form>
                        )}
                    </Formik>
                    </Card>
                </div>
                <div className={"d-flex p-3"}>
                    <Card className="d-flex"   style={{width: '25rem', borderRadius: "8px"}} size="lg">
                    <Formik
                        validationSchema={loginSchema}
                        initialValues={{
                            loginPlayerId: '',
                            password: '',
                        }}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            setSubmitting(true);
                            login(values.loginPlayerId, values.password);
                            resetForm();
                            setSubmitting(false);
                        }}                      
                        >
                        {}
                        {( {
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            isSubmitting,
                            values,
                            touched,
                            errors,
                            dirty
                        }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Card.Header style={{backgroundColor: "#EC8F48"}}><h5>Login</h5></Card.Header>
                        <Form.Group className="mb-3 p-2" controlId="validationFormikLogin01" style={{textAlign: "start"}}>
                            <Form.Label >Player Id</Form.Label>
                            <Form.Control 
                                    onChange={handleChange}
                                    type="number"
                                    placeholder="Your student ID"
                                    name="loginPlayerId"
                                    value={values.loginPlayerId}
                                    isInvalid={!!errors.loginPlayerId && touched.loginPlayerId}
                                    isValid={touched.loginPlayerId && !errors.loginPlayerId}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid" style={{position: "absolute"}}>
                                    {errors.loginPlayerId}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" style={{position: "absolute"}}>
                                    Looks good!
                                </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3 p-2" controlId="validationFormikLogin02" style={{textAlign: "start"}}>
                            <Form.Label >Password</Form.Label>
                            <Form.Control 
                                    onChange={handleChange}
                                    type="password"
                                    placeholder="********"
                                    name="password"
                                    value={values.password}
                                    isInvalid={!!errors.password && touched.password}
                                    isValid={touched.password && !errors.password}
                                    onBlur={handleBlur}
                                    autoComplete="on"
                                />
                                <Form.Control.Feedback type="invalid" style={{position: "absolute"}}>
                                    {errors.password}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" style={{position: "absolute"}}>
                                    Looks good!
                                </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-end p-2" >
                            <Button variant="dark" type="submit" className="p-2" disabled={isSubmitting || !dirty} style={{marginTop: "6.5rem"}}>
                                Login
                            </Button>
                        </div>
                        </Form>
                        )}
                    </Formik>
                    </Card>
                </div>
            </div>
        </div>


    )
}

export default PanelLogin;