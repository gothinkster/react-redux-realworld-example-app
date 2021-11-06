import React, { useContext } from 'react';
import Loader from "react-loader-spinner"
import LoadingContext from "../../context/loadingContext";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

const WithLoader = (WrappedComponent) => {
    return (props) => {
        const { loading } = useContext(LoadingContext);

        if (loading) {
            return <Loader
                type="ThreeDots"
                color="#5cb85c"
                height={50}
                width={50}
            />;
        }

        return <WrappedComponent {...props} loading={loading} />;
    }
};

export default WithLoader;
