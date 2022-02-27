import Head from "next/head";
import CustomLink from "../CustomLink";
import FollowSection from "./FollowSection";
import NewsLetterSection from "./NewsLetterSection";

const TermsConditions = () => {
  return (
    <div className="pt-20">
      <Head>
        <title>Terms & Conditions | NeonSignCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-4xl sm:text-5xl text-center uppercase font-semibold mb-20">
        terms & conditions
      </h1>
      <div className="mb-20 grid gap-5 px-5 lg:px-20 max-w-4xl mx-auto text-lg">
        <p>
          Terms of Website Use NeonSignCo and purchasing from NeonSignCo
          directly.{" "}
        </p>
        <section className="mb-20 grid gap-5">
          <p>
            NeonSignCo Laser Designs Pty Ltd is committed to providing quality
            services to you and this policy outlines our ongoing obligations to
            you in respect of how we manage your Personal Information.
          </p>
          <p>
            We have adopted the Australian Privacy Principles (APPs) contained
            in the Privacy Act 1988 (Cth) (the Privacy Act). The NPPs govern the
            way in which we collect, use, disclose, store, secure and dispose of
            your Personal Information.
          </p>
          <p>
            A copy of the Australian Privacy Principles may be obtained from the
            website of The Office of the Australian Information Commissioner at
            www.aoic.gov.au
          </p>
          <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
            WHAT IS PERSONAL INFORMATION AND WHY DO WE COLLECT IT?
          </h3>
          <p>
            Personal Information is information or an opinion that identifies an
            individual. Examples of Personal Information we collect include:
            names, addresses, email addresses, phone and facsimile numbers.
          </p>
          <p>
            This Personal Information is obtained in many ways including
            interviews, correspondence, by telephone, by email, via our website
            www.NeonSignCo.com, from your website, from social media platforms
            such as Instagram and Facebook, from media and publications, from
            other publicly available sources, from cookies and from third
            parties. We don’t guarantee website links or policy of authorized
            third parties.
          </p>
          <p>
            We collect your Personal Information for the primary purpose of
            providing our services to you, providing information to our clients
            and marketing. We may also use your Personal Information for
            secondary purposes closely related to the primary purpose, in
            circumstances where you would reasonably expect such use or
            disclosure. You may unsubscribe from our mailing/marketing lists at
            any time by contacting us in writing.
          </p>
          <p>
            When we collect Personal Information we will, where appropriate and
            where possible, explain to you why we are collecting the information
            and how we plan to use it.
          </p>
          <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
            SENSITIVE INFORMATION
          </h3>
          <p>
            Sensitive information is defined in the Privacy Act to include
            information or opinion about such things as an individual's racial
            or ethnic origin, political opinions, membership of a political
            association, religious or philosophical beliefs, membership of a
            trade union or other professional body, criminal record or health
            information.
          </p>
          <p>Sensitive information will be used by us only:</p>
          <ul className="list-disc list-inside">
            <li>For the primary purpose for which it was obtained</li>
            <li>
              For a secondary purpose that is directly related to the primary
              purpose
            </li>
            <li>With your consent; or where required or authorized by law.</li>
          </ul>
          <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
            THIRD PARTIES
          </h3>
          <p>
            Where reasonable and practicable to do so, we will collect your
            Personal Information only from you. However, in some circumstances
            we may be provided with information by third parties. In such a case
            we will take reasonable steps to ensure that you are made aware of
            the information provided to us by the third party.
          </p>
          <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
            DISCLOSURE OF PERSONAL INFORMATION
          </h3>
          <p>
            Your Personal Information may be disclosed in a number of
            circumstances including the following:
          </p>
          <ul className="list-disc list-inside">
            <li>
              Third parties where you consent to the use or disclosure; and
            </li>
            <li>Where required or authorized by law.</li>
          </ul>
          <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
            SECURITY OF PERSONAL INFORMATION
          </h3>
          <p>
            Your Personal Information is stored in a manner that reasonably
            protects it from misuse and loss and from unauthorized access,
            modification or disclosure.
          </p>
          <p>
            When your Personal Information is no longer needed for the purpose
            for which it was obtained, we will take reasonable steps to destroy
            or permanently de-identify your Personal Information. However, most
            of the Personal Information is or will be stored in client files
            which will be kept by us for a minimum of 7 years.
          </p>
          <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
            ACCESS TO YOUR PERSONAL INFORMATION
          </h3>
          <p>
            You may access the Personal Information we hold about you and to
            update and/or correct it, subject to certain exceptions. If you wish
            to access your Personal Information, please contact us in writing.
          </p>
          <p>
            NeonSignCo Laser Designs Pty Ltd will not charge any fee for your
            access request, but may charge an administrative fee for providing a
            copy of your Personal Information.
          </p>
          <p>
            In order to protect your Personal Information we may require
            identification from you before releasing the requested information.
          </p>
          <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
            MAINTAINING THE QUALITY OF YOUR PERSONAL INFORMATION
          </h3>
          <p>
            It is an important to us that your Personal Information is up to
            date. We will take reasonable steps to make sure that your Personal
            Information is accurate, complete and up-to-date. If you find that
            the information we have is not up to date or is inaccurate, please
            advise us as soon as practicable so we can update our records and
            ensure we can continue to provide quality services to you.
          </p>
          <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
            POLICY UPDATES
          </h3>
          <p>
            This Policy may change from time to time and is available on our
            website.
          </p>
          <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
            PRIVACY POLICY COMPLAINTS AND ENQUIRIES
          </h3>
          <p>
            If you have any queries or complaints about our Privacy Policy
            please contact us at:
          </p>
          <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
            NeonSignCo LASER DESIGNS PTY LTD
          </h3>
          <CustomLink
            text={process.env.NEXT_PUBLIC_MAIL_ADDRESS}
            href={`mailto:${process.env.NEXT_PUBLIC_MAIL_ADDRESS}`}
            className="uppercase font-semibold"
          />
          <CustomLink
            text="+12 3456 7890"
            href="tel:+12 3456 7890"
            className="uppercase font-semibold"
          />
        </section>
      </div>
      <NewsLetterSection/>
      <FollowSection />
    </div>
  );
};

export default TermsConditions;
