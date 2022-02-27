import { BsX } from "react-icons/bs"

const CustomNeonSignModal = ({close}) => {
    return (
        <div className="p-2 bg-white w-52">
            <div className="flex">
                <button className="ml-auto" onClick={close}><BsX/></button>
            </div>
        </div>
    )
}

export default CustomNeonSignModal
