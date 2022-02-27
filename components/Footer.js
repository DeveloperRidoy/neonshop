import { FaCcMastercard, FaCcPaypal, FaCcVisa, FaEnvelopeOpenText, FaMapMarkedAlt } from "react-icons/fa";
import CustomLink  from "./CustomLink"

const Footer = () => {

    return (
      <div className="px-5 lg:px-20 py-10 bg-black text-white ">
        <CustomLink
          className="transition hover:underline"
          className="text-4xl"
          text="NeonSignCo"
        />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-20 sm:gap-10 capitalize text-sm">
          <div className="grid gap-2 place-content-start">
            <h4 className="font-semibold uppercase mb-3">customer care</h4>
            <CustomLink
              href="/track-order"
              className="transition hover:underline"
              text="Track order"
            />
            <CustomLink
              href="/shipping-returns"
              className="transition hover:underline"
              text="Shipping & returns"
            />
            <CustomLink
              className="transition hover:underline uppercase"
              text="faq"
            />
            <CustomLink
              href="/contact"
              className="transition hover:underline"
              text="contact"
            />
            {/* <CustomLink
              href="/privacy-policy"
              className="transition hover:underline"
              text="privacy policy"
            /> */}
            {/* <CustomLink
              href="/terms-conditions"
              className="transition hover:underline"
              text="terms & conditions"
            /> */}
            <CustomLink
              href="/refund-policy"
              className="transition hover:underline"
              text="refund policy"
            />
            <CustomLink
              href="/e-privacy"
              className="transition hover:underline"
              text="e-privacy"
            />
          </div>
          <div className="grid gap-2 place-content-start">
            <h4 className="font-semibold uppercase mb-3">company</h4>
            <CustomLink
              href="/custom-neon-sign"
              className="transition hover:underline"
              text="custom neons"
            />
            <CustomLink
              href="/about-us"
              className="transition hover:underline"
              text="about us"
            />
            <CustomLink className="transition hover:underline" text="careers" />
            <CustomLink
              className="transition hover:underline"
              text="partnershops/collabs"
            />
          </div>
          <div className="grid gap-2 place-content-start">
            <h4 className="font-semibold uppercase mb-3">contact</h4>
            <div>
              <div className="flex items-center gap-1">
                <FaEnvelopeOpenText />
                <span>email:</span>
              </div>
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_MAIL_ADDRESS}`}
                className="transition hover:underline"
              >
                {process.env.NEXT_PUBLIC_MAIL_ADDRESS}
              </a>
            </div>

          </div>
        </div>
        <div className="h-[1px] bg-gray-900 my-4"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          <p>© {new Date().getFullYear()} NeonSignCo</p>
          <div className="flex gap-2 text-6xl">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
          </div>
        </div>
      </div>
    );
}

export default Footer
