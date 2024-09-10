import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import queryClient from "./api/index";

import "./styles.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App base-background">
        <Header />
          <div className="base-box">
            <Home />
          </div>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
