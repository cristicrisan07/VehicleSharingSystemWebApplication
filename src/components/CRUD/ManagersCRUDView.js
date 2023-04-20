import React,{useEffect, useState} from "react";
import SingleSelect from "../Partial/SingleSelect";
import {Button, Col, Form, Row} from "react-bootstrap";
import validateManagerData, {validateAccountData} from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS, UserRoles} from "../../services/Utils";
import {OpenAddNewManagerFormButton} from "../Partial/OpenAddNewManagerFormButton";
import {createRentalCompanyManagerDTO} from "../../services/UserService";

export default function ManagersCRUDView () {

    const [managers,setManagers]=useState([]);
    const [selectedNameFromDropdown,setSelectedNameFromDropdown] = useState("");

    const [selectedManager,setSelectedManager]=useState(
        {
            username:"",
            emailAddress:"",
            phoneNumber:"",
            password:"",
            firstName:"",
            lastName:""           
        }
    );

    const [newEmailAddress,setNewEmailAddress] = useState("")
    const [newUsername,setNewUsername] = useState("")
    const [newPhoneNumber,setNewPhoneNumber] = useState("")
    const [newPassword,setNewPassword] = useState("")
    const [newFirstName,setNewFirstName] = useState("")
    const [newLastName,setNewLastName] = useState("")

    const [errorMessageForLabel,setErrorMessageForLabel]=useState("");

    const initializeForm = () => {
        let manager = managers.find(manager => manager.username===selectedNameFromDropdown);
        setSelectedManager(manager);

        setNewUsername(manager.username)
        setNewEmailAddress(manager.emailAddress);
        setNewPhoneNumber(manager.phoneNumber);
        setNewFirstName(manager.firstName);
        setNewLastName(manager.lastName);
        setErrorMessageForLabel("");

    }

    const changesOccurredInFormData = () =>{
        return  newEmailAddress !== selectedManager.emailAddress ||
            newUsername !== selectedManager.username ||
            newPassword !== selectedManager.password ||
            newPhoneNumber !== selectedManager.phoneNumber ||
            newFirstName !== selectedManager.firstName ||
            newLastName !== selectedManager.lastName;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let changesOccurredStatus = changesOccurredInFormData();
        if(changesOccurredStatus===true) {
            let status = validateAccountData(newUsername,newPassword,newPhoneNumber,newEmailAddress,newFirstName,newLastName)
            if (status === STRINGS.STATUS_VALID) {
               let manager = createRentalCompanyManagerDTO(newUsername,newPassword,newPhoneNumber,newEmailAddress,UserRoles.MANAGER,newFirstName,newLastName,"")
                await fetch(STRINGS.UPDATE_COMPANY_URL, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization":"Bearer " + getLocalItem(LocalStorageKeys.USER).token
                    },
                    body: JSON.stringify(manager)
                }).then(function (res) {
                    return res.text();
                }).then(function (res) {
                        setErrorMessageForLabel(res);
                    }
                )
            } else {
                setErrorMessageForLabel(status);
            }
        }
        else{
            setErrorMessageForLabel("No changes.");
        }
    }

    const handleDelete = () =>{
        fetch(STRINGS.DELETE_COMPANY_URL+selectedManager.username,{
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
                setManagers(managers.filter(manager=>manager.name!==selectedManager.name));
                setSelectedNameFromDropdown("");
            }
        )
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    const getManagers = () =>{
        if(managers.length===0){
            fetch(STRINGS.GET_ALL_COMPANIES_URL,{
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
                        if (data.name === "") return false;
                        else {
                            return Promise.reject("Some weird error.");
                        }
                    } else {
                        setManagers(data);
                    }

                })
                .catch(error => {
                    console.error('There was an error!', error);
                })
        }
    }

    //don't move up
    //"Cannot invoke getManagers before initialization" thrown.
    useEffect(getManagers,[]);

    useEffect(()=>{
        if(selectedNameFromDropdown!=="") {
            initializeForm();
        }
    },[selectedNameFromDropdown])

    const managerHasBeenAdded = (manager) =>{
        setManagers([...managers,manager])
    }
    return (
        <>
            {   managers.length > 0 &&
                <SingleSelect parentFunction={setSelectedNameFromDropdown} inputStrings={managers.map(el => el.name)}/>
            }
            <br/>
            {selectedNameFromDropdown!==""&&
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalUsername">
                        <Col mb={2}>
                            <Form.Control type="name" placeholder="Username" value={newUsername}
                                          onChange={(e) => setNewUsername(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPasswordName">
                        <Col mb={2}>
                            <Form.Control type="password" placeholder="New Password" value={newPassword}
                                          onChange={(e) => setNewPassword(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmailAddress">
                        <Col mb={2}>
                            <Form.Control type="email" placeholder="Email" value={newEmailAddress}
                                          onChange={(e) => setNewEmailAddress(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalPhoneNumber">
                        <Col mb={2}>
                            <Form.Control type="phone-number" placeholder="Phone number" value={newPhoneNumber}
                                          onChange={(e) => setNewPhoneNumber(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalFirstName">
                        <Col mb={2}>
                            <Form.Control type="name" placeholder="First name" value={newFirstName}
                                          onChange={(e) => setNewFirstName(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalLastName">
                        <Col mb={2}>
                            <Form.Control type="name" placeholder="Last name" value={newLastName}
                                          onChange={(e) => setNewLastName(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    {
                        errorMessageForLabel !== "" &&
                        <>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalLabel">

                                <Col mb={2}>
                                    <Form.Label className="HomepageLabel">{errorMessageForLabel}</Form.Label>
                                </Col>
                            </Form.Group>
                        </>
                    }
                    <Button onClick={(e) => handleSubmit(e)}>
                        Update
                    </Button>

                    <Button onClick={(e) => handleDelete(e)}>
                        Delete
                    </Button>

                </Form>
            }
            <br/>
            <OpenAddNewManagerFormButton handleManagersFunction={managerHasBeenAdded}/>
        </>

    );
}