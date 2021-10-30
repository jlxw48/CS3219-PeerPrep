import { AppContext } from "../../App";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { VALIDATE_LOGIN_URL, MATCH_GET_INTERVIEW_URL } from "../../Api";

export function useAppStateHelper() {
    const { user, setUser, userRef, match, setMatch, matchRef } = useContext(AppContext);
    const checkLogin = () => {
        return axios.get(VALIDATE_LOGIN_URL).then(res => {
            if (res.status == 200) {
                setUser(res.data.data);
                return true;
            }
            return false;
        }).catch(err => { }); // No JWT cookie or invalid JWT cookie
    }

    const history = useHistory();

    function redirectToPractice() {
        history.push({ pathname: '/practice' });
      }

    const checkIfUserInMatch = () => {
        const EndInterViewToastMsg = () => (<p>Interview successfully resumed. Click <b>End Interview</b> to find another match.</p>)
        return axios.get(MATCH_GET_INTERVIEW_URL + `?email=${userRef.current.email}`).then(res => {
            if (res.status == 200 && res.data.status == "success") {
                setMatch(res.data.data);
                return true;
            } else {
                return false;
            }
        }).then(hasMatch => {
            if (hasMatch) {
                toast.success(EndInterViewToastMsg);
                redirectToPractice();
                return true;
            } else {
                return false;
            }
        }).catch(err => { }); // Not in match
    }

    return { checkLogin, checkIfUserInMatch };
}