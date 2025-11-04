import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    background: #0d1117;
    color: #f0f0f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .container {
    background: #161b22;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0,0,0,0.4);
    text-align: center;
  }

  input[type="file"] {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  button {
    background: #0078d7;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
  }

  button:hover {
    background: #005fa3;
  }
`