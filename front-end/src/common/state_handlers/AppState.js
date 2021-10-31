import { AppContext } from "../../App";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { VALIDATE_LOGIN_URL, MATCH_GET_INTERVIEW_URL } from "../../Api";

export function useAppStateHelper() {
    const { setUser, userRef, setMatch } = useContext(AppContext);
    const checkLogin = () => {
        return axios.get(VALIDATE_LOGIN_URL).then(res => res.data.data).then(data => {
            setUser(data);
            return true;
        }).catch(err => false); // No JWT cookie or invalid JWT cookie
    }

    const history = useHistory();

    function redirectToPractice() {
        history.push({ pathname: '/practice' });
    }

    const checkIfUserInMatch = () => {
        const EndInterViewToastMsg = () => (<p>Interview successfully resumed. Click <b>End Interview</b> to find another match.</p>)
        return axios.get(MATCH_GET_INTERVIEW_URL + `?email=${userRef.current.email}`).then(res => {
            setMatch(res.data.data);
            toast.success(EndInterViewToastMsg);
            redirectToPractice();
            return true;
        }).catch(err => false); // Not in match
    }

    return { checkLogin, checkIfUserInMatch };
}