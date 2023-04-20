import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, FormGroup, InputGroup, Modal, Row} from "react-bootstrap";
import validateCompanyData from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS} from "../../services/Utils";
export function OpenAddNewCompanyFormButton(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {setShow(true)}
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [phoneNumber,setPhoneNumber] = useState("")
    const [errorMessageForLabel,seterrorMessageForLabel]=useState("");

    const setInfo = () =>{
        setName(document.getElementById("formHorizontalName").value)
        setEmail(document.getElementById("formHorizontalEmail").value)
        setPhoneNumber(document.getElementById("formHorizontalPhoneNumber").value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setInfo()
        let status=validateCompanyData(name,email,phoneNumber);
        if (status===STRINGS.STATUS_VALID) {
            let d = {
                name: name,
                emailAddress: email,
                phoneNumber: phoneNumber
            }
            console.log(d);
            await fetch(STRINGS.INSERT_COMPANY_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization":"Bearer " + getLocalItem(LocalStorageKeys.USER).token
                },
                body: JSON.stringify(d)
            }).then(function (res) {
                return res.text();
            }).then(function (da) {
                if(da!=="SUCCESS"){
                    seterrorMessageForLabel(da);
                }
                else{
                    props.handleCompaniesFunction(d)
                    handleClose();}
            })
        }
        else{
            seterrorMessageForLabel(status);
        }
    }

    return (
        <>
            <Button className="btn btn-primary btn-theme" onClick={handleShow}>
                Add a new company
            </Button>


            <Modal className="ModalStyle" show={show} onHide={handleClose}
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>Introduce new company information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup className="mb-3" controlId="formHorizontalName">
                                <Form.Control type="name" placeholder="Name"/>
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