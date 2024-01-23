import moment from "moment";
import { currentDate, nextday, today } from "./formatedDays";
import { t } from "i18next";
import {
  getCurrentModuleId,
  getCurrentModuleType,
} from "../helper-functions/getCurrentModuleType";
import { getDiscountedAmount } from "../helper-functions/CardHelpers";

export const getNumberWithConvertedDecimalPoint = (
  amount,
  digitAfterDecimalPoint
) => {
  if (amount === 0) {
    return amount;
  } else {
    return ((amount * 100) / 100).toFixed(
      Number.parseInt(digitAfterDecimalPoint)
    );
  }
};
export const isAvailable = (start, end) => {
  const startTime = moment(start, "HH:mm:ss");
  const endTime = moment(end, "HH:mm:ss");
  let currentTime = moment();
  return moment(currentTime).isBetween(startTime, endTime);
};
export const handleTotalAmountWithAddons = (
  mainTotalAmount,
  selectedAddOns
) => {
  if (selectedAddOns?.length > 0) {
    let selectedAddonsTotalPrice = 0;
    selectedAddOns?.forEach(
      (item) => (selectedAddonsTotalPrice += item?.price * item?.quantity)
    );
    return mainTotalAmount + selectedAddonsTotalPrice;
  } else {
    return mainTotalAmount;
  }
};

export const getIndexFromArrayByComparision = (arrayOfObjects, object) => {
  return arrayOfObjects.findIndex(
    (item) =>
      _.isEqual(item.food_variations, object.food_variations) &&
      item.id === object.id
  );
};

export const calculateItemBasePrice = (item, selectedOptions) => {
  let basePrice = item?.price;
  if (selectedOptions.length > 0) {
    selectedOptions?.forEach((option) => {
      if (option.isSelected === true) {
        basePrice += Number.parseInt(option?.optionPrice);
      }
    });
  }
  return basePrice;
 /*  if(item) */
};
export const FormatedDateWithTime = (date) => {
  let dateString = moment(date).format("YYYY-MM-DD hh:mm a");
  return dateString;
};
export const onlyTimeFormat = (date) => {
  let timeString = moment(date, "YYYY-MM-DD hh:mm a").format("hh:mm");
  return timeString;
};

export const getDayNumber = (day) => {
  switch (day) {
    case "Sunday": {
      return 0;
    }
    case "Monday": {
      return 1;
    }
    case "Tuesday": {
      return 2;
    }
    case "Wednesday": {
      return 3;
    }
    case "Thursday": {
      return 4;
    }
    case "Friday": {
      return 5;
    }
    case "Saturday": {
      return 6;
    }
  }
};
const handleVariationValuesSum = (productVariations) => {
  let sum = 0;
  if (productVariations.length > 0) {
    productVariations?.forEach((pVal) => {
      pVal?.values?.forEach((cVal) => {
        if (cVal?.isSelected) {
          sum += Number.parseInt(cVal?.optionPrice);
        }
      });
    });
  }
  return sum;
};
const handleValuesSum = (productVariations) => {
  let sum = 0;
  if (productVariations.length > 0) {
    productVariations?.forEach((pVal) => (sum += Number.parseInt(pVal.price)));
  }
  return sum;
};

const withoutFoodModule = (product, productPrice) => {
  const pricefilter = product?.wholesale_item_price?.filter(function (value) {
    if (
      product?.quantity >= value.min_qty &&
      product?.quantity <= value.max_qty
    ) {
      return value;
    } else {
      return 0;
    }
  })[0]?.price;
  const commonPrice = () => {
    if (product?.variations?.length > 0) {
      if (product?.selectedOption?.length > 0) {
        productPrice = product?.selectedOption?.[0]?.price;
        return productPrice;
      }
    } else {
      productPrice = product.price;
      return productPrice;
    }
  };
  if (product?.wholesale_item_price?.length > 0) {
    productPrice = pricefilter * product.quantity;
    return productPrice;
  } else {
    return commonPrice();
  }
};

