import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
  html,body,#root { height:100%; }
  body {
    font-family: 'Inter', sans-serif;
    background: #f4f6f9;
    margin:0;
  }
  /* reset inputs etc. */
`;
