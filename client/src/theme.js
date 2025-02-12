// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff",
    10: "#f6f6f6",
    50: "#f0f0f0",
    100: "#e0e0e0", // main text color
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#2D2D2D", // main background
    900: "#141414",
    1000: "#000000",
  },
  primary: {
    // blue
    100: "#d3e5f7",
    200: "#a7cbef",
    300: "#7bb1e7",
    400: "#4F97E0",
    500: "#4A90E2", // main primary
    600: "#3b74b5",
    700: "#2c5788",
    800: "#1e3b5c",
    900: "#0f1e2e",
  },
  secondary: {
    // success green
    100: "#d5f5e3",
    200: "#abebc6",
    300: "#82e0aa",
    400: "#58d68d",
    500: "#2ECC71", // main success
    600: "#25a35a",
    700: "#1c7a44",
    800: "#13522d",
    900: "#092917",
  },
  error: {
    // error red
    100: "#f9d7d3",
    200: "#f3afa7",
    300: "#ed867b",
    400: "#e75e4f",
    500: "#E74C3C", // main error
    600: "#b93d30",
    700: "#8b2e24",
    800: "#5c1e18",
    900: "#2e0f0c",
  }
};

// function that reverses the color palette
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - 1 - i];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[500],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[500],
            },
            error: {
              ...tokensDark.error,
              main: tokensDark.error[500],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[800],
              alt: tokensDark.grey[700],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            error: {
              ...tokensLight.error,
              main: tokensDark.error[600],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