export const handleProductValueWithOutDiscount = (product) => {
  let productPrice = product?.price;

  if (getCurrentModuleType() === "food") {
    if (product?.food_variations?.length > 0) {
      productPrice += handleVariationValuesSum(product?.food_variations);
      return productPrice;
    } else {
      return productPrice;
    }
  } else {
    return withoutFoodModule(product, productPrice);
  }
};
export const selectedAddonsTotal = (addOns) => {
  if (addOns?.length > 0) {
    let vv = addOns?.reduce(
      (total, addOn) => addOn.price * addOn.quantity + total,
      0
    );

    return vv;
  } else {
    return 0;
  }
};
const handleValueWithOutDiscount = (product) => {
  let productPrice = product.price;
  if (product.selectedOption.length > 0) {
    productPrice = handleValuesSum(product.selectedOption);
    return productPrice;
  } else {
    return productPrice;
  }
};
const handlePurchasedAmount = (cartList) => {
  if (getCurrentModuleType() === "food") {
    return cartList.reduce(
      (total, product) =>
        (product.food_variations.length > 0
          ? handleProductValueWithOutDiscount(product)
          : product.price) *
          product.quantity +
        selectedAddonsTotal(product.selectedAddons) +
        total,
      0
    );
  } else {
    return cartList.reduce(
      (total, product) =>
        (product?.selectedOption?.length > 0
          ? handleValueWithOutDiscount(product)
          : product.price) *
          product.quantity +
        total,
      0
    );
  }
};
const couponCalculation=(couponDiscount,purchasedAmount,storeData, cartList)=>{
  const percentCalculation = () =>{
    if (percentageWiseDis >= couponDiscount.max_discount) {
      return couponDiscount.max_discount;
    } else {
      return percentageWiseDis;
    }
  }
  if (couponDiscount && couponDiscount?.discount_type === "amount") {
    if (couponDiscount?.max_discount === 0) {
      return couponDiscount?.discount;
    } else {
      return couponDiscount.discount;
    }
  } else {
    let percentageWiseDis =
      (purchasedAmount - getProductDiscount(cartList, storeData)) *
      (couponDiscount.discount / 100);
    if (couponDiscount.max_discount === 0) {
      return percentageWiseDis;
    } else {
      return percentCalculation();
    }
  }
}
export const getCouponDiscount = (couponDiscount, storeData, cartList) => {
    let purchasedAmount = handlePurchasedAmount(cartList);
    if (couponDiscount && purchasedAmount >= couponDiscount.min_purchase) {
      let zoneId = JSON.parse(couponDiscount.data);
      let storeId = JSON.parse(couponDiscount.data);
      switch (couponDiscount.coupon_type) {
        case "zone_wise":
          if (
            Number.parseInt(zoneId[0]) ===
            Number.parseInt(couponDiscount.zoneId[0])
          ) {
           return couponCalculation(couponDiscount,purchasedAmount,storeData, cartList);
          } else {
            return 0;
          }
        case "store_wise":
          if (Number.parseInt(storeId[0]) === storeData?.id) {
            return couponCalculation(couponDiscount,purchasedAmount,storeData, cartList);
          } else {
            return 0;
          }
        case "first_order":
          return couponCalculation(couponDiscount,purchasedAmount,storeData, cartList);
        case "free_delivery":
          return 0;
        case "default":
          return couponCalculation(couponDiscount,purchasedAmount,storeData, cartList);
      }
    } else {
      return 0;
    }
};

export const getTaxableTotalPrice = (items, couponDiscount, storeData,global) => {
  let tax = storeData?.tax || 0;
  let total =
    handlePurchasedAmount(items) -
    getProductDiscount(items, storeData) -
    (couponDiscount ? getCouponDiscount(couponDiscount, storeData, items) : 0);
    if (global?.tax_included === 1) {
  /* if (store?.getState?.()?.configData?.configData?.tax_included === 1) { */
    return (total * tax) / (100 + tax);
  } else {
    return (total * tax) / 100;
  }
};
/* export const getTaxableTotalPrice = (items, couponDiscount, storeData) => {
  const isTaxIncluded = store?.getState?.()?.configData?.tax_included === 1;
  let tax = storeData?.data?.tax;
  let total =
    items.reduce(
      (total, product) =>
        (product.variations.length > 0
          ? handleProductValueWithOutDiscount(product)
          : product.price) *
          product.quantity +
        selectedAddonsTotal(product.selectedAddons) +
        total,
      0
    ) -
    getProductDiscount(items, storeData) -
    (couponDiscount ? getCouponDiscount(couponDiscount, storeData, items) : 0);

  if (isTaxIncluded) {
    return (total * tax) / (100 + tax);
  } else {
    return (total * tax) / 100;
  }
}; */
const handleTotalDiscountBasedOnModules = (
  items,
  restaurentDiscount,
  resDisType
) => {
  if (getCurrentModuleType() === "food") {
    return items.reduce(
      (total, product) =>
        (product.food_variations.length > 0
          ? handleProductValueWithOutDiscount(product) -
            getConvertDiscount(
              restaurentDiscount,
              resDisType,
              handleProductValueWithOutDiscount(product),
              product.store_discount
            )
          : product.price -
            getConvertDiscount(
              restaurentDiscount,
              resDisType,
              product.price,
              product.store_discount
            )) *
          product.quantity +
        total,
      0
    );
  } else {
    return items.reduce(
      (total, product) =>
        (product?.selectedOption?.length > 0
          ? handleValueWithOutDiscount(product) -
            getConvertDiscount(
              restaurentDiscount,
              resDisType,
              handleValueWithOutDiscount(product),
              product.store_discount
            )
          : product.price -
            getConvertDiscount(
              restaurentDiscount,
              resDisType,
              product.price,
              product.store_discount
            )) *
          product.quantity +
        total,
      0
    );
  }
};

