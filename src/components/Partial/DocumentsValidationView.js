import Image from 'react-bootstrap/Image'
import React, {useEffect, useState} from "react";
import SingleSelect from "./SingleSelect";
import {getLocalItem, LocalStorageKeys, STRINGS} from "../../services/Utils";
import {Button, Col, Container, Row} from "react-bootstrap";
import {createDocumentStatusDTO} from "../../services/UserService";

export default function DocumentsValidationView (){
    const [identities,setIdentities] = useState([])
    const [selectedNameFromDropdown, setSelectedNameFromDropdown] = useState("")
    const [selectedIdentity,setSelectedIdentity]=useState(
        {
            username:"",
            photoFront:"",
            photoBack:"",
            photoIDCard:""
        }
    );
    const [photoFront, setPhotoFront] = useState("")
    const [photoBack, setPhotoBack] = useState("")
    const [photoIDCard, setPhotoID] = useState("")
    const [errorMessageForLabel,setErrorMessageForLabel]=useState("");
    const initializeImages = () => {
        let identity = identities.find(identity => identity.username === selectedNameFromDropdown);
        setSelectedIdentity(identity)
        setPhotoFront(identity.photoFront)
        setPhotoBack(identity.photoBack)
        setPhotoID(identity.photoIDCard)
        setErrorMessageForLabel("");
    }

    const handleSubmit = async (e,status) => {
        e.preventDefault()
        let d = createDocumentStatusDTO(selectedIdentity.username,status);
        let stringifiedObj = JSON.stringify(d)
        await fetch(STRINGS.SET_STATUS_OF_DRIVER_DOCUMENT_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + getLocalItem(LocalStorageKeys.USER).token
            },
            body: stringifiedObj
        }).then(function (res) {
            return res.text();
        }).then(function (res) {
            setErrorMessageForLabel(res);
            if (!res.includes("ERROR")) {
                setIdentities(identities.filter(identity=>identity.username!==selectedIdentity.username))
                setSelectedNameFromDropdown("");
            }
        })

    }

    const getIdentities = (purpose) =>{
        if((purpose === "init" && identities.length===0) || purpose === "refresh"){
            fetch(STRINGS.GET_PENDING_VALIDATIONS_URL,{
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
                        return Promise.reject("Some weird error.");
                    } else {
                        setIdentities(data);
                    }

                })
                .catch(error => {
                    console.error('There was an error!', error);
                })
        }
    }

    const refreshIdentities = () =>{
        setSelectedNameFromDropdown("")
        getIdentities("refresh")
    }

    //don't move up
    //"Cannot invoke getSubscriptions before initialization" thrown.
    useEffect(()=>{getIdentities("init")},[]);

    useEffect(()=>{
        if(selectedNameFromDropdown!=="") {
            initializeImages();
        }
    },[selectedNameFromDropdown])
    return (
        <>
            <Row>
                <Col style={{paddingLeft:"25vw"}}>
                    {   identities.length > 0 &&
                        <SingleSelect parentFunction={setSelectedNameFromDropdown} inputStrings={identities.map(el => el.username)}/>
                    }
                </Col>
                <Col style={{display:"flex",justifyContent:"left",paddingTop:"0.25rem"}} >
                    <img src={require("../../reload.png")} style={{width:"30px",height:"30px"}} onClick={refreshIdentities}/>
                </Col>
            </Row>
            <br/>
            {selectedNameFromDropdown!==""&&
                <Row>
                    <Col style={{height:"650px",width:"30%"}}>
                        <Image src={`data:image/jpeg;base64,${photoFront}`} style={{maxHeight:"100%",width:"auto"}}></Image>
                    </Col>
                    <Col style={{height:"650px"}}>
                        <Image src={`data:image/jpeg;base64,${photoBack}`} style={{maxHeight:"100%",width:"auto"}}></Image>
                    </Col>
                    <Col style={{height:"650px"}}>
                        <Image src={`data:image/jpeg;base64,${photoIDCard}`} style={{maxHeight:"100%",width:"auto"}}></Image>
                    </Col>
                    <Col>
                        <Row style={{height:"100px",paddingTop:"15rem"}}>
                            <Col>
                                <Button onClick={(e) => handleSubmit(e,"VALID")}>
                                    Approve
                                </Button>
                            </Col>
                        </Row>
                        <Row style={{height:"100px",paddingTop:"7rem"}}>
                            <Col>
                                <Button onClick={(e) => handleSubmit(e,"INVALID")}>
                                    Deny
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            }
    </>)
}