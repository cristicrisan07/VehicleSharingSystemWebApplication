import React,{useEffect, useState} from "react";
import SingleSelect from "../Partial/SingleSelect";
import {Button, Col, Form, Row} from "react-bootstrap";
import validateCompanyData from "../Validator";
import {getLocalItem, LocalStorageKeys, STRINGS} from "../../services/Utils";
import {OpenAddNewCompanyFormButton} from "../Partial/OpenAddNewCompanyFormButton";

export default function CompaniesCRUDView (props) {

    const [companies,setCompanies]=useState(props.companies);
    const [selectedNameFromDropdown,setSelectedNameFromDropdown] = useState("");

    const [selectedCompany,setSelectedCompany]=useState(
        {
            name:"",
            emailAddress:"",
            phoneNumber:""
        }
    );

    const [newEmail,setNewEmail] = useState("")
    const [newName,setNewName] = useState("")
    const [newPhoneNumber,setNewPhoneNumber] = useState("")

    const [errorMessageForLabel,setErrorMessageForLabel]=useState("");

    const initializeForm = () => {

        let company = companies.find(company => company.name===selectedNameFromDropdown);
        setSelectedCompany(company);

        setNewName(company.name)
        setNewEmail(company.emailAddress);
        setNewPhoneNumber(company.phoneNumber);
        setErrorMessageForLabel("");

    }

    const changesOccurredInFormData = () =>{
        return  newEmail !== selectedCompany.emailAddress || newName !== selectedCompany.name || newPhoneNumber !== selectedCompany.phoneNumber;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let changesOccurredStatus = changesOccurredInFormData();
        if(changesOccurredStatus===true) {
            let status = validateCompanyData(newName,newEmail,newPhoneNumber)
            if (status === STRINGS.STATUS_VALID) {
                let d = {
                    name: newName,
                    emailAddress: newEmail,
                    phoneNumber: newPhoneNumber
                }
                await fetch(STRINGS.UPDATE_COMPANY_URL, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization":"Bearer " + getLocalItem(LocalStorageKeys.USER).token
                    },
                    body: JSON.stringify(d)
                }).then(function (res) {
                    return res.text();
                }).then(function (res) {
                    setErrorMessageForLabel(res);
                        if(!res.includes("ERROR")){
                            setCompanies(companies.filter(company=>company.name!==selectedCompany.name));
                            setCompanies([...companies,d])
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
        fetch(STRINGS.DELETE_COMPANY_URL+selectedCompany.name,{
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
            if (!res.includes("ERROR")) {
                setCompanies(companies.filter(company => company.name !== selectedCompany.name));
                props.companyDeletedFunction(selectedCompany);
                setSelectedNameFromDropdown("");
            }
            }
        )
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    useEffect(()=>{
        if(selectedNameFromDropdown!=="") {
            initializeForm();
        }
        },[selectedNameFromDropdown])

    const companyHasBeenAdded = (company) =>{
        props.companyAddedFunction(company)
    }
    useEffect(()=>{
        setCompanies(props.companies);
    },[props.companies])

    return (
        <>
            {   companies !== undefined && companies.length > 0 &&
                         <SingleSelect parentFunction={setSelectedNameFromDropdown} inputStrings={companies.map(el => el.name)}/>
            }
            <br/>
            {selectedNameFromDropdown!==""&&
                <Form>
                    <Form.Group className="mb-3" controlId="formCompanyName">
                        <Col mb={2}>
                            <Form.Control type="name" placeholder="Name" value={newName} disabled={true}
                                          onChange={(e) => setNewName(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formCompanyEmail">
                        <Col mb={2}>
                            <Form.Control type="email" placeholder="Email" value={newEmail}
                                          onChange={(e) => setNewEmail(e.target.value)}/>
                        </Col>
                    </Form.Group>



                    <Form.Group className="mb-3" controlId="formCompanyPhoneNumber">
                        <Col mb={2}>
                            <Form.Control type="phone-number" placeholder="Phone number" value={newPhoneNumber}
                                          onChange={(e) => setNewPhoneNumber(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    {
                        errorMessageForLabel !== "" &&
                        <>
                            <Form.Group className="mb-3" controlId="formCompanyLabel">

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
            <OpenAddNewCompanyFormButton handleCompaniesFunction={companyHasBeenAdded}/>
        </>

    );
}