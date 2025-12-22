import React from "react";
import logo from "../../assets/logos/logo.svg";
import "./styles.css";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer: React.FC = () => {
  return (
    <div className="footer-container">
      <div>
        <span>
          <InstagramIcon />
          <b>@lappcom.ufrj</b>
        </span>
        <span>
          <EmailIcon />
          <b>contato.lappcom@gmail.com</b>
        </span>
      </div>
      <img className="footer-logos" alt="LAPPCOM-NTT-COPPE" src={logo} />
    </div>
  );
};

export default Footer;