const handleProductWiseDiscount = (items) => {
  let totalDiscount = 0;
  items?.forEach((item) => {
    if (item.discount > 0) {
      if (item.discount_type === "amount") {
        totalDiscount += item?.discount * item.quantity;
      } else {
        let a =
          handleProductValueWithOutDiscount(item) -
          getConvertDiscount(
            item.discount,
            item.discount_type,
            handleProductValueWithOutDiscount(item),
            item.store_discount
          );
        totalDiscount += a * item.quantity;
      }
    } else {
      totalDiscount += item.discount;
    }
  });
  return totalDiscount;
};
const shopWiseDiscount = (items, storeData) =>{
  let restaurentDiscount = storeData?.discount?.discount;
  let resDisType = storeData?.discount?.discount_type;
  let restaurentMinimumPurchase = storeData?.discount?.min_purchase;
  let restaurentMaxDiscount = storeData?.discount?.max_discount;
  let totalDiscount = handleTotalDiscountBasedOnModules(
    items,
    restaurentDiscount,
    resDisType
  );

  let purchasedAmount = items.reduce(
    (total, product) =>
      ((product?.food_variations.length > 0
        ? handleProductValueWithOutDiscount(product)
        : product?.price) +
        (product?.selectedAddons?.length > 0
          ? product?.selectedAddons?.reduce(
              (total, addOn) => addOn.price * addOn.quantity + total,
              0
            )
          : 0)) *
        product.quantity +
      total,
    0
  );
  if (purchasedAmount >= restaurentMinimumPurchase) {
    if (totalDiscount >= restaurentMaxDiscount) {
      return restaurentMaxDiscount;
    } else {
      return totalDiscount;
    }
  } else {
    return 0;
  }
}
export const getProductDiscount = (items, storeData) => {
 
  if (storeData?.discount) {
    let endDate = storeData?.discount?.end_date;
    let endTime = storeData?.discount?.end_time;
    let combinedEndDateTime = moment(
      `${endDate} ${endTime}`,
      "YYYY-MM-DD HH:mm:ss"
    ).format();
    let currentDateTime = moment().format();
    if (combinedEndDateTime > currentDateTime) {
      /* shop wise discount */
     return shopWiseDiscount(items, storeData);
    } else {
      /* product wise discount */
      return handleProductWiseDiscount(items);
    }
  } else {
    /* product wise discount */
    return handleProductWiseDiscount(items);
  }
};
export const getConvertDiscount = (dis, disType, price, restaurantDiscount) => {
  if (restaurantDiscount === 0) {
    if (dis !== 0) {
      if (disType === "amount") {
        price = price - dis;
      } else if (disType === "percent") {
        price = price - (dis / 100) * price;
      }
    }
    return price;
  } else {
    return price - (price * restaurantDiscount) / 100;
  }
};
export const getFinalTotalPrice = (
  items,
  couponDiscount,
  taxAmount,
  storeData
) => {
  let totalPrice = 0;
  const pricefilter = items?.wholesale_item_price?.filter(function (value) {
    if (items.quantity >= value.min_qty && items.quantity <= value.max_qty) {
      return value;
    } else {
      return 0;
    }
  })[0]?.price;
  if (items?.length > 0) {
    items.map((item) => {
      item.wholesale_item_price
        ? (totalPrice +=
            pricefilter * item.quantity -
            getProductDiscount(items, storeData) +
            taxAmount)
        : (totalPrice +=
            item.price * item.quantity -
            getProductDiscount(items, storeData) +
            taxAmount);
    });
    if (couponDiscount?.discount)
      return totalPrice - getCouponDiscount(couponDiscount, storeData, items);
    return totalPrice;
  }
  return totalPrice;
};
export const currentTime = moment(currentDate).format("HH:mm");

