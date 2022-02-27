import Head from "next/head";
import ContactForm from "../components/forms/ContactForm";
import FollowSection from "../components/sections/FollowSection";

const Contact = () => {


  return (
    <div className=" pt-20">
      <Head>
        <title>Contact | NeonSignCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-2xl sm:text-5xl text-center uppercase font-semibold mb-10">
        need something more custom?
      </h1>
      <div className="px-5 lg:px-20">
        <ContactForm />
      </div>
      <FollowSection />
    </div>
  );
};

export default Contact;
