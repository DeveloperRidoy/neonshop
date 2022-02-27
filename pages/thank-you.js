import Head from "next/head";
import CustomLink from "../components/CustomLink";
import { useGlobalContext } from "../context/GlobalContext";
const ThankYou = () => {
  const [globalSTate] = useGlobalContext();
    return (
      <div className="px-5 lg:px-20 py-20">
        <Head>
          <title>Thank You | NeonSignCo</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col gap-10 items-center text-center">
          <h1 className="text-3xl text-green-500">thank you for you order!</h1>
          <p>
            Check your email for confirmation message{" "}
            {globalSTate.auth.user && (
              <span>
                or check you order status in your{" "}
                <CustomLink
                  href="/account"
                  className="font-semibold"
                  text="account page"
                />
              </span>
            )}
          </p>
          <div className="flex gap-2 items-center gap-3">
            <CustomLink
              href="/shop"
              className="py-2 px-8 bg-gray-900 text-white capitalize"
              text="Shop"
            />
            <CustomLink
              href="/custom-neon-sign"
              className="py-2 px-8 bg-gray-900 text-white capitalize"
              text="custom neon"
            />
          </div>
        </div>
      </div>
    );
}

export default ThankYou



export const getServerSideProps = async ({ query, req }) => {
    
    try {
      const ordered = query.ordered; 

        if (!ordered)
          return {
            redirect: {
              destination: "/",
              permanent: false,
            },
            };
        

     
     return {
       props: {
       },
     };
   } catch (error) {
     console.log(error);
     return {
       props: {
         error: { code: 500, message: "server error" },
       },
     };
   }
}