const schedulelistCalculation = (start, end, close, list, day, date,checkedEnd) => {
  let label = "";
  if (
    currentTime > moment(start).format("HH:mm") &&
    currentTime < moment(end).format("HH:mm")
  ) {
    label = t("Now");
  } else {
    label = `${moment(start).format("HH:mm")} - ${moment(checkedEnd).format(
      "HH:mm"
    )}`;
  }
  if (
    (currentTime < moment(end).format("HH:mm") &&
      getDayNumber(today) === day) ||
    (currentTime > moment(end).format("HH:mm") && getDayNumber(today) !== day)
  ) {
    list.push({
      label: label,
      start: moment(start).format("HH:mm"),
      end:
        moment(checkedEnd).format("HH:mm") === moment(close).format("HH:mm")
          ? moment(checkedEnd).format("HH:mm")
          : moment(end).format("HH:mm"),
      value:
        moment(checkedEnd).format("HH:mm") === moment(close).format("HH:mm")
          ? `${date} ${moment(checkedEnd).format("HH:mm")}`
          : `${date} ${moment(end).format("HH:mm")}`,
    });
  }
};
function recursive(start, end, close, list, schedule_order_slot_duration, day) {
  const checkedEnd = moment(end, "HH:mm").subtract(1, "minutes");
  const date =
    getDayNumber(today) === day
      ? moment(currentDate).format("yyyy-MM-DD")
      : nextday;
  if (
    end.isBefore(close) ||
    moment(end).format("HH:mm") === moment(close).format("HH:mm") ||
    moment(checkedEnd).format("HH:mm") === moment(close).format("HH:mm")
  ) {
    schedulelistCalculation(start, end, close, list, day, date,checkedEnd);
    recursive(
      end,
      moment(end, "HH:mm").add(schedule_order_slot_duration, "minutes"),
      close,
      list,
      schedule_order_slot_duration,
      day
    );
  } else {
    return list;
  }
}

export const getAllSchedule = (
  day,
  schedules,
  schedule_order_slot_duration
) => {
  let list = [];
  if (schedules && schedules.length > 0) {
    const days = schedules.filter((s) => s.day === day);
    for (const element of days) {
      let close = moment(element.closing_time, "HH:mm");
      let start = moment(element.opening_time, "HH:mm");
      let end = moment(start, "HH:mm").add(
        schedule_order_slot_duration,
        "minutes"
      );
      recursive(start, end, close, list, schedule_order_slot_duration, day);
    }
  }
  return list;
};

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function radians(degrees) {
  return degrees * (Math.PI / 180);
}

const degrees = (doubleRadiance) => {
  return doubleRadiance * (180 / Math.PI);
};
const toRadians = (degree) => {
  return (degree * Math.PI) / 180;
};

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  const earthRadius = 6378137.0;
  const startLatitude = lat1;
  const endLatitude = lat2;
  const startLongitude = lon1;
  const endLongitude = lon2;
  const dLat = toRadians(endLatitude - startLatitude);
  const dLon = toRadians(endLongitude - startLongitude);

  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLon / 2), 2) *
      Math.cos(toRadians(startLatitude)) *
      Math.cos(toRadians(endLatitude));
  const c = 2 * Math.asin(Math.sqrt(a));

  return earthRadius * c;
  /* var startLongitudeRadians = radians(lon1);
  var startLatitudeRadians = radians(lat1);
  var endLongitudeRadians = radians(lon2);
  var endLatitudeRadians = radians(lat2);
  
  var y =
    Math.sin(endLongitudeRadians - startLongitudeRadians) *
    Math.cos(endLatitudeRadians);
  var x =
    Math.cos(startLatitudeRadians) * Math.sin(endLatitudeRadians) -
    Math.sin(startLatitudeRadians) *
      Math.cos(endLatitudeRadians) *
      Math.cos(endLongitudeRadians - startLongitudeRadians);
  
  return degrees(Math.atan2(y, x));

  const earthRadiusKm = 6371;
  let dLat = degreesToRadians(lat2 - lat1);
  let dLon = degreesToRadians(lon2 - lon1);
  
  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);
  
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c; */
}

export const handleDistance = (distance, origin, destination) => {
  if (distance?.[0]?.distance?.value) {
    return distance?.[0]?.distance?.value / 1000;
  } else if (distance?.[0]?.status === "ZERO_RESULTS") {
    return (
      distanceInKmBetweenEarthCoordinates(
        origin?.latitude || origin?.lat,
        origin?.longitude || origin?.lng,
        destination?.lat || destination?.latitude,
        destination?.lng || destination?.longitude
      ) / 1000
    );
  } else {
    return 0;
  }
};
export const cartItemsTotalAmount = (cartList) => {
  let totalAmount = 0;
  if (cartList?.length > 0) {
    cartList?.forEach((item) => {
      totalAmount += handleTotalAmountWithAddons(
        getDiscountedAmount(
          item?.totalPrice,
          item?.discount,
          item?.discount_type,
          item?.store_discount,
          item?.quantity,
          item?.wholesale_item_price
        ),
        item?.selectedAddons
      );
    });
  }
  return totalAmount;
};

