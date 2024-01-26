export const DEV = process.env.NODE_ENV === "development";

export const API = {
  METHOD_LIST: DEV ? "PATCH" : "LIST",
  SEARCH: `${DEV && process.env.API_URL}/api/red/applications/item/search/?q=`,
  FAQ: `${DEV && process.env.API_URL}/api/red/faq/elements/`,
};

export function throttle(func, timeout) {
  let isTimer = false;

  return function () {
    if (isTimer) {
      return;
    }
    const timer = setTimeout(() => {
      func();
      isTimer = false;
      clearTimeout(timer);
    }, timeout);
    isTimer = true;
  };
}
