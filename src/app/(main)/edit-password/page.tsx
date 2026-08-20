import { FiHome } from "react-icons/fi";
import { FormEditPassword } from "./FormEditPassword";

const EditPasswordPage = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Edit Password</p>
            </div>
            <FormEditPassword />
        </>
    )
}

export default EditPasswordPage;