/* const handleGlobalDeliveryFee = (
  configData,
  totalOrderAmount,
  orderType,
  deliveryFee
) => {
  if (
    (configData?.free_delivery_over !== null &&
      configData?.free_delivery_over > 0 &&
      totalOrderAmount > configData?.free_delivery_over) ||
    orderType === "take_away"
  ) {
    return 0;
  } else {
    if (configData?.minimum_shipping_charge >= deliveryFee) {
      return configData?.minimum_shipping_charge;
    } else {
      return deliveryFee;
    }
  }
}; */
export const getInfoFromZoneData = (zoneData) => {
  let chargeInfo;
  if (zoneData?.data?.zone_data?.length > 0) {
    zoneData?.data?.zone_data?.forEach((item, index) => {
      if (item?.modules?.length > 0) {
        item?.modules?.forEach((moduleItem) => {
          if (
            moduleItem?.module_type === getCurrentModuleType() &&
            moduleItem?.id === getCurrentModuleId()
          ) {
            chargeInfo = {
              ...moduleItem,
              increased_delivery_fee_status:
                item?.increased_delivery_fee_status,
              increased_delivery_fee: item?.increased_delivery_fee,
            };
          }
        });
      }
    });
  }
  return chargeInfo;
};

const getDeliveryFeeByBadWeather = (
  charge,
  increasedDeliveryFee,
  increasedDeliveryFeeStatus
) => {
  const totalCharge = charge;
  if (increasedDeliveryFeeStatus === 1) {
    return totalCharge + totalCharge * (increasedDeliveryFee / 100);
  } else {
    return totalCharge;
  }
};
/* export const getDeliveryFees = (
  storeData,
  configData,
  cartList,
  distance,
  couponDiscount,
  couponType,
  orderType,
  zoneData,
  origin,
  destination,
  extraCharge,
  vehicleData
) => {
if(extraCharge === undefined){
  extraCharge = 0
}
  if (orderType === "delivery" || orderType === "schedule_order") {
    //convert m to km
    let convertedDistance = handleDistance(
      distance?.rows?.[0]?.elements,
      origin,
      destination
    );
    let deliveryFee = convertedDistance * configData?.per_km_shipping_charge;
    let totalOrderAmount = cartItemsTotalAmount(cartList);
    const chargeInfo = getInfoFromZoneData(zoneData);
    //Admin settings
    if (configData?.per_km_shipping_charge) {
      //Admin config
      if (vehicleData?.delivery_charge_per_km) {
        deliveryFee =
          convertedDistance * (vehicleData?.delivery_charge_per_km || 0);
        console.log(deliveryFee, "768");
        if (deliveryFee < vehicleData?.minimum_delivery_charge) {
          deliveryFee = getDeliveryFeeByBadWeather(
            vehicleData?.minimum_delivery_charge + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
          console.log(deliveryFee, "771");
        }
      } else {
        deliveryFee =
          convertedDistance * (configData?.per_km_shipping_charge || 0);
        console.log(deliveryFee, "deliveryFee-basic");
        if (deliveryFee < configData?.minimum_delivery_charge) {
          deliveryFee = getDeliveryFeeByBadWeather(
            configData?.minimum_delivery_charge + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
          console.log(deliveryFee, "782");
        } else {
          deliveryFee = getDeliveryFeeByBadWeather(
            deliveryFee + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
          console.log(deliveryFee, "790");
        }
      }
      console.log(deliveryFee, "check");
    }
    //Zone
    else if (zoneData?.data?.zone_data?.length > 0) {
      if (
        chargeInfo?.pivot?.per_km_shipping_charge !== null &&
        chargeInfo?.pivot?.per_km_shipping_charge >= 0
      ) {
        deliveryFee =
          convertedDistance * (chargeInfo?.pivot?.per_km_shipping_charge || 0);
        if (deliveryFee <= chargeInfo?.pivot?.minimum_shipping_charge) {
          deliveryFee = getDeliveryFeeByBadWeather(
            chargeInfo?.pivot?.minimum_shipping_charge + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
          console.log(deliveryFee, "822");
        } else if (
          deliveryFee >= chargeInfo?.pivot?.maximum_shipping_charge &&
          chargeInfo?.pivot?.maximum_shipping_charge !== null
        ) {
          deliveryFee = getDeliveryFeeByBadWeather(
            chargeInfo?.pivot?.maximum_shipping_charge + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
          console.log(deliveryFee, "832");
        } else {
          deliveryFee = getDeliveryFeeByBadWeather(
            deliveryFee + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
        }
      }
    }

    //store
    if (Number.parseInt(storeData?.self_delivery_system) === 1) {
      if (vehicleData?.delivery_charge_per_km) {
        deliveryFee =
          convertedDistance * vehicleData?.delivery_charge_per_km || 0;
        if (deliveryFee < vehicleData?.minimum_delivery_charge) {
          deliveryFee = getDeliveryFeeByBadWeather(
            vehicleData?.minimum_delivery_charge + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
          console.log(deliveryFee, "854");
        } else if (
          storeData?.maximum_shipping_charge !== null &&
          deliveryFee > storeData?.maximum_shipping_charge
        ) {
          deliveryFee = getDeliveryFeeByBadWeather(
            storeData?.maximum_shipping_charge + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
          console.log(deliveryFee, "864");
        } else {
          deliveryFee = getDeliveryFeeByBadWeather(
            deliveryFee + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
        }
      } else {
        deliveryFee =
          convertedDistance * storeData?.per_km_shipping_charge || 0;
        if (deliveryFee < storeData?.minimum_shipping_charge) {
          deliveryFee = getDeliveryFeeByBadWeather(
            storeData?.minimum_shipping_charge + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
          console.log(deliveryFee, "881");
        } else if (
          storeData?.maximum_shipping_charge !== null &&
          deliveryFee > storeData?.maximum_shipping_charge
        ) {
          deliveryFee = getDeliveryFeeByBadWeather(
            storeData?.maximum_shipping_charge + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
          console.log(deliveryFee, "891");
        } else {
          deliveryFee = getDeliveryFeeByBadWeather(
            deliveryFee + extraCharge,
            chargeInfo?.increased_delivery_fee,
            chargeInfo?.increased_delivery_fee_status
          );
          console.log(deliveryFee,"899")
        }
      }
      if (storeData?.free_delivery) {
        deliveryFee = 0;
        console.log(deliveryFee,"903")
      }
      if (
        configData?.free_delivery_over !== null &&
        configData?.free_delivery_over <= totalOrderAmount
      ) {
        deliveryFee = 0;
        console.log(deliveryFee,"909")
      }
      // return deliveryFee;
    }
    console.log(deliveryFee,"finalfee")
    return deliveryFee;
  } else {
    console.log(deliveryFee,"take")
    return 0;
  }
};
 */
