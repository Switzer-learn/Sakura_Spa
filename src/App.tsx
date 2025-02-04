import React from "react";
import * as Components from './components';
import { Routes, Route, BrowserRouter } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route
            path="/"
            element={<Components.HomePage />}
          />
          <Route
            path="/Login"
            element={<Components.LoginPage staffLogin='false' />}
          />
          <Route
            path="/Register"
            element={<Components.CustomerRegistrationForm />}
          />
          <Route
            path="/Booking"
            element={<Components.CustomerOrderForm />}
          />
          <Route
            path="/employee"
            element={<Components.LoginPage staffLogin='true' />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
