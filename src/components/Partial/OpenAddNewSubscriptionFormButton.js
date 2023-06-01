import React, {useState} from "react";
import {validateSubscriptionData} from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS, TimeUnits} from "../../services/Utils";
import {createSubscriptionDTO} from "../../services/UserService";
import {Button, Col, Form, FormGroup, Modal} from "react-bootstrap";
import SingleSelect from "./SingleSelect";

export function OpenAddNewSubscriptionFormButton(props){
    const [show, setShow] = useState(false);
    const handleClose = () => {
        seterrorMessageForLabel("");
        setShow(false);
    }
    const handleShow = () => {setShow(true)}
    const [errorMessageForLabel,seterrorMessageForLabel]=useState("");
    const [selectedTimeUnit,setSelectedTimeUnit] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault()
        if(selectedTimeUnit !== "") {
            let status = validateSubscriptionData(document.getElementById("formNewSubscriptionName").value, document.getElementById("formNewSubscriptionKmLimit").value, document.getElementById("formNewSubscriptionRentalPriceValue").value);
            if (status === STRINGS.STATUS_VALID) {
                let d = createSubscriptionDTO("", document.getElementById("formNewSubscriptionName").value, document.getElementById("formNewSubscriptionKmLimit").value, document.getElementById("formNewSubscriptionRentalPriceValue").value, selectedTimeUnit)
                await fetch(STRINGS.INSERT_SUBSCRIPTION_URL, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": "Bearer " + getLocalItem(LocalStorageKeys.USER).token
                    },
                    body: JSON.stringify(d)
                }).then(function (res) {
                    return res.text();
                }).then(function (uuid) {
                    if (uuid.includes("ERROR")) {
                        seterrorMessageForLabel(uuid);
                    } else {
                        d.id = uuid
                        props.handleSubscriptionsFunction(d)
                        handleClose();
                    }
                })
            } else {
                seterrorMessageForLabel(status);
            }
        }else{
            seterrorMessageForLabel(STRINGS.NO_TIMEUNIT_SELECTED)
        }
    }
    return (
        <>
            <Button className="btn btn-primary btn-theme" onClick={handleShow}>
                Add a new subscription
            </Button>


            <Modal className="ModalStyle" show={show} onHide={handleClose}
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>Introduce new company information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup className="mb-3" controlId="formNewSubscriptionName">
                            <Form.Control type="name" placeholder="Name"/>
                        </FormGroup>

                        <FormGroup  className="mb-3" controlId="formNewSubscriptionKmLimit">
                            <Form.Control type="number" placeholder="Kilometers limit"/>
                        </FormGroup>

                        <FormGroup  className="mb-3" controlId="formNewSubscriptionRentalPriceValue">
                            <Form.Control type="number" placeholder="Rental price value"/>
                        </FormGroup>

                        <Form.Group className="mb-3" controlId="formNewSubscriptionRentalPriceTimeUnit">
                            <Col mb={2}>
                                <>
                                    <FormGroup className="mb-3" controlId="formSubscriptionRentalPriceTimeUnitLabel">
                                        <Form.Label>per (time unit):</Form.Label>
                                        <SingleSelect parentFunction={setSelectedTimeUnit} inputStrings={[TimeUnits.DAY,TimeUnits.WEEK,TimeUnits.MONTH]}/>
                                    </FormGroup>

                                </>
                            </Col>
                        </Form.Group>
                        {
                            errorMessageForLabel!==""&&
                            <>
                                <FormGroup className="mb-3" controlId="formNewSubscriptionLabel">
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