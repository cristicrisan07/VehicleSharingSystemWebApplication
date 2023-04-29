import "./style/LoginPage.css";
import {getLocalItem, LocalStorageKeys, STRINGS} from "../services/Utils";
import {Button, Col, Row, Tab, Tabs} from "react-bootstrap";
import {useEffect, useState} from "react";
import CompaniesCRUDView from "../components/CRUD/CompaniesCRUDView";
import ManagersCRUDView from "../components/CRUD/ManagersCRUDView";
import {doLogout} from "../services/UserService";
import {useNavigate} from "react-router-dom";
export const AdminHomepage = () => {
    const [key, setKey] = useState('key');
    const [companies,setCompanies]=useState([]);
    const navigate = useNavigate()

    const getCompanies = () =>{
        if(companies.length===0){
            fetch(STRINGS.GET_ALL_COMPANIES_URL,{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization":"Bearer " + getLocalItem(LocalStorageKeys.USER).token}
                })
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {

                        if (data.name === "") return false;
                        else {
                            return Promise.reject("Some weird error.");
                        }
                    } else {
                        setCompanies(data);
                    }

                })
                .catch(error => {
                    console.error('There was an error!', error);
                })
        }
    }

    const newCompany = (company) =>{
        setCompanies([...companies,company])
    }
    const deleteCompany = (companyToDelete) =>{
        setCompanies(companies.filter(company=>company.name!==companyToDelete.name));
    }
    //don't move up
    //"Cannot invoke getCompanies before initialization" thrown.
    useEffect(getCompanies,[]);
    return (
        <>
            <h3 className="h4 font-weight-bold text-theme">
                Vehicle Sharing Web Application Administrator Section
            </h3>
            <Row>
                <Col>
                    <h2>Hello {getLocalItem(LocalStorageKeys.USER).username}</h2>
                    <Button onClick={()=>doLogout(false,navigate)}>Log out</Button>
                </Col>
            </Row>

            <Tabs
                id="uncontrolled-tab"
                activeKey={key}
                transition={false}
                onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab eventKey="companies" title="Companies">
                    <CompaniesCRUDView companies={companies} companyDeletedFunction = {deleteCompany} companyAddedFunction={newCompany}/>
                </Tab>
                <Tab eventKey="managers" title="Managers">
                    <ManagersCRUDView companies={companies}/>
                </Tab>

            </Tabs>
         </>
    );
};