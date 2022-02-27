import NewsLetterForm from "../NewsLetterForm";

const NewsLetterSection = () => {
    return (
      <section
        className="px-5 lg:px-20 py-20 bg-black text-white flex flex-col gap-5 items-center text-center "
        style={{
          background:
            "linear-gradient(rgba(0, 0, 0,0.9), rgba(0, 0, 0,0.9)), url('/img/neon-banner-3.jpg')",
        }}
      >
        <h3 className="text-3xl font-semibold uppercase">
          get exclusive benefits!
        </h3>
        <p>
          Become part of the <span className="font-semibold">NeonSignCo</span>{" "}
          family. You will be first in the know about new products and exclusive
          promotions. Enter your email below to join today!
        </p>
        <NewsLetterForm />
      </section>
    );
}

export default NewsLetterSection
