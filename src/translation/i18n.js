import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          en: "Ar",
          Organiztion: "Organiztion  ",
          Personal: "Personal Information  ",
          phonenuberinfor: "phone number  ",
          Gender: "Gender   ",
        },
      },
      ar: {
        translation: {
          en: "En",
          Organiztion: "المنظمة",
          Personal: "معلومات شخصية ",
          Gender: "  الجنس ",

        },
      },
    },
  });

export default i18n;
