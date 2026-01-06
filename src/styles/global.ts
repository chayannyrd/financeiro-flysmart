import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Inter', Arial, sans-serif;
    background: #1f3b5b;
    color: #e6edf3;

    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  h2 {
    margin-bottom: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .container {
    background: #161b22;
    padding: 2.5rem 3rem;
    border-radius: 14px;
    min-width: 360px;

    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.6),
      inset 0 0 0 1px rgba(255, 255, 255, 0.04);

    text-align: center;
  }

  input[type="file"] {
    width: 100%;
    margin-bottom: 1.8rem;
    color: #c9d1d9;
  }

  input[type="file"]::-webkit-file-upload-button {
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 6px 12px;
    color: #c9d1d9;
    cursor: pointer;
  }

  input[type="file"]::-webkit-file-upload-button:hover {
    background: #30363d;
  }

  button {
    width: 100%;
    background: linear-gradient(135deg, #1f6feb, #1158c7);
    color: white;
    border: none;
    padding: 12px 0;
    border-radius: 8px;
    cursor: pointer;

    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.4px;

    transition: all 0.2s ease;
  }

  button:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  button:active {
    transform: translateY(0);
    filter: brightness(0.95);
  }
`
