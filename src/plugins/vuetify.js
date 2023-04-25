// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";
import colors from 'vuetify/lib/util/colors'

export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.orange.lighten1,
          secondary: colors.cyan.lighten3,
          error: colors.orange.lighten3,
          grey: colors.grey.lighten2,
          warning: colors.yellow.lighten2,
          background: colors.grey.lighten5,
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: colors.orange.lighten1,
          secondary: colors.cyan.lighten3,
          error: colors.orange.lighten3,
          grey: colors.grey.lighten2,
          warning: colors.yellow.lighten2,
          background: colors.grey.darken4,
        }
      },
    },
  },
});
