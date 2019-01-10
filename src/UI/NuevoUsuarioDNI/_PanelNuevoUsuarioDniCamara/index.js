import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Componentes
import Webcam from "react-webcam";
import Lottie from "react-lottie";
import * as animScan from "@Resources/animaciones/anim_scan.json";
import { Typography, Button, Icon, Fab } from "@material-ui/core";

const lottieScan = {
  loop: true,
  autoplay: true,
  animationData: animScan,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

class PanelCamara extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoVisible: false,
      camaraVisible: false
    };
  }

  componentDidMount() {
    if (this.encuadre) {
      let w = this.encuadre.clientWidth - 64;
      if (w > 1000) w = 1000;
      let h = w / 1.55;
      if (h > this.encuadre.clientHeight - 64) {
        h = this.encuadre.clientHeight - 64;
        w = h * 1.55;
      }
      this.setState({ width: w, height: h });
    }

    this.intervalo = setInterval(() => {
      if (this.encuadre == undefined) return;
      let w = this.encuadre.clientWidth - 64;
      if (w > 1000) w = 1000;
      let h = w / 1.55;
      if (h > this.encuadre.clientHeight - 64) {
        h = this.encuadre.clientHeight - 64;
        w = h * 1.55;
      }
      this.setState({ width: w, height: h });
    }, 200);
  }

  componentWillUnmount() {
    clearInterval(this.intervalo);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible) {
      if (nextProps.visible) {
        this.setState({ infoVisible: true, camaraVisible: true });
      } else {
        setTimeout(() => {
          this.setState({ camaraVisible: false });
        }, 500);
      }
    }
  }

  onBotonCamaraInfoClick = () => {
    this.setState({ infoVisible: false });
  };

  onCamaraRef = webcam => {
    this.webcam = webcam;
  };

  onEncuadreRef = ref => {
    this.encuadre = ref;
  };

  onBotonCerrarClick = () => {
    this.props.onClose && this.props.onClose();
  };

  onBotonCamaraClick = () => {
    const imageSrc = this.webcam.getScreenshot();

    this.setState({ tomandoFoto: true }, () => {
      setTimeout(() => {
        this.setState({ tomandoFoto: false });
      }, 100);
    });
  };

  render() {
    const { classes, visible } = this.props;
    let { infoVisible, width, height, tomandoFoto, camaraVisible } = this.state;

    const videoConstraints = {
      width: width,
      height: height,
      facingMode: "user"
    };

    const encuadreWidth = this.encuadre ? this.encuadre.clientWidth : 0;
    const encuadreHeight = this.encuadre ? this.encuadre.clientHeight : 0;

    const encuadreTop = this.encuadre ? (this.encuadre.clientHeight - height) / 2 : 0;
    const encuadreLeft = this.encuadre ? (this.encuadre.clientWidth - width) / 2 : 0;

    return (
      <div className={classNames(classes.root, visible && "visible")} ref={this.onEncuadreRef}>
        <div className={classNames(classes.contenedorPanelFoto, visible && "visible")}>
          {camaraVisible && (
            <Webcam
              width={encuadreWidth}
              height={encuadreHeight}
              className={classes.camara}
              audio={false}
              ref={this.onCamaraRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          )}

          <div
            className={classNames(classes.camaraEncuadreTop, visible && infoVisible == false && "visible")}
            style={{ height: encuadreTop + 4 }}
          />
          <div
            className={classNames(classes.camaraEncuadreLeft, visible && infoVisible == false && "visible")}
            style={{ width: encuadreLeft + 4, top: encuadreTop + 4, bottom: encuadreTop + 4 }}
          />
          <div
            className={classNames(classes.camaraEncuadreRight, visible && infoVisible == false && "visible")}
            style={{ width: encuadreLeft + 4, top: encuadreTop + 4, bottom: encuadreTop + 4 }}
          />
          <div
            className={classNames(classes.camaraEncuadreBottom, visible && infoVisible == false && "visible")}
            style={{ height: encuadreTop + 4 }}
          />

          <div
            className={classNames(classes.camaraEncuadre, visible && infoVisible == false && "visible")}
            style={{
              left: encuadreLeft,
              top: this.encuadre ? (this.encuadre.clientHeight - height) / 2 : 0,
              width: width,
              height: height
            }}
          />

          <div className={classNames(classes.tomandoFoto, visible && tomandoFoto && "visible")} />
        </div>

        <div className={classNames(classes.contenedorCamaraInfo, visible && infoVisible && "visible")}>
          <Lottie
            options={lottieScan}
            height={150}
            width={150}
            style={{ minHeight: "150px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8 }}
          />
          <Typography variant="title" style={{ maxWidth: "300px", textAlign: "center", marginTop: 32, color: "white" }}>
            Encuadre el último ejemplar de su DNI para poder validar su identidad
          </Typography>

          <Button onClick={this.onBotonCamaraInfoClick} variant="contained" color="primary" style={{ marginTop: 16 }}>
            Aceptar
          </Button>

          <Button
            onClick={this.props.onBotonFileClick}
            variant="outlined"
            color="primary"
            style={{ color: "white", marginTop: 16, borderColor: "white" }}
          >
            Prefiero subir un archivo
          </Button>
        </div>

        {/* boton camara */}
        <Fab
          variant="extended"
          onClick={this.onBotonCamaraClick}
          color="primary"
          style={{ bottom: 16 }}
          className={classNames(classes.botonCamara, visible && infoVisible == false && "visible")}
        >
          Capturar
        </Fab>

        <Button className={classes.camaraBotonCerrar} variant="contained" onClick={this.onBotonCerrarClick}>
          <Icon style={{ marginRight: 8 }}>close</Icon>
          Cancelar
        </Button>
      </div>
    );
  }
}

let componente = PanelCamara;
componente = withStyles(styles)(componente);
export default componente;
