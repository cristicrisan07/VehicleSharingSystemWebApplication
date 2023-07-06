import Image from 'react-bootstrap/Image'
import React, {useEffect, useRef, useState} from "react";
import SingleSelect from "./SingleSelect";
import {getLocalItem, LocalStorageKeys, STRINGS} from "../../services/Utils";
import {Button, Col, Container, Row} from "react-bootstrap";
import {createDocumentStatusDTO} from "../../services/UserService";
import "../../pages/style/DocumentsValidation.css";


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
    const [indexOfCurrentlyVisiblePhoto,setIndexOfCurrentlyVisiblePhoto] = useState(0)
    const [picturesArray,setPicturesArray] = useState([])
    const [errorMessageForLabel,setErrorMessageForLabel]=useState("");
    const [rotationClassIndex,setRotationClassIndex] = useState(0);
    const [availableRotationClasses,setAvailableRotationClasses] = useState(["not-rotated","rotated90","rotated180","rotated270"])
    const countRef = useRef(rotationClassIndex);
    countRef.current = rotationClassIndex;
    const initializeImages = () => {
        let identity = identities.find(identity => identity.username === selectedNameFromDropdown);
        setSelectedIdentity(identity)
        setPhotoFront(identity.photoFront)
        setPhotoBack(identity.photoBack)
        setPhotoID(identity.photoIDCard)
        setPicturesArray([identity.photoIDCard,identity.photoFront,identity.photoBack])
        setIndexOfCurrentlyVisiblePhoto(0)
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
    const rotateImage = () => {
        countRef.current =(rotationClassIndex+1)%4
        setRotationClassIndex((rotationClassIndex+1)%4)

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
                <Col style={{display:"flex",justifyContent:"left"}} >
                    <Button className="btn btn-primary btn-theme-admin">
                        <img src={require("../../reload.png")} style={{width:"30px",height:"30px"}} onClick={refreshIdentities}/>
                        <div style={{paddingLeft:"1rem"}}>Refresh requests</div>
                    </Button>
                </Col>
            </Row>
            <br/>
            {selectedNameFromDropdown!==""&& picturesArray.length>0 &&
                <Row>
                    <Col style={{display:"flex",justifyContent:"right",alignItems:"center"}} >
                        <img src={require("../../icon_left_96.png")} style={{width:"96px",height:"96px"}}
                             onClick={()=>setIndexOfCurrentlyVisiblePhoto((indexOfCurrentlyVisiblePhoto+1)%3)}/>
                    </Col>
                    <Col>
                        <Row>
                            <Col style={{display:"flex",justifyContent:"center"}} >
                                <Button className="btn btn-primary btn-theme-admin" onClick={rotateImage}>
                                    <img src={require("../../icons8-rotate-30.png")} style={{width:"30px",height:"30px"}} />
                                    <div style={{paddingLeft:"1rem"}}>Rotate image</div>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{display:"flex",justifyContent:"center",alignItems:"center",height:"90vh",width:"100%"}}>
                            <Image className={`photo-size ${availableRotationClasses[countRef.current]}`} src={`data:image/jpeg;base64,${picturesArray[indexOfCurrentlyVisiblePhoto]}`}></Image>
                            </Col>
                        </Row>
                    </Col>
                    <Col style={{display:"flex",justifyContent:"left",alignItems:"center"}} >
                        <img src={require("../../icon_right_96.png")} style={{width:"96px",height:"96px"}}
                             onClick={()=>setIndexOfCurrentlyVisiblePhoto((indexOfCurrentlyVisiblePhoto+1)%3)}/>
                    </Col>
                    <Col>
                        <Row style={{height:"45vh"}}>
                            <Col style={{display:"flex",justifyContent:"center",alignItems:"end",paddingBottom:"1rem"}}>
                                <Button className="btn btn-primary btn-theme" onClick={(e) => handleSubmit(e,"VALID") }>
                                    Approve
                                </Button>
                            </Col>
                        </Row>
                        <Row style={{height:"45vh"}}>
                            <Col style={{display:"flex",justifyContent:"center",alignItems:"start",paddingTop:"1rem"}}>
                                <Button className="btn btn-primary btn-theme" onClick={(e) => handleSubmit(e,"INVALID")}>
                                    Deny
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            }
    </>)
}