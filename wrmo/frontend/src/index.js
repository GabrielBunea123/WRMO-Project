import App from './components/App'
import { render } from "react-dom";
import React from "react";
import { ThemeProvider } from '@mui/material/styles';


const appDiv = document.getElementById("app");
render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
    , appDiv);