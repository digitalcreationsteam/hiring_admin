const { colors } = require("./src/common/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        "primary-dark": colors.primaryDark,
        background: colors.background,
        sidebar: colors.sidebar,
        surface: colors.surface,
        border: colors.border,
        "text-primary": colors.textPrimary,
        "text-secondary": colors.textSecondary,
        success: colors.success,
        danger: colors.danger,
        warning: colors.warning,
      },
    },
  },
  plugins: [],
};
