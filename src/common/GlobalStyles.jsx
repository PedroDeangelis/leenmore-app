import { createGlobalStyle } from "styled-components";
import { COLOR } from "./variables.js";

const GlobalStyles = createGlobalStyle`
    * {
        font-family: inherit;
        color: inherit;
        padding: 0;
        margin: 0;
        font-size: inherit;
        box-sizing: border-box;

        &:focus {
            outline: none;
        }
    }

    body {
        overflow-x: hidden;
        padding: 0;
        margin: 0;
        font-size: 16px;
        color: ${COLOR.text};
        font-family: 'Jost', sans-serif;

    }

    h1{
        font-size: 28px;
    }

    .container{
        padding-left: 30px;
        padding-right: 30px;
    }

    //Material UI
    .MuiButtonBase-root{
        &.button-tall{
            padding-top: 12px;
            padding-bottom: 12px;
        }
    }

    //Responsive

    @media screen and (max-width: 768px) {
        
    .container{
        padding-left: 14px;
        padding-right: 14px;
    }
    }
`;

export default GlobalStyles;
