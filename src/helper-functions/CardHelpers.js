import { store } from "../redux/store";

export const getAmountWithSign = (amount) => {
  const stores = store?.getState();
  const { configData } = stores?.configData;
  let newAmount = ((amount * 100) / 100).toFixed(
    Number.parseInt(configData?.digit_after_decimal_point)
  );
  if (configData?.currency_symbol_direction === "left") {
    return `${configData?.currency_symbol}${newAmount}`;
  } else if (configData?.currency_symbol_direction === "right") {
    return `${newAmount}${configData?.currency_symbol}`;
  }
  return amount;
};

export const getDiscountedAmount = (
  price,
  discount,
  discountType,
  storeDiscount,
  quantity,
  wholesale_item_price
) => {
 /*  product wise discount */
  let q = quantity || 1;
  const pricefilter = wholesale_item_price?.filter(function (value) {
    if (q >= value.min_qty || q <= value.max_qty) {
      return value;
    } else {
      return 0;
    }
  })[0]?.price;
  let mainPrice = wholesale_item_price?.length > 0 ? pricefilter * q : price;
  /* let mainPrice = price; */
  if (Number.parseInt(storeDiscount) === 0) {
    if (discount > 0) {
      if (discountType === "amount") {
        mainPrice = price - discount * q;
      } else if (discountType === "percent") {
        mainPrice = price - (discount / 100) * price;
      }
    }
  } else {
    mainPrice = price - (storeDiscount / 100) * price;
  }
  return mainPrice;
};
export const getSelectedAddOn = (add_ons) => {
  let add_on = "";
  if (add_ons?.length > 0) {
    add_ons?.map((item, index) => {
      if (item?.isChecked) {
        add_on += `${index !== 0 ? ", " : ""}${item.name}`;
      }
    });
  }
  return add_on;
};

export const getDiscountAmount = (
  price,
  discount,
  discountType,
  storeDiscount,
  wholesale_item_price
) => {
  /* product wise discount */
  const pricefilter = wholesale_item_price?.filter(function (value) {
    if (q >= value.min_qty || q <= value.max_qty) {
      return value;
    } else {
      return 0;
    }
  })[0]?.price;
  let mainPrice = wholesale_item_price?.length > 0 ? pricefilter * q : price;
  if (Number.parseInt(storeDiscount) === 0) {
    if (discountType === "amount") {
      mainPrice = discount;
    } else if (discountType === "percent") {
      mainPrice = price * (discount / 100);
    }
  } else {
    if (discountType === "amount") {
      mainPrice = storeDiscount;
    } else if (discountType === "percent") {
      mainPrice = price * (storeDiscount / 100);
    }
  }
  return mainPrice;
};
