import React,{useEffect, useState} from "react";
import SingleSelect from "../Partial/SingleSelect";
import {Button, Col, Form, Row} from "react-bootstrap";
import validateVehicleData, {validateAccountData} from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS, UserRoles} from "../../services/Utils";
import {OpenAddNewVehicleFormButton} from "../Partial/OpenAddNewVehicleFormButton";
import {createRentalCompanyVehicleDTO} from "../../services/UserService";

export default function VehiclesCRUDView (props) {

    // const [vehicles,setVehicles]=useState([]);
    // const [selectedNameFromDropdown,setSelectedNameFromDropdown] = useState("");
    //
    // const [selectedVehicle,setSelectedVehicle]=useState(
    //     {
    //         username:"",
    //         emailAddress:"",
    //         phoneNumber:"",
    //         password:"",
    //         firstName:"",
    //         lastName:""
    //     }
    // );
    //
    // const [newEmailAddress,setNewEmailAddress] = useState("")
    // const [newUsername,setNewUsername] = useState("")
    // const [newPhoneNumber,setNewPhoneNumber] = useState("")
    // const [newPassword,setNewPassword] = useState("")
    // const [newFirstName,setNewFirstName] = useState("")
    // const [newLastName,setNewLastName] = useState("")
    //
    // const [errorMessageForLabel,setErrorMessageForLabel]=useState("");
    //
    // const initializeForm = () => {
    //     let vehicle = vehicles.find(vehicle => vehicle.userDTO.account.username===selectedNameFromDropdown);
    //     setSelectedVehicle(vehicle);
    //
    //     setNewUsername(vehicle.userDTO.account.username)
    //     setNewEmailAddress(vehicle.userDTO.account.emailAddress);
    //     setNewPhoneNumber(vehicle.userDTO.account.phoneNumber);
    //     setNewFirstName(vehicle.userDTO.firstName);
    //     setNewLastName(vehicle.userDTO.lastName);
    //     setErrorMessageForLabel("");
    //
    // }
    //
    // const changesOccurredInFormData = () =>{
    //     return  newEmailAddress !== selectedVehicle.userDTO.account.emailAddress ||
    //         newUsername !== selectedVehicle.userDTO.account.username ||
    //         newPassword !== selectedVehicle.userDTO.account.password ||
    //         newPhoneNumber !== selectedVehicle.userDTO.account.phoneNumber ||
    //         newFirstName !== selectedVehicle.userDTO.firstName ||
    //         newLastName !== selectedVehicle.userDTO.lastName;
    // }
    //
    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     let changesOccurredStatus = changesOccurredInFormData();
    //     if(changesOccurredStatus===true) {
    //         let status = validateAccountData(newUsername,newPassword,newPhoneNumber,newEmailAddress,newFirstName,newLastName,false)
    //         if (status === STRINGS.STATUS_VALID) {
    //             let vehicle = createRentalCompanyVehicleDTO(newUsername,newPassword,newPhoneNumber,newEmailAddress,UserRoles.MANAGER,newFirstName,newLastName,"")
    //             await fetch(STRINGS.UPDATE_MANAGER_URL, {
    //                 method: 'POST',
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Accept": "application/json",
    //                     "Authorization":"Bearer " + getLocalItem(LocalStorageKeys.USER).token
    //                 },
    //                 body: JSON.stringify(vehicle)
    //             }).then(function (res) {
    //                 return res.text();
    //             }).then(function (res) {
    //                     setErrorMessageForLabel(res);
    //                 }
    //             )
    //         } else {
    //             setErrorMessageForLabel(status);
    //         }
    //     }
    //     else{
    //         setErrorMessageForLabel("No changes.");
    //     }
    // }
    //
    // const handleDelete = () =>{
    //     fetch(STRINGS.DELETE_MANAGER_URL+selectedVehicle.userDTO.account.username,{
    //         method: 'DELETE',
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json",
    //             "Authorization":"Bearer " + getLocalItem(LocalStorageKeys.USER).token
    //         },
    //     })
    //         .then(function (res) {
    //             return res.text();
    //         }).then(function (res) {
    //             setErrorMessageForLabel(res);
    //             setVehicles(vehicles.filter(vehicle=>vehicle.userDTO.account.username!==selectedVehicle.userDTO.account.username));
    //             setSelectedNameFromDropdown("");
    //         }
    //     )
    //         .catch(error => {
    //             console.error('There was an error!', error);
    //         })
    // }
    //
    // const getVehicles = () =>{
    //     if(vehicles.length===0){
    //         fetch(STRINGS.GET_ALL_MANAGERS_URL,{
    //             method: 'GET',
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Accept": "application/json",
    //                 "Authorization":"Bearer " + getLocalItem(LocalStorageKeys.USER).token
    //             }
    //         })
    //             .then(async response => {
    //                 const data = await response.json();
    //                 if (!response.ok) {
    //                     if (data.name === "") return false;
    //                     else {
    //                         return Promise.reject("Some weird error.");
    //                     }
    //                 } else {
    //                     setVehicles(data);
    //                 }
    //
    //             })
    //             .catch(error => {
    //                 console.error('There was an error!', error);
    //             })
    //     }
    // }
    //
    // //don't move up
    // //"Cannot invoke getVehicles before initialization" thrown.
    // useEffect(getVehicles,[]);
    //
    // useEffect(()=>{
    //     if(selectedNameFromDropdown!=="") {
    //         initializeForm();
    //     }
    // },[selectedNameFromDropdown])
    //
    // const vehicleHasBeenAdded = (vehicle) =>{
    //     setVehicles([...vehicles,vehicle])
    // }
    return (
        <>
            {/*{   vehicles.length > 0 &&*/}
            {/*    <SingleSelect parentFunction={setSelectedNameFromDropdown} inputStrings={vehicles.map(el => el.userDTO.account.username)}/>*/}
            {/*}*/}
            {/*<br/>*/}
            {/*{selectedNameFromDropdown!==""&&*/}
            {/*    <Form>*/}
            {/*        <Form.Group className="mb-3" controlId="formVehicleUsername">*/}
            {/*            <Col mb={2}>*/}
            {/*                <Form.Control type="name" placeholder="Username" value={newUsername} disabled={true}*/}
            {/*                              onChange={(e) => setNewUsername(e.target.value)}/>*/}
            {/*            </Col>*/}
            {/*        </Form.Group>*/}

            {/*        <Form.Group className="mb-3" controlId="formVehiclePassword">*/}
            {/*            <Col mb={2}>*/}
            {/*                <Form.Control type="password" placeholder="New Password" value={newPassword}*/}
            {/*                              onChange={(e) => setNewPassword(e.target.value)}/>*/}
            {/*            </Col>*/}
            {/*        </Form.Group>*/}

            {/*        <Form.Group className="mb-3" controlId="formVehicleEmailAddress">*/}
            {/*            <Col mb={2}>*/}
            {/*                <Form.Control type="email" placeholder="Email" value={newEmailAddress}*/}
            {/*                              onChange={(e) => setNewEmailAddress(e.target.value)}/>*/}
            {/*            </Col>*/}
            {/*        </Form.Group>*/}

            {/*        <Form.Group className="mb-3" controlId="formVehiclePhoneNumber">*/}
            {/*            <Col mb={2}>*/}
            {/*                <Form.Control type="phone-number" placeholder="Phone number" value={newPhoneNumber}*/}
            {/*                              onChange={(e) => setNewPhoneNumber(e.target.value)}/>*/}
            {/*            </Col>*/}
            {/*        </Form.Group>*/}

            {/*        <Form.Group className="mb-3" controlId="formVehicleFirstName">*/}
            {/*            <Col mb={2}>*/}
            {/*                <Form.Control type="name" placeholder="First name" value={newFirstName}*/}
            {/*                              onChange={(e) => setNewFirstName(e.target.value)}/>*/}
            {/*            </Col>*/}
            {/*        </Form.Group>*/}

            {/*        <Form.Group className="mb-3" controlId="formVehicleLastName">*/}
            {/*            <Col mb={2}>*/}
            {/*                <Form.Control type="name" placeholder="Last name" value={newLastName}*/}
            {/*                              onChange={(e) => setNewLastName(e.target.value)}/>*/}
            {/*            </Col>*/}
            {/*        </Form.Group>*/}
            {/*        {*/}
            {/*            errorMessageForLabel !== "" &&*/}
            {/*            <>*/}
            {/*                <Form.Group className="mb-3" controlId="formVehicleLabel">*/}

            {/*                    <Col mb={2}>*/}
            {/*                        <Form.Label className="HomepageLabel">{errorMessageForLabel}</Form.Label>*/}
            {/*                    </Col>*/}
            {/*                </Form.Group>*/}
            {/*            </>*/}
            {/*        }*/}
            {/*        <Button onClick={(e) => handleSubmit(e)}>*/}
            {/*            Update*/}
            {/*        </Button>*/}

            {/*        <Button onClick={(e) => handleDelete(e)}>*/}
            {/*            Delete*/}
            {/*        </Button>*/}

            {/*    </Form>*/}
            {/*}*/}
            {/*<br/>*/}
            <OpenAddNewVehicleFormButton/>

        </>

    );
}