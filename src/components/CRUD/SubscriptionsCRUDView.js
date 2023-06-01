import React, {useEffect, useState} from "react";
import {validateAccountData, validateSubscriptionData} from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS, UserRoles} from "../../services/Utils";
import {createSubscriptionDTO} from "../../services/UserService";
import SingleSelect from "../Partial/SingleSelect";
import {Button, Col, Form} from "react-bootstrap";
import {OpenAddNewSubscriptionFormButton} from "../Partial/OpenAddNewSubscriptionFormButton";

export default function SubscriptionsCRUDView (props){

    const [subscriptions,setSubscriptions] = useState([])
    const [selectedNameFromDropdown,setSelectedNameFromDropdown] = useState("");
    const [selectedSubscription,setSelectedSubscription]=useState(
        {
            id:"",
            name:"",
            kilometersLimit:"",
            rentalPriceDTO:""
        }
    );
    const [newKilometersLimit,setNewKilometersLimit] = useState("")
    const [newName,setNewName] = useState("")
    const [newRentalPriceValue,setNewRentalPriceValue] = useState("")

    const [errorMessageForLabel,setErrorMessageForLabel]=useState("");


    const initializeForm = () => {
        let subscription = subscriptions.find(subscription => subscription.name === selectedNameFromDropdown);
        setSelectedSubscription(subscription);


        setNewRentalPriceValue(subscription.rentalPriceDTO.value)
        setNewName(subscription.name)
        setNewKilometersLimit(subscription.kilometersLimit)
        setErrorMessageForLabel("");
    }
    
    const changesOccurredInFormData = () =>{
        return newKilometersLimit !== selectedSubscription.kilometersLimit ||
            newName !== selectedSubscription.name ||
            newRentalPriceValue !== selectedSubscription.rentalPriceDTO.value
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        let changesOccurredStatus = changesOccurredInFormData();
        if(changesOccurredStatus===true) {
            let status = validateSubscriptionData(newName,newKilometersLimit,newRentalPriceValue)
            if (status === STRINGS.STATUS_VALID) {
                let subscription = createSubscriptionDTO(selectedSubscription.id,newName,newKilometersLimit,newRentalPriceValue,selectedSubscription.rentalPriceDTO.timeUnit)
                await fetch(STRINGS.UPDATE_SUBSCRIPTION_URL, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization":"Bearer " + getLocalItem(LocalStorageKeys.USER).token
                    },
                    body: JSON.stringify(subscription)
                }).then(function (res) {
                    return res.text();
                }).then(function (res) {
                    setErrorMessageForLabel(res);
                    if(!res.includes("ERROR")){
                        setSubscriptions([...subscriptions.filter(subscription=>subscription.name!==selectedSubscription.name),subscription])
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
        fetch(STRINGS.DELETE_SUBSCRIPTION_URL+selectedSubscription.id,{
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
                setSubscriptions(subscriptions.filter(subscription=>subscription.name!==selectedSubscription.name))
                setSelectedNameFromDropdown("");
            }
        )
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    const getSubscriptions = () =>{
        if(subscriptions.length===0){
            fetch(STRINGS.GET_ALL_SUBSCRIPTIONS_URL,{
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
                        setSubscriptions(data);
                    }

                })
                .catch(error => {
                    console.error('There was an error!', error);
                })
        }
    }

    //don't move up
    //"Cannot invoke getSubscriptions before initialization" thrown.
    useEffect(getSubscriptions,[]);

    useEffect(()=>{
        if(selectedNameFromDropdown!=="") {
            initializeForm();
        }
    },[selectedNameFromDropdown])

    const subscriptionHasBeenAdded = (subscription) =>{
        setSubscriptions([...subscriptions,subscription])
    }

    return (
        <>
            {   subscriptions.length > 0 &&
                <SingleSelect parentFunction={setSelectedNameFromDropdown} inputStrings={subscriptions.map(el => el.name)}/>
            }
            <br/>
            {selectedNameFromDropdown!==""&&
                <Form>
                    <Form.Group className="mb-3" controlId="formSubscriptionName">
                        <Col mb={2}>
                            <Form.Control type="name" placeholder="Name" value={newName}
                                          onChange={(e) => setNewName(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formSubscriptionKilometersLimit">
                        <Col mb={2}>
                            <Form.Control type="number" placeholder="New kilometers limit" value={newKilometersLimit}
                                          onChange={(e) => setNewKilometersLimit(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formSubscriptionRentalPriceValue">
                        <Col mb={2}>
                            <Form.Control type="number" placeholder="Price" value={newRentalPriceValue}
                                          onChange={(e) => setNewRentalPriceValue(e.target.value)}/>
                            <Form.Label className="HomepageLabel">per {selectedSubscription.rentalPriceDTO.timeUnit}</Form.Label>
                        </Col>
                    </Form.Group>

                    {
                        errorMessageForLabel !== "" &&
                        <>
                            <Form.Group className="mb-3" controlId="formSubscriptionLabel">

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
            <OpenAddNewSubscriptionFormButton handleSubscriptionsFunction={subscriptionHasBeenAdded}/>
        </>

    );
}