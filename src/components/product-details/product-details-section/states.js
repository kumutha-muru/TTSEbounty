export const initialState = {
  openModal: false,
  clearCartModal: false,
  modalData: [],
  isTransformed: false,
};
export const reducer = (state, action) => {
  const in_currentqty = state.modalData[0]?.quantity + 1;
  const de_currentqty = state.modalData[0]?.quantity - 1;
  const incrementpricefilter = state.modalData[0]?.wholesale_item_price?.filter(
    function (value) {
      const checkQuantity =
        in_currentqty >= value.min_qty && in_currentqty <= value.max_qty;
      if (checkQuantity) {
        return value;
      } else {
        return 0;
      }
    }
  )[0]?.price;
  const decrementpricefilter = state.modalData[0]?.wholesale_item_price?.filter(
    function (value) {
      const checkQuantity =
        de_currentqty >= value.min_qty && de_currentqty <= value.max_qty;
      if (checkQuantity) {
        return value;
      } else {
        return 0;
      }
    }
  )[0]?.price;

  const incrementSelectedOptionPrice =
    state.modalData[0]?.selectedOption?.length > 0
      ? state.modalData[0]?.selectedOption?.[0]?.price
      : state.modalData[0]?.price;

  const decrementSelectedOptionPrice = (state.modalData[0]?.selectedOption?.length > 0
    ? state.modalData[0]?.selectedOption?.[0]?.price
    : state.modalData[0]?.price);

  switch (action.type) {
    case "setOpenModal":
      return {
        ...state,
        openModal: action.payload,
      };
    case "setClearCartModal":
      return {
        ...state,
        clearCartModal: action.payload,
      };

    case "setModalData":
      return {
        ...state,
        modalData: [action.payload],
      };
    case "setIsTransformed":
      return {
        ...state,
        isTransformed: action.payload,
      };
    case "incrementQuantity":
      return {
        ...state,
        modalData: [
          {
            ...state.modalData[0],
            totalPrice:
              state.modalData[0]?.wholesale_item_price?.length > 0
                ? incrementpricefilter * (state.modalData[0].quantity + 1)
                : incrementSelectedOptionPrice * (state.modalData[0].quantity + 1),
            quantity: state.modalData[0].quantity + 1,
          },
        ],
      };
    case "decrementQuantity":
      return {
        ...state,
        modalData: [
          {
            ...state.modalData[0],
            totalPrice:
              state.modalData[0]?.wholesale_item_price?.length > 0
                ? decrementpricefilter * (state.modalData[0].quantity - 1)
                : decrementSelectedOptionPrice *
                  (state.modalData[0].quantity - 1),
            quantity: state.modalData[0].quantity - 1,
          },
        ],
      };
    default:
      return state;
  }
};
export const ACTION = {
  incrementQuantity: "incrementQuantity",
  decrementQuantity: "decrementQuantity",
  setModalData: "setModalData",
  setOpenModal: "setOpenModal",
  setClearCartModal: "setClearCartModal",
  setIsTransformed: "setIsTransformed",
};
