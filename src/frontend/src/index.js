import React from "react";
import ReactDOM from "react-dom/client";
import { Dapp } from "./components/Dapp";
import  App  from './App';
import { WalletProvider } from './components/WalletContext';

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <WalletProvider>
    <App />
    </WalletProvider>
  </React.StrictMode>
);
