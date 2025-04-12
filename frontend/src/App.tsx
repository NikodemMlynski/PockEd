// App.tsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Notes from "./Notes"; // Your Notes component

// Create a new instance of QueryClient
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    // Wrap the entire app with QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <Notes />
    </QueryClientProvider>
  );
};

export default App;
