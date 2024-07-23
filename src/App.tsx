import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import PoliticalResults from "./components/political-results";
import queryClient from "./api/index"

function App() {
  return <QueryClientProvider client={queryClient}><PoliticalResults /></QueryClientProvider>;
}

export default App;
