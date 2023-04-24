import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, FormGroup, InputGroup, Modal, Row} from "react-bootstrap";
import validateManagerData, {validateAccountData} from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS, UserRoles} from "../../services/Utils";
import {createRentalCompanyManagerDTO} from "../../services/UserService";
import SingleSelect from "./SingleSelect";
export function OpenAddNewManagerFormButton(props) {
    const [show, setShow] = useState(false);
    const [companies,setCompanies] = useState(props.companies);
    const handleClose = () => {
        seterrorMessageForLabel("");
        setShow(false);
    }
    const handleShow = () => setShow(true)
    const [selectedCompanyNameFromDropdown,setSelectedCompanyNameFromDropdown] = useState("");
    const [errorMessageForLabel,seterrorMessageForLabel]=useState("");

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(selectedCompanyNameFromDropdown!=="") {
            let status = validateAccountData(document.getElementById("formNewManagerUsername").value,
                document.getElementById("formNewManagerPassword").value,
                document.getElementById("formNewManagerPhoneNumber").value,
                document.getElementById("formNewManagerEmailAddress").value,
                document.getElementById("formNewManagerFirstName").value,
                document.getElementById("formNewManagerLastName").value
                ,true);
            if (status === STRINGS.STATUS_VALID) {
                let manager = createRentalCompanyManagerDTO(document.getElementById("formNewManagerUsername").value,
                    document.getElementById("formNewManagerPassword").value,
                    document.getElementById("formNewManagerPhoneNumber").value,
                    document.getElementById("formNewManagerEmailAddress").value,
                    UserRoles.MANAGER,
                    document.getElementById("formNewManagerFirstName").value,
                    document.getElementById("formNewManagerLastName").value,
                    selectedCompanyNameFromDropdown)
                await fetch(STRINGS.INSERT_MANAGER_URL, {
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
                    if(!res.includes("ERROR")){
                        props.handleManagersFunction(manager)
                        handleClose();
                    }
                    else{
                        seterrorMessageForLabel(res);
                        }
                })
            } else {
                seterrorMessageForLabel(status);
            }
        }else{
            seterrorMessageForLabel(STRINGS.NO_COMPANY_CHOSEN);
        }
    }
    useEffect(()=>{
        setCompanies(props.companies)
    },[props.companies])

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
                    {   companies !== undefined && companies.length > 0 &&
                        <>
                            <FormGroup className="mb-3" controlId="formCompanyLabel">
                                <Form.Label>Company:</Form.Label>
                            </FormGroup>
                        <SingleSelect parentFunction={setSelectedCompanyNameFromDropdown} inputStrings={companies.map(el => el.name)}/>
                        </>
                    }
                    <br/>
                    <Form>
                        <Form.Group className="mb-3" controlId="formNewManagerUsername">
                            <Col mb={2}>
                                <Form.Control type="name" placeholder="Username" />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewManagerPassword">
                            <Col mb={2}>
                                <Form.Control type="password" placeholder="Password" />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewManagerEmailAddress">
                            <Col mb={2}>
                                <Form.Control type="email" placeholder="Email" />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewManagerPhoneNumber">
                            <Col mb={2}>
                                <Form.Control type="phone-number" placeholder="Phone number"/>
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewManagerFirstName">
                            <Col mb={2}>
                                <Form.Control type="name" placeholder="First name" />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewManagerLastName">
                            <Col mb={2}>
                                <Form.Control type="name" placeholder="Last name" />
                            </Col>
                        </Form.Group>

                        {
                            errorMessageForLabel!==""&&
                            <>
                                <FormGroup className="mb-3" controlId="formNewManagerLabel">
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