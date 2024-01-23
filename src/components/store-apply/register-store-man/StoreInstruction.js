import { Typography } from "@mui/material";
import React from "react";
import { t } from "i18next";

const StoreInstruction = () => {
  return (
    <div>
      <Typography variant="h5" mb={2}>
        {t("Delivery services:")}
      </Typography>
      <Typography variant="body1" mb={2}>
        {t(
          "TTS emart fullfilled services: Orders to be delivered to customers by TTS emart delivery application only Hybrid: - Orders may be delivered to customers by TTS emart or by the Merchants using our delivery application. If the vendor has self managed delivery option then the vendor is responisble for delivering thier customer orders where as if the self managed delivery is not assigned the TTS emart is responisble for delivering thier vendors customer orders. The service shall be in accordance with the terms and conditions"
        )}
      </Typography>
      <Typography variant="h5" mb={2}>
        {t("Subscription fee:")}
      </Typography>
      <Typography variant="body1" mb={2}>
        {t(
          "In consideration of the services, the vendor hereby agrees to pay TTS emart based on the subscription plan as a registration fee for the mentioned time period. After that the vendor has to renew to continue the benefits of TTS emart. The subscription fee shall by payable by the vendor via CASH/CHEQUE (Drawn in the name of “Techmango Technology private limited”) or Bank transfer (Bank account details for bank are mentioned below) or online payment mode (card or netbanking). Either way the vendor can make subscription payments."
        )}
      </Typography>
      <Typography variant="h5" mb={2}>
        {t("Flat or category wise percentage plan:")}
      </Typography>
      <Typography variant="body1" mb={2}>
        {t(
          "Another option for the vendor to register by choosing either flat admin percentage or category wise admin percentage based on the orders placed by the vendor customer."
        )}
      </Typography>
      <Typography variant="h5" mb={2}>
        {t("Commission Percentage exclusive of Payment Gateway Fee:")}
      </Typography>
      <Typography variant="h5" mb={2}>
        {t("Payment Gateway Fee:")}
      </Typography>
      <Typography variant="body1" mb={2}>
        <span>
          {t("Vendor shall pay a payment gateway fee of 2% fixed cost per transaction respectively on the order value. The aforementioned fee is applicable for online paid order(s) only.")}
        </span>
      </Typography>
      <Typography variant="h5" mb={2}>
        {t("Payments Mechanism Offered to Process Customer Orders:")}
      </Typography>
      <Typography variant="body1" mb={2}>
        <ol>{t("1. Cash on Delivery")}</ol>
        <ol>
          {t("2. Electronic Payment Mechanism (Credit Card/debit Card/Net banking Transfer and / or e-wallets and")}
        </ol>
        <ol>
         {t("3. Redemption of vouchers and/or discount coupons (as applicable) provided by TTS eMart.")}
        </ol>
      </Typography>
      <Typography variant="h5" mb={2}>
        {t("Payment Settlement Process:")}
      </Typography>
      <Typography variant="body1" mb={2}>
        {t("Any order payment amount done by the customer will be directly transferred to the vendors merchant account and the respetive admin commission would be transferred to the TTS eMart's payment gateway merchant account immediately.Based on the delivery man assinged.")}
      </Typography>
    </div>
  );
};

export default StoreInstruction;
