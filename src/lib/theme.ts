export const THEME_STORAGE_KEY = "theme-preference";

export const THEME_INIT_SCRIPT = `(function(){try{var key=${JSON.stringify(THEME_STORAGE_KEY)};var savedTheme=localStorage.getItem(key);var theme=savedTheme==="dark"||savedTheme==="light"?savedTheme:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var root=document.documentElement;root.classList.toggle("dark",theme==="dark");root.style.colorScheme=theme;}catch(e){}})();`;
