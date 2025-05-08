import React from "react";
import logo from "../../assets/logos/logo.svg";
import "./styles.css";
import { Grid } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer: React.FC = () => {
  return (
    <div className="footer-container">
      
      <Grid container xs={12}>
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          flexDirection="column"
          xs={6}
        >
          <Grid item display="flex">
            <InstagramIcon /> &nbsp; @lappcom.ufrj
          </Grid>
          <Grid item display="flex">
            <EmailIcon /> &nbsp; contato.lappcom@gmail.com
          </Grid>
        </Grid>
        <Grid item display="flex"
          justifyContent="center"
          alignItems="flex-end"
          flexDirection="column" xs={6}>
          <img className="footer-logos" alt="LAPPCOM-NTT-COPPE" src={logo} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Footer;
