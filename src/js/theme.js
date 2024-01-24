const theme = window.localStorage.getItem("theme");

if (theme !== null) {
  storeUserSetPreference(theme);
} else {
  const mediaQueryPreference = getMediaQueryPreference();
  document.documentElement.setAttribute("data-theme", mediaQueryPreference);
}

function handleTheme(pref = "none") {
  if (pref === "none") {
    document.documentElement.setAttribute(
      "data-theme",
      getMediaQueryPreference()
    );
    localStorage.removeItem(theme);
  } else {
    document.documentElement.setAttribute("data-theme", pref);
    localStorage.setItem("theme", pref);
  }
}

const toggleLight = document.getElementById("btnLight");
toggleLight.addEventListener("click", () => {
  handleTheme("dark");
});

const toggleDark = document.getElementById("btnDark");
toggleDark.addEventListener("click", () => {
  handleTheme("light");
});

function storeUserSetPreference(pref) {
  pref === "dark"
    ? document.documentElement.setAttribute("data-theme", "dark")
    : document.documentElement.setAttribute("data-theme", "light");
}

function getMediaQueryPreference() {
  const mql = window.matchMedia(`(prefers-color-scheme: dark)`);
  return mql.matches ? "dark" : "light";
}