export const getDeliveryFees = (
  storeData,
  configData,
  cartList,
  distance,
  couponDiscount,
  couponType,
  orderType,
  zoneData,
  origin,
  destination,
  extraCharge,
  vehicleData
) => {
 
  let convertedDistance = handleDistance(
    distance?.rows?.[0]?.elements,
    origin,
    destination
  );
  let deliveryFee = convertedDistance * (configData?.per_km_shipping_charge || 0);
  if (orderType === "delivery" || orderType === "schedule_order") {
    //convert m to km
   
    let totalOrderAmount = cartItemsTotalAmount(cartList);
    const chargeInfo = getInfoFromZoneData(zoneData);
     //store
     if (Number.parseInt(storeData?.self_delivery_system) === 1) {
       if (vehicleData?.delivery_charge_per_km) {
         deliveryFee =
           convertedDistance * vehicleData?.delivery_charge_per_km || 0;
         console.log(deliveryFee, "Store Config - vehicleData  ");
         if (deliveryFee < vehicleData?.minimum_delivery_charge) {
           deliveryFee = vehicleData?.minimum_delivery_charge;
           console.log(
             deliveryFee,
             "Store Config - VehicleData - minimum_delivery_charge"
           );
         }
       } else {
         deliveryFee =
           convertedDistance * storeData?.per_km_shipping_charge || 0;
         console.log(deliveryFee, "Store Config - Store Data ");
         if (deliveryFee < storeData?.minimum_shipping_charge) {
           deliveryFee = storeData?.minimum_shipping_charge;
           console.log(
             deliveryFee,
             "Store Config - Store Data - minimum_shipping_charge"
           );
         } else if (deliveryFee > storeData?.maximum_shipping_charge) {
           deliveryFee = storeData?.maximum_shipping_charge;
           console.log(
             deliveryFee,
             "Store Config - Store Data - maximum_shipping_charge"
           );
         }
       }
       if (storeData?.free_delivery) {
         deliveryFee = 0;
         console.log(deliveryFee, "store-free delivery");
       }
     }
     //Zone
     else if (zoneData?.data?.zone_data?.length > 0) {
       if (
         chargeInfo?.pivot?.per_km_shipping_charge !== null &&
         chargeInfo?.pivot?.per_km_shipping_charge >= 0
       ) {
         deliveryFee =
           convertedDistance * (chargeInfo?.pivot?.per_km_shipping_charge || 0);
         console.log(deliveryFee, "Zone Config - Charge Info ");
         if (deliveryFee <= chargeInfo?.pivot?.minimum_shipping_charge) {
           deliveryFee = chargeInfo?.pivot?.minimum_shipping_charge;
           console.log(
             deliveryFee,
             "Zone Config - Charge Info - minimum_shipping_charge "
           );
         } else if (
           deliveryFee >= chargeInfo?.pivot?.maximum_shipping_charge &&
           chargeInfo?.pivot?.maximum_shipping_charge !== null
         ) {
           deliveryFee = chargeInfo?.pivot?.maximum_shipping_charge;
           console.log(
             deliveryFee,
             "Zone Config - Charge Info - maximum_shipping_charge "
           );
         }
       }
     }

     //Admin settings
     else if (configData?.per_km_shipping_charge) {
       //Admin config
       if (vehicleData?.delivery_charge_per_km) {
         deliveryFee =
           convertedDistance * (vehicleData?.delivery_charge_per_km || 0);
         console.log(deliveryFee, "Admin Config - Vehicle data");
         if (deliveryFee < vehicleData?.minimum_delivery_charge) {
           deliveryFee = vehicleData?.minimum_delivery_charge;
           console.log(
             deliveryFee,
             "Admin Config - Vehicle - minimum_delivery_charge"
           );
         }
       } else {
         deliveryFee =
           convertedDistance * (configData?.per_km_shipping_charge || 0);
         console.log(deliveryFee, "Admin Config - Config Data");
         if (deliveryFee < configData?.minimum_delivery_charge) {
           deliveryFee = configData?.minimum_delivery_charge;
           console.log(
             deliveryFee,
             "Admin Config - Config Data - minimum_delivery_charge"
           );
         }
       }
       console.log(deliveryFee, "check");
     }
  
    if (
      configData?.free_delivery_over !== null &&
      configData?.free_delivery_over <= totalOrderAmount && deliveryFee > 0
    ) {
      deliveryFee = 0;
      console.log(deliveryFee, "admin-free delivery");
    }
    if (deliveryFee > 0) {
      deliveryFee = getDeliveryFeeByBadWeather(
        deliveryFee + extraCharge,
        chargeInfo?.increased_delivery_fee,
        chargeInfo?.increased_delivery_fee_status
      );
    }
  } else {
    let deliveryFee = 0;
    console.log(deliveryFee, "take away");
  }
  return deliveryFee;
};
export const getItemTotalWithoutDiscount = (item) => {
  return item?.price + handleVariationValuesSum(item.food_variations);
};

