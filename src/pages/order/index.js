import React from "react";
import MainLayout from "../../src/components/layout/MainLayout";
import OrderSuccessPage from "../../src/components/order-success-page";
import CssBaseline from "@mui/material/CssBaseline";
import {getServerSideProps} from "../index";
import SEO from "../../components/seo";
import { getToken } from "../../helper-functions/getToken";

const index = ({configData}) => {
    const token = getToken();
    return (
        <>
            <CssBaseline/>
            <SEO
                title={configData ? `Order` : "Loading..."}
                image={`${configData?.base_urls?.business_logo_url}/${configData?.fav_icon}`}
                businessName={configData?.business_name}
            />
            <MainLayout configData={configData}>
            {!token && <OrderSuccessPage configData={configData}/>}
            </MainLayout>
        </>
    );
};

index.propTypes = {};

export default index;
export {getServerSideProps}
