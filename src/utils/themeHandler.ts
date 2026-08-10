import resolveConfig from "tailwindcss/resolveConfig";
import myConfig from "../../tailwind.config";

// want more ? just import whatever you want!
const colors = resolveConfig(myConfig).theme.colors;
const spacing = resolveConfig(myConfig).theme.spacing;

const themeHandler = {
  colors: colors,
  spacing: spacing,
};

export default themeHandler;
