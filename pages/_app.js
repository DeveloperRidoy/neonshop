import 'tailwindcss/tailwind.css'
import '../public/styles/global.style.css'
import Container from '../components/Container'
import GlobalContext from '../context/GlobalContext'

function MyApp ({ Component, pageProps }) {
  
  return (
    <GlobalContext props={pageProps}>
      <Container>
        <Component {...pageProps} />
      </Container>
    </GlobalContext> 
  );
}

export default MyApp