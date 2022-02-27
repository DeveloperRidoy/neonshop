import Head from "next/head";
import CustomLink from "../components/CustomLink";
import FollowSection from "../components/sections/FollowSection";
import NewsLetterSection from "../components/sections/NewsLetterSection";

const EPrivacy = () => {
    return (
      <div className="pt-20">
        <Head>
          <title>E-Privacy | NeonSignCo</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1 className="text-4xl sm:text-5xl text-center uppercase font-semibold mb-10">
          e-privacy
        </h1>
        <div className="mb-10 grid gap-5 px-5 lg:px-20 max-w-4xl mx-auto text-lg">
          <div className="mb-10 grid gap-5">
            <h2 className="uppercase font-semibold text-2xl sm:text-3xl">
              cookie policy
            </h2>
            <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
              what are cookies?
            </h3>
            <p>
              Cookies are simple text files that are stored on your computer or
              mobile device by a website’s server. Each cookie is unique to your
              web browser. It will contain some anonymous information such as a
              unique identifier, website’s domain name, and some digits and
              numbers.
            </p>
            <h3 className="mt-5 uppercase font-semibold text-xl sm:text-2xl">
              What types of cookies do we use?
            </h3>
            <p className="italic">Necessary cookies</p>
            <p>
              Personal Information is information or an opinion that identifies
              an individual. Examples of Personal Information we collect
              include: names, addresses, email addresses, phone and facsimile
              numbers.
            </p>
            <p className="italic">Functionality cookies</p>
            <p>
              Functionality cookies let us operate the site in accordance with
              the choices you make. For example, we will recognize your username
              and remember how you customized the site during future visits.
            </p>
            <p className="italic">Analytical cookies</p>
            <p>
              These cookies enable us and third-party services to collect
              aggregated data for statistical purposes on how our visitors use
              the website. These cookies do not contain personal information
              such as names and email addresses and are used to help us improve
              your user experience of the website.
            </p>
            <p className="italic">How to delete cookies?</p>
            <p>
              If you want to restrict or block the cookies that are set by our
              website, you can do so through your browser setting.
              Alternatively, you can visit{" "}
              <CustomLink
                href="https://internetcookies.org"
                text="www.internetcookies.org"
                className="font-semibold hover:underline"
              />{" "}
              , which contains comprehensive information on how to do this on a
              wide variety of browsers and devices. You will find general
              information about cookies and details on how to delete cookies
              from your device.
            </p>
          </div>
          <div className="mb-10 grid gap-5">
            <h2 className="uppercase font-semibold text-2xl sm:text-3xl">
              data portability
            </h2>
            <p>
              ou have the right to be able to access your personal data at any
              time. This includes your account information, your order records
              as well as any GDPR related requests you have made so far. You
              have the right to request a full report of your data.
            </p>
          </div>
          <div className="mb-10 grid gap-5">
            <h2 className="uppercase font-semibold text-2xl sm:text-3xl">
              DATA RECTIFICATION
            </h2>
            <p>
              You have the right to request your data to be updated whenever you
              think it is appropriate.
            </p>
          </div>
          <div className="mb-10 grid gap-5">
            <h2 className="uppercase font-semibold text-2xl sm:text-3xl">
              RIGHT TO BE FORGOTTEN
            </h2>
            <p>
              Use this option if you want to remove your personal and other data
              from our store. Keep in mind that this process will delete your
              account, so you will no longer be able to access or use it
              anymore.
            </p>
          </div>
        </div>
        <NewsLetterSection />
        <FollowSection />
      </div>
    );
}

export default EPrivacy
