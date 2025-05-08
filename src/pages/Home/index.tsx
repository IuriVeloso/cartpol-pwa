import React from "react";

import { Grid, Paper, styled, Button } from "@mui/material";
import FormsImage from "../../assets/images/image 2.png";
import MapsImage from "../../assets/images/image 3.png";
import SubtitleChangeExampleImage from "../../assets/images/image 4.png";
import StateExampleImage from "../../assets/images/image 5.png";


import "./styles.css";

const Item = styled(Paper)(() => ({
  textAlign: "left",
  background: "none"
}));


const Home: React.FC = () => {
  return (
    <Grid container marginTop={4}>
      <Grid item direction="row" sx={{justifyContent: "flex-start", alignItems: "flex-start"}} xs={12}>
        <Item className="home-title" elevation={0}>Bem-vindo ao CartPol - Visualização Democrática de Dados Eleitorais </Item><br/>
        <Item className="home-text" elevation={0}>&emsp;&emsp;O CartPol é uma ferramenta inovadora desenvolvida por alunos da UFRJ que transforma dados eleitorais em mapas interativos, 
          permitindo a análise geográfica dos votos por bairro ou município. Nosso objetivo é democratizar o acesso à informação política 
          brasileira através de visualizações cartográficas intuitivas. Abaixo, explicamos como funciona a ferramenta com imagens para lhe auxiliar!</Item>
          <br/>
      </Grid>

      <Grid container xs={12}>
        <Grid item xs={6}>
          <Item className="home-title" elevation={0}>Como Funciona</Item>
          <br/>
          <Item className="home-text" elevation={0}>
            1. Selecione seus critérios de busca:
              <br/>&emsp;&emsp;&bull;&ensp; Ano: Explore eleições de 2016 até 2024
              <br/>&emsp;&emsp;&bull;&ensp; Estado: Todos os estados dentro dos 10 maiores colégios eleitorais
              <br/>&emsp;&emsp;&bull;&ensp; Município: Todos municípios do RJ, SP, MG mais os 10 maiores colégios eleitorais nacionais
              <br/>&emsp;&emsp;&bull;&ensp; Cargo: Deputado, Vereador, Presidente ou Prefeito
              <br/>&emsp;&emsp;&bull;&ensp; Candidato: Busque pelo nome do candidato específico e veja o mapa!
            <br/>
            <br/>
            2. Visualize os resultados:
              <br/>&emsp;&emsp;&bull;&ensp; O mapa interativo mostrando a distribuição geográfica dos votos será exibido após a seleção do candidato, como nas imagens ao lado.
              <br/>&emsp;&emsp;&bull;&ensp; Caso prefira ver um mapa do estado segmentado por município, deixe o município em branco.
              <br/>&emsp;&emsp;&bull;&ensp; Clique em Gerar Relatório para exportar os dados obtidos em PDF
            <br/>
            <br/>
            3. Significado dos resultados
              <br/>&emsp;&emsp;&bull;&ensp; A % do candidato é a quantidade de votos do candidato no bairro dividido pelo total de votos do candidato (RUESP_CAN)
              <br/>&emsp;&emsp;&bull;&ensp; A % do bairro é  a quantidade de votos do candidato no bairro dividido pelo total de votos do bairro (RCAN_UESP)
              <br/>&emsp;&emsp;&bull;&ensp; A % do bairro no município é  a quantidade de votos do bairro dividido pelo total de votos do município (RUESP)
              <br/>&emsp;&emsp;&bull;&ensp; Essas orientações se aplicam para o mapa estadual, trocando o bairro por município e município por estado
            </Item>
        </Grid>
        <Grid item xs={6}>
          <Item sx={{ display: "flex", flexDirection: "column", justifyContent:  "center", alignItems:"flex-end", height: "100%"}}  className="home-img" elevation={0}>
            <br/>
            <img alt="EXEMPLO-FORMS" className="home-image" src={FormsImage}/>
            <img alt="EXEMPLO IMAGEM" className="home-image" src={MapsImage}/>
          </Item>
        </Grid>
      </Grid>
      <Grid container sx={{margin: "24px 0"}} xs={12}>
        <Grid item xs={6}>
            <Item className="home-title" elevation={0}>Funcionalidades da Ferramenta</Item>
            <br/>
            <Item className="home-text" elevation={0}>
            <div><b>Visualizar mapa por Estado</b> =&gt; Basta deixar o município em branco que o mapa exibido será do estado</div>
              <img alt="MAPA-ESTADO" className="home-image" src={StateExampleImage}/>
            </Item>
        </Grid>
        <Grid item xs={6}>
          <Item sx={{ display: "flex", marginTop: "120px" ,flexDirection: "column", justifyContent: "flex-end", alignItems:"flex-end", height: "100%"}}  className="home-text" elevation={0}>
            <div><b>Ver mapa do Partido</b> =&gt; Basta selecionar um partido ao invés de um candidato</div>
            <img alt="MAPA-PARTIDO" className="home-image" src={StateExampleImage}/>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item className="home-text" elevation={0}>
            <div><b>Alterar legenda do mapa</b> =&gt; Basta alterar a legenda abaixo do mapa</div>
            <img alt="MAPA-LEGENDA" className="home-image" src={SubtitleChangeExampleImage}/>
          </Item>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <br/>
        <Item className="home-title" elevation={0}>Por que usar o CartPol?</Item>
          <Item className="home-text" elevation={0}>
              <br/>&emsp;&emsp;&#10004;&ensp; Transparência política acessível a todos os cidadãos
              <br/>&emsp;&emsp;&#10004;&ensp; Visualização intuitiva de padrões eleitorais
              <br/>&emsp;&emsp;&#10004;&ensp; Ferramenta educacional para entender a geografia do voto
              <br/>&emsp;&emsp;&#10004;&ensp; Dados confiáveis organizados de forma clara
          </Item>
          <br/>
          <Item elevation={0}>          
            <Button variant="contained" color="red" href="/tool">Acessar Ferramenta</Button>
          </Item>
          <br/>
      </Grid>
    </Grid>
    )
};

export default Home;
