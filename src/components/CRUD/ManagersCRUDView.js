import React,{useEffect, useState} from "react";
import SingleSelect from "../Partial/SingleSelect";
import {Button, Col, Form, Row} from "react-bootstrap";
import validateManagerData, {validateAccountData} from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS, UserRoles} from "../../services/Utils";
import {OpenAddNewManagerFormButton} from "../Partial/OpenAddNewManagerFormButton";
import {createRentalCompanyManagerDTO} from "../../services/UserService";

export default function ManagersCRUDView (props) {

    const [companies,setCompanies] = useState(props.companies);
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
        let manager = managers.find(manager => manager.userDTO.account.username===selectedNameFromDropdown);
        setSelectedManager(manager);

        setNewUsername(manager.userDTO.account.username)
        setNewEmailAddress(manager.userDTO.account.emailAddress);
        setNewPhoneNumber(manager.userDTO.account.phoneNumber);
        setNewFirstName(manager.userDTO.firstName);
        setNewLastName(manager.userDTO.lastName);
        setErrorMessageForLabel("");

    }

    const changesOccurredInFormData = () =>{
        return  newEmailAddress !== selectedManager.userDTO.account.emailAddress ||
            newUsername !== selectedManager.userDTO.account.username ||
            newPassword !== selectedManager.userDTO.account.password ||
            newPhoneNumber !== selectedManager.userDTO.account.phoneNumber ||
            newFirstName !== selectedManager.userDTO.firstName ||
            newLastName !== selectedManager.userDTO.lastName;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let changesOccurredStatus = changesOccurredInFormData();
        if(changesOccurredStatus===true) {
            let status = validateAccountData(newUsername,newPassword,newPhoneNumber,newEmailAddress,newFirstName,newLastName,false)
            if (status === STRINGS.STATUS_VALID) {
               let manager = createRentalCompanyManagerDTO(newUsername,newPassword,newPhoneNumber,newEmailAddress,UserRoles.MANAGER,newFirstName,newLastName,"")
                await fetch(STRINGS.UPDATE_MANAGER_URL, {
                    method: 'POST',
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
                    if(!res.includes("ERROR")){
                        setManagers([...managers.filter(manager=>manager.registrationNumber!==selectedManager.registrationNumber),manager])
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
        fetch(STRINGS.DELETE_MANAGER_URL+selectedManager.userDTO.account.username,{
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
                setManagers(managers.filter(manager=>manager.userDTO.account.username!==selectedManager.userDTO.account.username));
                setSelectedNameFromDropdown("");
            }
        )
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    const getManagers = () =>{
        if(managers.length===0){
            fetch(STRINGS.GET_ALL_MANAGERS_URL,{
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

    useEffect(()=>{
        setCompanies(props.companies);
    },[props.companies])
    const managerHasBeenAdded = (manager) =>{
        setManagers([...managers,manager])
    }
    return (
        <>
            {   managers.length > 0 &&
                <SingleSelect parentFunction={setSelectedNameFromDropdown} inputStrings={managers.map(el => el.userDTO.account.username)}/>
            }
            <br/>
            {selectedNameFromDropdown!==""&&
                <Form>
                    <Form.Group className="mb-3" controlId="formManagerUsername">
                        <Col mb={2}>
                            <Form.Control type="name" placeholder="Username" value={newUsername} disabled={true}
                                          onChange={(e) => setNewUsername(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formManagerPassword">
                        <Col mb={2}>
                            <Form.Control type="password" placeholder="New Password" value={newPassword}
                                          onChange={(e) => setNewPassword(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formManagerEmailAddress">
                        <Col mb={2}>
                            <Form.Control type="email" placeholder="Email" value={newEmailAddress}
                                          onChange={(e) => setNewEmailAddress(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formManagerPhoneNumber">
                        <Col mb={2}>
                            <Form.Control type="phone-number" placeholder="Phone number" value={newPhoneNumber}
                                          onChange={(e) => setNewPhoneNumber(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formManagerFirstName">
                        <Col mb={2}>
                            <Form.Control type="name" placeholder="First name" value={newFirstName}
                                          onChange={(e) => setNewFirstName(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formManagerLastName">
                        <Col mb={2}>
                            <Form.Control type="name" placeholder="Last name" value={newLastName}
                                          onChange={(e) => setNewLastName(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    {
                        errorMessageForLabel !== "" &&
                        <>
                            <Form.Group className="mb-3" controlId="formManagerLabel">

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
            <OpenAddNewManagerFormButton companies={companies} handleManagersFunction={managerHasBeenAdded}/>
        </>

    );
}