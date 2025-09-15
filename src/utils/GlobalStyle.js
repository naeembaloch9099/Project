// src/styles/GlobalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  /* Reset & Base */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: #f9fafb;
    color: #111827;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  /* Reusable responsive helpers */
  @media (max-width: 1024px) {
    body {
      font-size: 15px;
    }
  }

  @media (max-width: 768px) {
    body {
      font-size: 14px;
      padding: 0 10px;
    }

    header {
      flex-direction: column;
      gap: 1rem;
    }

    .grid {
      grid-template-columns: 1fr; /* stacks all grid items */
    }
  }

  @media (max-width: 480px) {
    body {
      font-size: 13px;
    }

    h1, h2, h3 {
      font-size: 1.2rem;
    }
  }
`;

export default GlobalStyles;
