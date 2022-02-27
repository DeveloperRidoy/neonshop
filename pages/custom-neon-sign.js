import Head from "next/head";
import CustomNeonBuilder from "../components/CustmNeonBuilder/CustomNeonBuilder"

const CustomNeonSign = () => {
    return (
      <div>
        <Head>
          <title>Custom Neon Sign | NeonSignCo</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <CustomNeonBuilder />
      </div>
    );
}

export default CustomNeonSign
