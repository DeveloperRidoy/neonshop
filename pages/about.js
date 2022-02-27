import CustomLink from "../components/CustomLink";
import FollowSection from "../components/sections/FollowSection";
import NewsLetterSection from "../components/sections/NewsLetterSection";
import Head from 'next/head';

const About = () => {
    return (
      <div className=" pt-20">
        <Head>
          <title>About | NeonSignCo</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="max-w-4xl mx-auto px-5 lg:px-20">
          <h1 className="text-4xl sm:text-5xl text-center uppercase font-semibold">
            our story
          </h1>
          <div className="grid gap-10 text-lg  mt-20 text-center md:text-left">
            <p>
              NeonSignCo was started with a single goal in mind – create the
              best quality signs, ones we could be proud of. From simple
              concepts to extraordinary designs, we wanted to create something
              everyone would love. We developed an exclusive design that no
              other company offers at this time; our Social Media Icon Username
              style was created to benefit everyone. From small businesses, to
              online content creators, large corporate businesses and
              individuals, this design was made for you.
            </p>
            <p>
              As you may notice on our site we offer unique pre-made designs as
              well. Other sites offer the same basic “Good Vibes” designs. We
              are committed to being unique and offering designs that no other
              company is currently producing. We hope these designs are
              inspiring and loved by all of you. If you have any idea, or see
              any design anywhere else that you would like please let us know
              and we can get it for you! Also we guarantee our prices will be
              better.
            </p>
            <p>
              We are committed to our customers in every way. We enjoy creating
              designs and working with you to offer custom pieces you can be as
              satisfied with as we are proud of. If you have a logo and want to
              see it in a neon style design please send it to us.
            </p>
            <p>Thank you for your support, we appreciate all of you</p>
          </div>
          <img
            src="/img/about-us.png"
            alt="neon store story"
            className="mt-20 mx-auto"
          />
          <CustomLink
            href="/shop"
            text="shop now"
            className="max-w-max px-10 sm:px-20 py-4 flex items-center justify-center bg-black text-white uppercase mx-auto my-10  text-2xl"
          />
        </div>
        <NewsLetterSection />
        <FollowSection />
      </div>
    );
}

export default About
