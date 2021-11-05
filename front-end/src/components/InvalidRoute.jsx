import { useEffect } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

function InvalidRoute() {
    useEffect(() => {
        toast.error("You have entered an invalid route.");
    }, []);
    return <Redirect to={"/"} />;
}

export default InvalidRoute;