export const getSubTotalPrice = (cartList) => {
  const pricefilter = cartList[0]?.wholesale_item_price?.filter(function (
    value
  ) {
    if (
      cartList[0]?.quantity >= value.min_qty &&
      cartList[0]?.quantity <= value.max_qty
    ) {
      return value;
    } else {
      return 0;
    }
  })[0]?.price;
  const selectedOptionPrice = (product) => {
    if (product?.selectedOption?.length > 0) {
      return product?.selectedOption?.[0]?.price;
    } else {
      return product.price;
    }
  };
  if (getCurrentModuleType() === "food") {
    return cartList.reduce(
      (total, product) =>
        (product?.food_variations.length > 0
          ? getItemTotalWithoutDiscount(product)
          : product.price) *
          product.quantity +
        selectedAddonsTotal(product.selectedAddons) +
        total,
      0
    );
  } else {
    return cartList.reduce(
      (total, product) =>
        product?.wholesale_item_price?.length > 0
          ? pricefilter * product.quantity + total
          : selectedOptionPrice(product) * product.quantity + total,
      0
    );
  }
};

const handleTaxIncludeExclude = (cartList, couponDiscount, storeData,global) => {
  /* const stores = store?.getState(); */
  const configData = global;
  if (configData && configData?.tax_included === 0) {
    return getTaxableTotalPrice(cartList, couponDiscount, storeData,global);
  } else {
    return 0;
  }
};

