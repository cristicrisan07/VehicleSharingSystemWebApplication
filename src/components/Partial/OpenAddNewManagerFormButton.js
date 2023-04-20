import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, FormGroup, InputGroup, Modal, Row} from "react-bootstrap";
import validateManagerData, {validateAccountData} from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS, UserRoles} from "../../services/Utils";
import {createRentalCompanyManagerDTO} from "../../services/UserService";
import SingleSelect from "./SingleSelect";
export function OpenAddNewManagerFormButton(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true)
    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [phoneNumber,setPhoneNumber] = useState("")
    const [password,setPassword] = useState("")
    const [firstName,setFirstName] = useState("")
    const [lastName,setLastName] = useState("")

    const [selectedCompanyNameFromDropdown,setSelectedCompanyNameFromDropdown] = useState("");

    const [errorMessageForLabel,seterrorMessageForLabel]=useState("");


    const setInfo = () =>{
        setUsername(document.getElementById("formHorizontalUsername").value)
        setEmail(document.getElementById("formHorizontalEmail").value)
        setPhoneNumber(document.getElementById("formHorizontalPhoneNumber").value)
        setPassword(document.getElementById("formHorizontalPassword").value)
        setFirstName(document.getElementById("formHorizontalFirstName").value)
        setLastName(document.getElementById("formHorizontalLastName").value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setInfo()
        if(selectedCompanyNameFromDropdown!=="") {
            let status = validateAccountData(username, password, phoneNumber, email, firstName, lastName);
            if (status === STRINGS.STATUS_VALID) {
                let manager = createRentalCompanyManagerDTO(username, password, phoneNumber, email, UserRoles.MANAGER, firstName, lastName,selectedCompanyNameFromDropdown)
                await fetch(STRINGS.INSERT_COMPANY_URL, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": "Bearer " + getLocalItem(LocalStorageKeys.USER).token
                    },
                    body: JSON.stringify(manager)
                }).then(function (res) {
                    return res.text();
                }).then(function (res) {
                    if(res!=="SUCCESS"){
                        seterrorMessageForLabel(res);
                    }
                    else{
                        props.handleManagersFunction(manager)
                        handleClose();}
                })
            } else {
                seterrorMessageForLabel(status);
            }
        }else{
            seterrorMessageForLabel(STRINGS.NO_COMPANY_CHOSEN);
        }
    }

    return (
        <>

            <Button className="btn btn-primary btn-theme" onClick={handleShow}>
                Add a new manager
            </Button>


            <Modal className="ModalStyle" show={show} onHide={handleClose}
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>Introduce new manager information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {   props.companies !== undefined && props.companies.length > 0 &&
                        <SingleSelect parentFunction={setSelectedCompanyNameFromDropdown} inputStrings={props.companies.map(el => el.name)}/>
                    }
                    <br/>
                    <Form>
                        <FormGroup className="mb-3" controlId="formHorizontalUsername">
                            <Form.Control type="username" placeholder="Username"/>
                        </FormGroup>

                        <FormGroup  className="mb-3" controlId="formHorizontalEmail">
                            <Form.Control type="email" placeholder="Email"/>
                        </FormGroup>

                        <FormGroup  className="mb-3" controlId="formHorizontalPhoneNumber">
                            <Form.Control type="phoneNumber" placeholder="Phone number"/>
                        </FormGroup>

                        {
                            errorMessageForLabel!==""&&
                            <>
                                <FormGroup className="mb-3" controlId="formHorizontalLabel">
                                    <Form.Label>{errorMessageForLabel}</Form.Label>
                                </FormGroup>
                            </>

                        }
                        <Modal.Footer>
                            <Button className="btn btn-primary btn-theme" onClick={(e) => handleSubmit(e)}>
                                Submit
                            </Button>
                            <Button variant="btn btn-primary modal-close_button" onClick={handleClose}>
                                Close
                            </Button>

                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
}