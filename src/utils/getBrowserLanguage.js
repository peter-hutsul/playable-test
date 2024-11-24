export function getBrowserLanguage(short) {
  const getFirstBrowserLanguage = function () {
    const nav = window.navigator;
    const browserLanguagePropertyKeys = ["language", "browserLanguage", "systemLanguage", "userLanguage"];
    let language;

    if (Array.isArray(nav.languages)) {
      for (let i = 0; i < nav.languages.length; i++) {
        language = nav.languages[i];
        if (language && language.length) {
          return language;
        }
      }
    }

    for (let i = 0; i < browserLanguagePropertyKeys.length; i++) {
      language = nav[browserLanguagePropertyKeys[i]];
      if (language && language.length) {
        return language;
      }
    }

    return "null";
  };

  if (short) {
    return getFirstBrowserLanguage().slice(0, 2);
  } else {
    return getFirstBrowserLanguage();
  }
}
