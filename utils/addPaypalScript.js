const addPaypalScript = () => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`;
    script.type = 'text/javascript'; 
    script.async = true;
    document.body.appendChild(script);
}


export default addPaypalScript;