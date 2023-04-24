import React, {useState} from "react";
import {Button,  Form, FormGroup, InputGroup, Modal, Row} from "react-bootstrap";
import validateCompanyData from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS} from "../../services/Utils";
export function OpenAddNewCompanyFormButton(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        seterrorMessageForLabel("");
        setShow(false);
    }
    const handleShow = () => {setShow(true)}
    const [errorMessageForLabel,seterrorMessageForLabel]=useState("");

    const handleSubmit = async (e) => {
        e.preventDefault()
        let status=validateCompanyData(document.getElementById("formNewCompanyName").value,document.getElementById("formNewCompanyEmail").value,document.getElementById("formNewCompanyPhoneNumber").value);
        if (status===STRINGS.STATUS_VALID) {
            let d = {
                name: document.getElementById("formNewCompanyName").value,
                emailAddress: document.getElementById("formNewCompanyEmail").value,
                phoneNumber: document.getElementById("formNewCompanyPhoneNumber").value
            }
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
                        <FormGroup className="mb-3" controlId="formNewCompanyName">
                                <Form.Control type="name" placeholder="Name"/>
                        </FormGroup>

                        <FormGroup  className="mb-3" controlId="formNewCompanyEmail">
                                <Form.Control type="email" placeholder="Email"/>
                        </FormGroup>

                        <FormGroup  className="mb-3" controlId="formNewCompanyPhoneNumber">
                                <Form.Control type="phoneNumber" placeholder="Phone number"/>
                        </FormGroup>

                        {
                            errorMessageForLabel!==""&&
                            <>
                                <FormGroup className="mb-3" controlId="formNewCompanyLabel">
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