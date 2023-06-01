import "./style/LoginPage.css";
import {getLocalItem, LocalStorageKeys, STRINGS} from "../services/Utils";
import {Button, Col, Row, Tab, Tabs} from "react-bootstrap";
import {useEffect, useState} from "react";
import VehiclesCRUDView from "../components/CRUD/VehiclesCRUDView";
import {doLogout} from "../services/UserService";
import {useNavigate} from "react-router-dom";
import SubscriptionsCRUDView from "../components/CRUD/SubscriptionsCRUDView";
export const ManagerHomepage = () => {
    const [key, setKey] = useState('key');
    const navigate = useNavigate();

    return (
        <>
            <h3 className="h4 font-weight-bold text-theme">
                Vehicle Sharing Web Application Manager Section
            </h3>
            <Row>
                <Col>
                    <h2>Hello {getLocalItem(LocalStorageKeys.USER).username}</h2>
                    <Button onClick={()=>doLogout(true,navigate)}>Log out</Button>
                </Col>
            </Row>

            <Tabs
                id="uncontrolled-tab"
                activeKey={key}
                transition={false}
                onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab eventKey="vehicles" title="Vehicles">
                    <VehiclesCRUDView manufacturers={["Audi"]}/>
                </Tab>

            </Tabs>
        </>
    );
};