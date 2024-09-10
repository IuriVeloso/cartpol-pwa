import React from "react";
import logo from "../../assets/logos/logo.svg";
import "./styles.css";

const Footer: React.FC = () => {
  return (
    <div className="footer-container">
      <img className="footer-logos" src={logo} />
    </div>
  );
};

export default Footer;
