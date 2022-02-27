import InstaGallery from "../InstaGallery";
import CustomLink from '../CustomLink'
import { FaFacebook, FaInstagram } from "react-icons/fa";

const FollowSection = () => {
    return (
      <div>
        <h1 className="text-4xl sm:text-5xl text-center uppercase font-semibold mt-20 mb-6">
          follow us on
        </h1>
        <div className="px-5 lg:px-20 flex items-center justify-center gap-5 text-5xl">
          <CustomLink href="https://instagram.com/NeonSignCo.shop" target="_blank" className="relative">
            <FaInstagram />{" "}
          </CustomLink>
        </div>
        <div className="mt-20">
          <InstaGallery />
        </div>
      </div>
    );
}

export default FollowSection
