import "./style/LoginPage.css";
import {getLocalItem, LocalStorageKeys, STRINGS} from "../services/Utils";
import {Tab, Tabs} from "react-bootstrap";
import {useEffect, useState} from "react";
import CompaniesCRUDView from "../components/CRUD/CompaniesCRUDView";
import ManagersCRUDView from "../components/CRUD/ManagersCRUDView";
export const AdminHomepage = () => {
    const [key, setKey] = useState('key');
    const [companies,setCompanies]=useState([]);

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

    //don't move up
    //"Cannot invoke getCompanies before initialization" thrown.
    useEffect(getCompanies,[]);
    return (
        <>
            <h3 className="h4 font-weight-bold text-theme">
                Vehicle Sharing Web Application Administrator Section
            </h3>
            <h2>Hello {getLocalItem(LocalStorageKeys.USER).username}</h2>

            <Tabs
                id="uncontrolled-tab"
                activeKey={key}
                transition={false}
                onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab eventKey="companies" title="Companies">
                    <CompaniesCRUDView companies={companies} handleCompaniesFunction={setCompanies}/>
                </Tab>
                <Tab eventKey="managers" title="Managers">
                    <ManagersCRUDView companies={companies} handleCompaniesFunction={setCompanies}/>
                </Tab>

            </Tabs>
         </>
    );
};