const e=window.localStorage.getItem("theme");if(null!==e)"dark"===e?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.setAttribute("data-theme","light");else{let e=t();document.documentElement.setAttribute("data-theme",e)}function t(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}window.declaredHandleTheme=function(m="none"){"none"===m?(document.documentElement.setAttribute("data-theme",t()),localStorage.removeItem(e)):(document.documentElement.setAttribute("data-theme",m),localStorage.setItem("theme",m))};
//# sourceMappingURL=index.ac4c966c.js.map
