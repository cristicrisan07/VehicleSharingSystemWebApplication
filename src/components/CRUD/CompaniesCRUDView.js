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

        console.log(companies);

        let company = companies.find(company => company.name===selectedNameFromDropdown);
        setSelectedCompany(company);

        setNewName(company.name)
        setNewEmail(company.email);
        setNewPhoneNumber(company.phoneNumber);
        setErrorMessageForLabel("");

    }

    const changesOccurredInFormData = () =>{
        return  newEmail !== selectedCompany.email || newName !== selectedCompany.name || newPhoneNumber !== selectedCompany.phoneNumber;
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
                    method: 'PUT',
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
                        if(!res.contains("ERROR")){
                            setCompanies(companies.filter(company=>company.name!==selectedCompany.name));
                            setCompanies([...companies,d])
                            props.handleCompaniesFunction(companies)
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
            setCompanies(companies.filter(company=>company.name!==selectedCompany.name));
            props.handleCompaniesFunction(companies)
            setSelectedNameFromDropdown("");
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
        setCompanies([...companies,company])
        props.handleCompaniesFunction(companies)
    }
    return (
        <>
            {   companies !== undefined && companies.length > 0 &&
                         <SingleSelect parentFunction={setSelectedNameFromDropdown} inputStrings={companies.map(el => el.name)}/>
            }
            <br/>
            {selectedNameFromDropdown!==""&&
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalName">
                        <Col mb={2}>
                            <Form.Control type="name" placeholder="Name" value={newName}
                                          onChange={(e) => setNewName(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                        <Col mb={2}>
                            <Form.Control type="email" placeholder="Email" value={newEmail}
                                          onChange={(e) => setNewEmail(e.target.value)}/>
                        </Col>
                    </Form.Group>



                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalPhoneNumber">
                        <Col mb={2}>
                            <Form.Control type="phone-number" placeholder="Phone number" value={newPhoneNumber}
                                          onChange={(e) => setNewPhoneNumber(e.target.value)}/>
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
            <OpenAddNewCompanyFormButton handleCompaniesFunction={companyHasBeenAdded}/>
        </>

    );
}