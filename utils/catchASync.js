import { ERROR } from "../context/GlobalContext";

const catchASync = (fn, setState, cb) => {
    fn().catch(error => {
        console.log(error.stack); 
        setState((state) => ({
          ...state,
          alert: {
            ...state.alert,
            show: true,
            text:
              error.response?.data.message || error.message || "network error",
            type: ERROR,
            timeout: 5000,
          },
        }));

        if (cb) cb();
    })

    
}


export default catchASync;