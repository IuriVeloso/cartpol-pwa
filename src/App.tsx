import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTheme, ThemeProvider, alpha} from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./pages/Home";
import Tool from "./pages/Tool";

import Header from "./components/Header";
import Footer from "./components/Footer";
import queryClient from "./api/index";

import "./styles.css";

declare module '@mui/material/styles' {
  interface Palette {
    black: Palette['primary'];
  }

  interface PaletteOptions {
    black?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    black: true;
  }
}

let theme = createTheme({
  // Theme customization goes here as usual, including tonalOffset and/or
  // contrastThreshold as the augmentColor() function relies on these
});

theme = createTheme(theme, {
  palette: {
    black: theme.palette.augmentColor({
      color: {
        main: '#0f0f0f',
        light: alpha('#0f0f0f', 0.5),
        dark: alpha('#0f0f0f', 0.9),
      },
      name: 'black',
    }),
    red: theme.palette.augmentColor({
      color: {
        main: '#FF4040',
        light: alpha('#FF4040', 0.5),
        dark: alpha('#FF4040', 0.9),
      },
      name: 'red',
    }),
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <div className="App base-background">
            <Header />
              <div className="base-box">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tool" element={<Tool />} />
                </Routes>
              </div>
            <Footer />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
