import React, {useEffect, useRef, useState} from "react";
import SingleSelect from "../Partial/SingleSelect";
import {Button, Col, Container, Form, FormGroup, Modal, Row} from "react-bootstrap";
import {validateVehicleData} from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS, UserRoles} from "../../services/Utils";
import {OpenAddNewVehicleFormButton} from "../Partial/OpenAddNewVehicleFormButton";
import {
    createEmergencyActionDTO,
    createRentalCompanyVehicleDTO,
    createRentalPriceDTO,
    createVehicleDTO, getVehiclesFromServer, setVehicleInLimpMode
} from "../../services/UserService";
import {Loader} from "@googlemaps/js-api-loader";

export default function VehiclesCRUDView (props) {
    const [count, setCount] = useState(0);
    const countRef = useRef(count);
    countRef.current = count;
    const marker = useRef(null)
    const map = useRef(null)
    const [vehicles,setVehicles] = useState([])
    const [selectedRegistrationNumberFromDropdown,setSelectedRegistrationNumberFromDropdown] = useState("")
    const selRegNbRef = useRef(selectedRegistrationNumberFromDropdown)
    selRegNbRef.current = selectedRegistrationNumberFromDropdown
    const [timer,setTimer] = useState(null)
    const [selectedVehicle,setSelectedVehicle]=useState(
        {
            vin:"",
            registrationNumber:"",
            manufacturer:"",
            model:"",
            rangeLeftInKm:"",
            yearOfManufacture:"",
            horsePower:"",
            torque:"",
            maximumAuthorisedMassInKg:"",
            numberOfSeats:"",
            location:"",
            rentalPriceDTO:"",
            isAvailable:false
        }
    );
    
    const [manufacturers,setManufacturers] = useState(props.manufacturers)
    const [models,setModels] = useState(["A4"])
    const [newVin,setNewVin] = useState("");
    const [newRegistrationNumber,setNewRegistrationNumber] = useState("")
    const [newRangeLeftInKm,setNewRangeLeftInKm] = useState("")
    const [newHorsePower,setNewHorsePower] = useState("")
    const [newTorque,setNewTorque] = useState("");
    const [newMaximumAuthorisedMassInKg,setNewMaximumAuthorisedMassInKg] = useState("")
    const [newNumberOfSeats,setNewNumberOfSeats] = useState("")
    const [newRentalPrice,setNewRentalPrice] = useState("")
    const [newSelectedManufacturerNameFromDropdown,setNewSelectedManufacturerNameFromDropdown] = useState("");
    const [newSelectedModelNameFromDropdown,setNewSelectedModelNameFromDropdown] = useState("");
    const [newSelectedYearOfManufacture,setNewSelectedYearOfManufacture] = useState("");
    const [newAvailability,setNewAvailability] = useState(false);
    const [errorMessageForLabel,setErrorMessageForLabel]=useState("");
    const [emergencyActionMessageLabel,setEmergencyActionMessageLabel] = useState("");

    const initializeForm = () => {
        let vehicle = vehicles.find(vehicle => vehicle.registrationNumber===selectedRegistrationNumberFromDropdown);
        setSelectedVehicle(vehicle);

        setNewVin(vehicle.vin)
        setNewRegistrationNumber(vehicle.registrationNumber)
        setNewRangeLeftInKm(vehicle.rangeLeftInKm)
        setNewSelectedYearOfManufacture(vehicle.yearOfManufacture)
        setNewHorsePower(vehicle.horsePower)
        setNewTorque(vehicle.torque)
        setNewMaximumAuthorisedMassInKg(vehicle.maximumAuthorisedMassInKg)
        setNewNumberOfSeats(vehicle.numberOfSeats)
        setNewRentalPrice(vehicle.rentalPriceDTO.value)
        setNewSelectedManufacturerNameFromDropdown(vehicle.manufacturer)
        setNewSelectedModelNameFromDropdown(vehicle.model)
        setNewAvailability(vehicle.available)
        document.getElementById("formAvailabilityCheckBox").setAttribute("checked",vehicle.available);
        setErrorMessageForLabel("");
        setEmergencyActionMessageLabel("");
        getLocationUpdates(vehicle.vin);
        getEmergencyActionStatus(vehicle.vin);

    }


    const changesOccurredInFormData = () =>{
        return newRegistrationNumber !== selectedVehicle.registrationNumber ||
            newRangeLeftInKm !== selectedVehicle.rangeLeftInKm ||
            newHorsePower !== selectedVehicle.horsePower ||
            newTorque !== selectedVehicle.torque ||
            newMaximumAuthorisedMassInKg !== selectedVehicle.maximumAuthorisedMassInKg ||
            newNumberOfSeats !== selectedVehicle.numberOfSeats ||
            newRentalPrice !== selectedVehicle.rentalPriceDTO.value ||
            newAvailability !== selectedVehicle.available
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let changesOccurredStatus = changesOccurredInFormData();
        if(changesOccurredStatus) {
                let status = validateVehicleData(newVin,
                    newRegistrationNumber,
                    newRangeLeftInKm,
                    newSelectedYearOfManufacture,
                    newHorsePower,
                    newTorque,
                    newMaximumAuthorisedMassInKg,
                    newNumberOfSeats,
                    newRentalPrice)
                if (status === STRINGS.STATUS_VALID) {
                    let vehicle = createVehicleDTO(newVin,
                        newRegistrationNumber,
                        newSelectedManufacturerNameFromDropdown,
                        newSelectedModelNameFromDropdown,
                        newRangeLeftInKm,
                        newSelectedYearOfManufacture,
                        newHorsePower,
                        newTorque,
                        newMaximumAuthorisedMassInKg,
                        newNumberOfSeats,
                        JSON.stringify(marker.current.getPosition()),
                        newRentalPrice,
                        getLocalItem(LocalStorageKeys.COMPANY_NAME),
                        newAvailability)
                    await fetch(STRINGS.UPDATE_VEHICLE_URL, {
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
                        setErrorMessageForLabel(res);
                        if(!res.includes("ERROR")){
                            setVehicles([...vehicles.filter(vehicle=>vehicle.registrationNumber!==selectedVehicle.registrationNumber),vehicle])
                            if(res.includes("ISSUE MARKED AS SOLVED")){
                                setEmergencyActionMessageLabel("ISSUE MARKED AS SOLVED")
                            }
                        }
                    })
                } else {
                    setErrorMessageForLabel(status);
                }
            }
        else{
            setErrorMessageForLabel("No changes.");
        }
    }
    const handleDelete = () =>{
        fetch(STRINGS.DELETE_VEHICLE_URL+newVin,{
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization":"Bearer " + getLocalItem(LocalStorageKeys.USER).token
            },
        })
            .then(function (res) {
                return res.text();
            }).then(function (res) {
                setErrorMessageForLabel(res);
                setVehicles(vehicles.filter(vehicle=>vehicle.registrationNumber!==selectedVehicle.registrationNumber));
                setSelectedRegistrationNumberFromDropdown("");
            }
        )
            .catch(error => {
                console.error('There was an error!', error);
            })
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

    const vehicleHasBeenAdded = (vehicle) =>{
        setVehicles([...vehicles,vehicle])
    }

    const getVehicles = () =>{
        if(vehicles.length===0){
            fetch(STRINGS.GET_VEHICLES_FROM_COMPANY_URL+getLocalItem(LocalStorageKeys.COMPANY_NAME),{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization":"Bearer " + getLocalItem(LocalStorageKeys.USER).token
                }
            })
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        if (data.registrationNumber === "") return false;
                        else {
                            return Promise.reject("Some weird error.");
                        }
                    } else {
                        setVehicles(data)
                    }

                })
                .catch(error => {
                    console.error('There was an error!', error);
                })
        }
    }

    //don't move up
    //"Cannot invoke getManagers before initialization" thrown.
    useEffect(()=>{
        getVehicles()
    },[]);

    useEffect(()=>{
        if(selectedVehicle.registrationNumber!==""){
            const position = JSON.parse(selectedVehicle.location)
                let loader = new Loader({
                    apiKey: STRINGS.MAPS_API_KEY,
                    version: "weekly"
                });
                loader.load().then(async () => {
                    // eslint-disable-next-line no-undef
                    const {Map} = await google.maps.importLibrary("maps");
                    map.current = new Map(document.getElementById("mapCRUD"), {
                        center: position,
                        zoom: 8,
                    })
                    placeMarker(position, map.current);
                });
        }
    },[selectedVehicle])

    const getLocationUpdates = (vin) =>{
        let url = STRINGS.GET_LOCATION_OF_VEHICLE_URL+vin
        fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + getLocalItem(LocalStorageKeys.USER).token
            },
        })
            .then(function (res) {
                return res.text();
            }).then(function (res) {
            const position = JSON.parse(res)
                    let loader = new Loader({
                        apiKey: STRINGS.MAPS_API_KEY,
                        version: "weekly"
                    });
                    loader.load().then(async () => {
                        if(map.current === null) {
                            // eslint-disable-next-line no-undef
                            const {Map} = await google.maps.importLibrary("maps");
                            map.current = new Map(document.getElementById("mapCRUD"), {
                                center: position,
                                zoom: 8,
                            })
                        }
                        placeMarker(position, map.current);
                        setCount(count+1)

                    });
            })
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    useEffect(()=>{
        if(timer !== null){
            clearTimeout(timer)
        }
        selRegNbRef.current = selectedRegistrationNumberFromDropdown
        if(selectedRegistrationNumberFromDropdown!=="") {
            initializeForm();
        }
    },[selectedRegistrationNumberFromDropdown])

    useEffect(()=>{
        if(selRegNbRef.current!=="") {
            setTimer(setTimeout(() => {
                getLocationUpdates(newVin)
            }, 30000))
        }
    },[count])

    const send_emergency_action = async (actionDTO,token) =>{
        setVehicleInLimpMode(actionDTO,token)
            .then(function (res){
            setErrorMessageForLabel(res);
            if(res === "SUCCESS"){
                let updatedAvailabilityStatusVehicle = selectedVehicle;
                updatedAvailabilityStatusVehicle.isAvailable = false;
                setVehicles([...vehicles.filter(vehicle=>vehicle.registrationNumber!==selectedVehicle.registrationNumber),updatedAvailabilityStatusVehicle])
                setNewAvailability(false)
                setEmergencyActionMessageLabel("Emergency action: "+actionDTO.action +" performed." +
                    " To mark the issue as solved, recheck the availability checkbox and update.")
            }
            }

        )

    }

    const handleEmergencyIntervention = async (e) =>{
        e.preventDefault()
        let actionDTO = createEmergencyActionDTO(
            getLocalItem(LocalStorageKeys.USER).username,
            newVin,
            "LIMP_MODE")
        await send_emergency_action(actionDTO,getLocalItem(LocalStorageKeys.USER).token)
    }

    const getEmergencyActionStatus = (vin) =>{
        fetch(STRINGS.GET_EMERGENCY_ACTION_VEHICLE_STATUS_URL+vin,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization":"Bearer " + getLocalItem(LocalStorageKeys.USER).token
            }
        })
            .then(function (res) {
                return res.text();
            }).then(function (res) {
                if(res!=="NONE"){
                    setEmergencyActionMessageLabel("Emergency action: "+ res +" performed." +
                        " To mark the issue as solved, recheck the availability checkbox and update.")
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            })
    }


    return (
        <Container>
            <Row>
                <Col>
                    {   vehicles.length > 0 &&
                        <SingleSelect parentFunction={setSelectedRegistrationNumberFromDropdown} inputStrings={vehicles.map(el => el.registrationNumber)}/>
                    }
                </Col>
                <Col>
                    <OpenAddNewVehicleFormButton handleVehiclesFunction={vehicleHasBeenAdded} manufacturers={props.manufacturers}/>
                </Col>
            </Row>

            <br/>
            {selectedRegistrationNumberFromDropdown!==""&&
                    <Form>
                        <Form.Group className="mb-3" controlId="formVehicleVIN">
                            <Col mb={2}>
                                <Form.Control type="text" placeholder="VIN" disabled={true} value={newVin} onChange={(e) => setNewVin(e.target.value)} maxLength={17} minLength={17} />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVehicleRegistrationNumber">
                            <Col mb={2}>
                                <Form.Control type="text" placeholder="Registration number" value={newRegistrationNumber} onChange={(e) => setNewRegistrationNumber(e.target.value)}/>
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVehicleManufacturer">
                            <Col mb={2}>
                                <FormGroup className="mb-3" style={{textAlign:"left"}} controlId="formCRUDManufacturerLabel">
                                    <Form.Control type="text" placeholder="Manufacturer" disabled={true} value={newSelectedManufacturerNameFromDropdown} onChange={(e) => setNewSelectedManufacturerNameFromDropdown(e.target.value)}/>
                                </FormGroup>
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVehicleModel">
                            <Col mb={2}>
                                <FormGroup className="mb-3" style={{textAlign:"left"}} controlId="formCRUDModelLabel">
                                    <Form.Control type="text" placeholder="Model" disabled={true} value={newSelectedModelNameFromDropdown} onChange={(e) => setNewSelectedModelNameFromDropdown(e.target.value)}/>

                                </FormGroup>
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVehicleYearOfManufacture">
                            <Col mb={2}>

                                    <FormGroup className="mb-3" style={{textAlign:"left"}} controlId="formCRUDModelLabel">
                                        <Form.Control type="number" placeholder="Year of manufacture" disabled={true} value={newSelectedYearOfManufacture} onChange={(e) => setNewSelectedYearOfManufacture(e.target.value)}/>

                                    </FormGroup>

                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVehicleHorsePower">
                            <Col mb={2}>
                                <FormGroup className="mb-3" style={{textAlign:"left"}} controlId="formCRUDModelLabel">
                                    <Form.Label>Horse power:</Form.Label>
                                </FormGroup>
                                <Form.Control type="number" placeholder="Horse power" value={newHorsePower} onChange={(e) => setNewHorsePower(e.target.value)}/>
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVehicleTorque">
                            <Col mb={2}>
                                <FormGroup className="mb-3" style={{textAlign:"left"}} controlId="formCRUDModelLabel">
                                    <Form.Label>Torque:</Form.Label>
                                </FormGroup>
                                <Form.Control type="number" placeholder="Torque" value={newTorque} onChange={(e) => setNewTorque(e.target.value)} />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVehicleMaximumAuthorisedMassInKg">
                            <Col mb={2}>
                                <FormGroup className="mb-3" style={{textAlign:"left"}} controlId="formCRUDModelLabel">
                                    <Form.Label>Maximum authorised mass:</Form.Label>
                                </FormGroup>
                                <Form.Control type="number" placeholder="Maximum authorised mass (kg)" value={newMaximumAuthorisedMassInKg} onChange={(e) => setNewMaximumAuthorisedMassInKg(e.target.value)}/>
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVehicleNumberOfSeats">
                            <Col mb={2}>
                                <FormGroup className="mb-3" style={{textAlign:"left"}} controlId="formCRUDModelLabel">
                                    <Form.Label>Number of seats:</Form.Label>
                                </FormGroup>
                                <Form.Control type="number" placeholder="Number of seats" value={newNumberOfSeats} onChange={(e) => setNewNumberOfSeats(e.target.value)} />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVehiclePrice">
                            <Col mb={2}>
                                <FormGroup className="mb-3" style={{textAlign:"left"}} controlId="formCRUDModelLabel">
                                    <Form.Label>Price:</Form.Label>
                                </FormGroup>
                                <Form.Control type="number" placeholder="Price (RON per km)" value={newRentalPrice} onChange={(e) => setNewRentalPrice(e.target.value)} />
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVehicleRange">
                            <Col mb={2}>
                                <FormGroup className="mb-3" style={{textAlign:"left"}} controlId="formCRUDModelLabel">
                                    <Form.Label>Range:</Form.Label>
                                </FormGroup>
                                <Form.Control type="number" placeholder="Range (km)" value={newRangeLeftInKm} onChange={(e) => setNewRangeLeftInKm(e.target.value)} />
                            </Col>
                        </Form.Group>

                        <Form.Group className="lg-3" controlId="formAvailabilityCheckBox">
                            <Row>
                                <Col sm={1}>
                                <Form.Check type="checkbox" label="Available" checked={newAvailability} onChange={()=>setNewAvailability(!newAvailability)} className="HomepageLabel"/>
                            </Col>
                                <Col>
                                    {
                                        emergencyActionMessageLabel!=="" &&
                                        <>
                                            <Form.Label>{emergencyActionMessageLabel}</Form.Label>
                                        </>
                                    }
                                </Col>
                            </Row>

                        </Form.Group>

                        <div id="mapCRUD" style={{"height":"75vh"}}></div>
                        {
                            errorMessageForLabel!==""&&
                            <>
                                <FormGroup className="mb-3" controlId="formVehicleLabel">
                                    <Form.Label>{errorMessageForLabel}</Form.Label>
                                </FormGroup>
                            </>

                        }
                            <Button onClick={(e) => handleSubmit(e)}>
                               UPDATE
                            </Button>
                            <Button onClick={handleDelete}>
                                DELETE
                            </Button>
                        {emergencyActionMessageLabel === "" &&
                            <Button onClick={handleEmergencyIntervention}>
                                SET VEHICLE IN LIMP MODE
                            </Button>
                        }
                    </Form>
            }

        </Container>

    );
}