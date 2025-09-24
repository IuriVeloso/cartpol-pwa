import React from "react";

import { Grid, Paper, styled } from "@mui/material";

import StyledButton from "components/Buttons/StyledButton";
import "./styles.css";

const Item = styled(Paper)(() => ({
  textAlign: "left",
  background: "none",
}));

const Home: React.FC = () => {
  return (
    <Grid container marginTop={4}>
      <Grid
        item
        direction="row"
        sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        xs={12}
      >
        <Item className="home-title" elevation={0}>
          Bem-vindo ao CartPol - Visualização Democrática de Dados Eleitorais{" "}
        </Item>
        <br />
        <Item className="home-text" elevation={0}>
          &emsp;&emsp;O CartPol é uma ferramenta inovadora desenvolvida por
          alunos da UFRJ que transforma dados eleitorais em mapas interativos,
          permitindo a análise geográfica dos votos por bairro ou município.
          Nosso objetivo é democratizar o acesso à informação política
          brasileira através de visualizações cartográficas intuitivas. Abaixo,
          explicamos como funciona a ferramenta com imagens para lhe auxiliar!
        </Item>
        <br />
      </Grid>
      <Grid item xs={12}>
        <br />
        <Item className="home-title" elevation={0}>
          Por que usar o CartPol?
        </Item>
        <Item className="home-text" elevation={0}>
          <br />
          &emsp;&emsp;&#10004;&ensp; Transparência política acessível a todos os
          cidadãos
          <br />
          &emsp;&emsp;&#10004;&ensp; Visualização intuitiva de padrões
          eleitorais
          <br />
          &emsp;&emsp;&#10004;&ensp; Ferramenta educacional para entender a
          geografia do voto
          <br />
          &emsp;&emsp;&#10004;&ensp; Dados confiáveis organizados de forma clara
        </Item>
        <br />
        <StyledButton
          href="/tool"
          text="Acessar ferramenta"
          className="go-to-tool-button"
        />
        <br />
      </Grid>
    </Grid>
  );
};

export default Home;
