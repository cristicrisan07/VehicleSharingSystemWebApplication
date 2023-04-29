import {ErrorPage} from "./ErrorPage";
import {isAuthorized, isLoggedIn} from "../../services/Utils";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const ProtectedPage = (props) => {

    const navigate = useNavigate()
    useEffect(()=>{
        if(!isLoggedIn()){
            navigate(props.redirectLink)
        }
        if(!(isLoggedIn() && (props.authority === undefined || isAuthorized(props.authority)))){
            navigate(props.redirectLink)
        }
    },[])

    const notLoggedInError = {
        message: "Unauthorized access!",
        details: "You cannot view this page, because you are not logged in! Redirecting you to login page..."
    }
    const notAuthorizedError = {
        message: "Unauthorized access!",
        details: "You cannot view this page, because you do not have sufficient" +
            " access rights. Redirecting you to login page..."
    }

    return (!isLoggedIn() ?
            <ErrorPage error={notLoggedInError}/>
            :
            props.authority === undefined || isAuthorized(props.authority) ?
                props.component
                :
                <ErrorPage error={notAuthorizedError}/>
    )
}