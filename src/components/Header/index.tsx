import React from "react";
import HomeLogo from "../../assets/logos/lappcom_logo.png";

// import { Container } from './styles';

import "./styles.css";

const Header: React.FC = () => {
  return (
    <div className="header-container">
      <img src={HomeLogo} alt="Lappcom Logo"/>
      <h1 className="header-title">CartPol</h1>
      <a href="/" className="header-link">Como Usar</a>
      <a href="/tool" className="header-link">Acessar Ferramenta</a>
    </div>
  );
};

export default Header;