export const getCalculatedTotal = (
  cartList,
  couponDiscount,
  storeData,
  global,
  distanceData,
  couponType,
  orderType,
  freeDelivery,
  deliveryTip,
  zoneData,
  origin,
  destination,
  extraCharge,
  additionalCharge,
  vehicleData
) => {
  if (couponDiscount) {
    if (couponDiscount?.coupon_type === "free_delivery") {
      return (
        getSubTotalPrice(cartList) -
        getProductDiscount(cartList, storeData) +
        handleTaxIncludeExclude(cartList, couponDiscount, storeData,global) -
        (couponDiscount
          ? getCouponDiscount(couponDiscount, storeData, cartList)
          : 0)
      );
    } else {
      return (
        getSubTotalPrice(cartList) -
        getProductDiscount(cartList, storeData) +
        handleTaxIncludeExclude(cartList, couponDiscount, storeData,global) -
        (couponDiscount
          ? getCouponDiscount(couponDiscount, storeData, cartList)
          : 0) +
        getDeliveryFees(
          storeData,
          global,
          cartList,
          distanceData?.data,
          couponDiscount,
          couponType,
          orderType,
          zoneData,
          origin,
          destination,
          extraCharge,
          vehicleData
        ) +
        deliveryTip +
        additionalCharge
      );
    }
  } else {
    return (
      getSubTotalPrice(cartList) -
      getProductDiscount(cartList, storeData) +
      handleTaxIncludeExclude(cartList, couponDiscount, storeData,global) -
      0 +
      getDeliveryFees(
        storeData,
        global,
        cartList,
        distanceData?.data,
        couponDiscount,
        couponType,
        orderType,
        zoneData,
        origin,
        destination,
        extraCharge,
        vehicleData
      ) +
      deliveryTip +
      additionalCharge
    );
  }
};

export const isFoodAvailableBySchedule = (cart, selectedTime) => {
  if (selectedTime === "now") {
    let currentTime = moment();
    if (cart.length > 0) {
      let isAvailable = cart.every((item) => {
        const startTime = moment(item.available_time_starts, "HH:mm:ss");
        const endTime = moment(item.available_time_ends, "HH:mm:ss");
        return moment(currentTime).isBetween(startTime, endTime);
      });
      return !!isAvailable;
    }
  } else {
    if (selectedTime) {
      /* const slug = selectedTime.split(" ").pop(); */
      if (cart.length > 0) {
        const isAvailable = cart.every((item) => {
          const startTime = moment(item.available_time_starts, "HH:mm:ss");
          const endTime = moment(item.available_time_ends, "HH:mm:ss");
          const currentTime = moment(selectedTime, "HH:mm:ss");
          return moment(currentTime).isBetween(startTime, endTime);
        });
        return !!isAvailable;
      }
    }
  }
};

export const getVariation = (variations) => {
  let variation = "";
  if (variations?.length > 0) {
    variations.map((item, index) => {
    /*   if (index > 1) variation += `-${item.value}`
      variation += item.value */
      variation += `${index !== 0 ? "-" : ""}${item.value.type}`;
    });
  }
  return variation;
};

export const getTotalVariationsPrice = (variations) => {
  let value = 0;
  if (variations?.length > 0) {
    variations?.forEach?.((item) => {
      if (item?.values?.length > 0) {
        item?.values?.forEach((itemVal) => {
          if (itemVal?.isSelected) {
            value += Number.parseInt(itemVal?.optionPrice);
          }
        });
      }
    });
  }
  return value;
};

export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const cartItemTotalDiscount = (cartList) => {
  let totalDiscount = 0;
  if (cartList?.length > 0) {
    cartList?.forEach((item) => {
      totalDiscount += getCartTotalDiscount(
        item?.totalPrice,
        item?.discount,
        item?.discount_type,
        item?.store_discount,
        item?.quantity,
        item?.wholesale_item_price
      );
    });
  }
  return totalDiscount;
};

export const getCartTotalDiscount = (
  price,
  discount,
  discountType,
  storeDiscount,
  quantity,
  wholesale_item_price
) => {
  let discountTotal = 0;
  let q = quantity || 1;
  if (Number.parseInt(storeDiscount) === 0) {
    if (discountType === "amount") {
      discountTotal = discount * q;
    } else if (discountType === "percent") {
      discountTotal = (discount / 100) * price;
    }
  } else {
    discountTotal = (storeDiscount / 100) * price;
  }
  return discountTotal;
};

// Sort products by high to low value
export const getHighToLow = (data) => {
  if (data?.length > 0) {
    return data.sort((a, b) => b.price - a.price);
  }
};
// Sort products by low to high value
const getLowToHigh = (data) => {
  if (data?.length > 0) {
    return data.sort((a, b) => a.price - b.price);
  }
};

export const removeDuplicates = (array, property) => {
  const uniqueValues = {};
  return array.filter((item) => {
    if (!uniqueValues[item[property]]) {
      uniqueValues[item[property]] = true;
      return true;
    }
    return false;
  });
};
