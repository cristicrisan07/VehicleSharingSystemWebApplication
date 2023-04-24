import "./style/LoginPage.css";
import {getLocalItem, LocalStorageKeys, STRINGS} from "../services/Utils";
import {Tab, Tabs} from "react-bootstrap";
import {useEffect, useState} from "react";
import VehiclesCRUDView from "../components/CRUD/VehiclesCRUDView";
export const ManagerHomepage = () => {
    const [key, setKey] = useState('key');

    return (
        <>
            <h3 className="h4 font-weight-bold text-theme">
                Vehicle Sharing Web Application Manager Section
            </h3>
            <h2>Hello {getLocalItem(LocalStorageKeys.USER).username}</h2>

            <Tabs
                id="uncontrolled-tab"
                activeKey={key}
                transition={false}
                onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab eventKey="vehicles" title="Vehicles">
                    <VehiclesCRUDView/>
                </Tab>
                <Tab eventKey="stats" title="Statistics">
                </Tab>

            </Tabs>
        </>
    );
};