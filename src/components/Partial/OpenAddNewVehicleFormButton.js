import React, {useEffect, useRef, useState} from "react";
import {Button, Col, Container, Form, FormGroup, InputGroup, Modal, Row} from "react-bootstrap";
import {validateVehicleData} from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS, UserRoles} from "../../services/Utils";
import SingleSelect from "./SingleSelect";
import {createVehicleDTO} from "../../services/UserService";
import { Loader } from "@googlemaps/js-api-loader"
import "../../pages/style/Map.css"
export function OpenAddNewVehicleFormButton(props) {

    const marker = useRef(null)
    const map = useRef(null)
    const [show, setShow] = useState(false);

    const handleClose = () => {
        seterrorMessageForLabel("");
        setShow(false);
    }
    const handleShow = () => {
            let loader = new Loader({
                apiKey: STRINGS.MAPS_API_KEY,
                version: "weekly"
            });
            loader.load().then(async () => {
                // eslint-disable-next-line no-undef
                const {Map} = await google.maps.importLibrary("maps");

                map.current = new Map(document.getElementById("map"), {
                    center: {lat: -34.397, lng: 150.644},
                    zoom: 8,
                })

                    map.current.addListener('click', function (e) {
                        placeMarker(e.latLng, map.current);
                    });


            });
        setShow(true)
    }

    const [manufacturers,setManufacturers] = useState(props.manufacturers)
    const [models,setModels] = useState(["A4"])
    const [selectedManufacturerNameFromDropdown,setSelectedManufacturerNameFromDropdown] = useState("");
    const [selectedModelNameFromDropdown,setSelectedModelNameFromDropdown] = useState("");
    const [selectedYearOfManufacture,setSelectedYearOfManufacture] = useState("");
    const [errorMessageForLabel,seterrorMessageForLabel]=useState("");

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(selectedManufacturerNameFromDropdown!=="") {
            if(selectedModelNameFromDropdown !== "") {
                if(marker.current!==null) {
                    let status = validateVehicleData(document.getElementById("formNewVehicleVIN").value,
                        document.getElementById("formNewVehicleRegistrationNumber").value,
                        document.getElementById("formNewVehicleRange").value,
                        selectedYearOfManufacture,
                        document.getElementById("formNewVehicleHorsePower").value,
                        document.getElementById("formNewVehicleTorque").value,
                        document.getElementById("formNewVehicleMaximumAuthorisedMassInKg").value,
                        document.getElementById("formNewVehicleNumberOfSeats").value,
                        document.getElementById("formNewVehiclePrice").value)

                    if (status === STRINGS.STATUS_VALID) {
                        let vehicle = createVehicleDTO(document.getElementById("formNewVehicleVIN").value,
                            document.getElementById("formNewVehicleRegistrationNumber").value,
                            selectedManufacturerNameFromDropdown,
                            selectedModelNameFromDropdown,
                            document.getElementById("formNewVehicleRange").value,
                            selectedYearOfManufacture,
                            document.getElementById("formNewVehicleHorsePower").value,
                            document.getElementById("formNewVehicleTorque").value,
                            document.getElementById("formNewVehicleMaximumAuthorisedMassInKg").value,
                            document.getElementById("formNewVehicleNumberOfSeats").value,
                            JSON.stringify(marker.current.getPosition()),
                            document.getElementById("formNewVehiclePrice").value,
                            getLocalItem(LocalStorageKeys.COMPANY_NAME),
                            document.getElementById("formNewVehicleAvailabilityCheckBox").checked)
                        await fetch(STRINGS.INSERT_VEHICLE_URL, {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Bearer " + getLocalItem(LocalStorageKeys.USER).token
                            },
                            body: JSON.stringify(vehicle)
                        }).then(function (res) {
                            return res.text();
                        }).then(function (res) {
                            if (!res.includes("ERROR")) {
                                props.handleVehiclesFunction(vehicle)
                                handleClose();
                            } else {
                                seterrorMessageForLabel(res);
                            }
                        })
                    } else {
                        seterrorMessageForLabel(status);
                    }
                }else{
                    seterrorMessageForLabel(STRINGS.NO_LOCATION_SELECTED)
                }
        }else{
                seterrorMessageForLabel(STRINGS.NO_MODEL_CHOSEN)
             }
        }else{
            seterrorMessageForLabel(STRINGS.NO_MANUFACTURER_CHOSEN)
        }
    }
    function placeMarker(position, map) {
        if(marker.current===null) {
            // eslint-disable-next-line no-undef
            marker.current = new google.maps.Marker({
                position: position,
                map: map
            })
        }
        else{
            marker.current.setMap(map)
            marker.current.setPosition(position)
        }
        map.panTo(position);
    }

    return (
        <>

            <Button className="btn btn-primary btn-theme" onClick={handleShow}>
                Add a new vehicle
            </Button>


            <Modal className="ModalStyle" show={show} onHide={handleClose}
                   centered
                    fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Introduce new vehicle information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formNewVehicleVIN">
                            <Col mb={2}>
                                <Form.Control type="text" placeholder="VIN" maxLength={17} minLength={17} />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewVehicleRegistrationNumber">
                            <Col mb={2}>
                                <Form.Control type="text" placeholder="Registration number"/>
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewVehicleManufacturer">
                            <Col mb={2}>
                                {  manufacturers !== undefined && manufacturers.length > 0 &&
                                    <>
                                        <FormGroup className="mb-3" controlId="formManufacturerLabel">
                                            <Form.Label>Manufacturer:</Form.Label>
                                        </FormGroup>
                                        <SingleSelect parentFunction={setSelectedManufacturerNameFromDropdown} inputStrings={manufacturers}/>
                                    </>
                                }
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewVehicleModel">
                            <Col mb={2}>
                                {  manufacturers !== undefined && manufacturers.length > 0 &&
                                    <>
                                        <FormGroup className="mb-3" controlId="formModelLabel">
                                            <Form.Label>Model:</Form.Label>
                                        </FormGroup>
                                        <SingleSelect parentFunction={setSelectedModelNameFromDropdown} inputStrings={models}/>
                                    </>
                                }
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewVehicleYearOfManufacture">
                            <Col mb={2}>
                                <>
                                    <FormGroup className="mb-3" controlId="formNewVehicleYearOfManufactureLabel">
                                        <Form.Label>Year of manufacture:</Form.Label>
                                    </FormGroup>
                                    <SingleSelect parentFunction={setSelectedYearOfManufacture} inputStrings={Array.from(new Array(24), (x, i) => i + 2000)}/>
                                </>
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewVehicleHorsePower">
                            <Col mb={2}>
                                <Form.Control type="number" placeholder="Horse power" />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewVehicleTorque">
                            <Col mb={2}>
                                <Form.Control type="number" placeholder="Torque" />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewVehicleMaximumAuthorisedMassInKg">
                            <Col mb={2}>
                                <Form.Control type="number" placeholder="Maximum authorised mass (kg)" />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewVehicleNumberOfSeats">
                            <Col mb={2}>
                                <Form.Control type="number" placeholder="Number of seats" />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewVehiclePrice">
                            <Col mb={2}>
                                <Form.Control type="number" placeholder="Price (RON per km)" />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewVehicleRange">
                            <Col mb={2}>
                                <Form.Control type="number" placeholder="Range (km)" />
                            </Col>
                        </Form.Group>

                        <Form.Group className="lg-3" controlId="formNewVehicleAvailabilityCheckBox">
                            <Col sm={2}>
                                <Form.Check type="checkbox" label="Available" className="HomepageLabel"/>
                            </Col>
                        </Form.Group>
                        <div id="map" style={{"height":"75vh"}}></div>
                        {
                            errorMessageForLabel!==""&&
                            <>
                                <FormGroup className="mb-3" controlId="formNewVehicleLabel">
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