import React from "react";
import HomeLogo from "../../assets/logos/lappcom_logo.png";

import NavButton from "components/Buttons/NavButton";
import "./styles.css";

const Header: React.FC = () => {
  return (
    <div className="header-container">
      <img src={HomeLogo} alt="Lappcom Logo" />
      <div>
        <NavButton className="header-title" href="/" text="CartPol" />
        <NavButton href="/how-to-use" text="Como Usar" />
        <NavButton href="/tool" text="Acessar Ferramenta" />
      </div>
    </div>
  );
};

export default Header;
