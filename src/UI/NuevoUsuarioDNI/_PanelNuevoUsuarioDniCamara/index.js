import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Componentes
import Webcam from "react-webcam";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

//Mis componentes
import DialogoMensaje from "@Componentes/MiDialogoMensaje";

class PanelCamara extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      camaraVisible: props.visible
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

    window.addEventListener("camara-capturar", this.onBotonCamaraClick);
  }

  componentWillUnmount() {
    clearInterval(this.intervalo);
    this.intervaloCamara && clearInterval(this.intervaloCamara);
    window.removeEventListener("camara-capturar", this.onBotonCamaraClick);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible) {
      if (nextProps.visible) {
        this.props.onPuedeCapturar && this.props.onPuedeCapturar(true);
        this.setState({ camaraVisible: true });

        this.intervaloCamara = setInterval(() => {
          this.setState({ camaraVisible: true });
        }, 300);
      } else {
        this.intervaloCamara && clearImmediate(this.intervaloCamara);
        setTimeout(() => {
          this.setState({ camaraVisible: false });
        }, 500);
      }
    }
  }

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
    if (this.state.tomandoFoto == true) return;
    this.setState(
      { tomandoFoto: true },
      () => {
        setTimeout(() => {
          const base64 = this.webcam.getScreenshot();
          if (base64 == undefined) {
            this.mostrarDialogoError("Error al capturar la foto. Por favor intente nuevamente");
            this.setState({
              foto: undefined,
              tomandoFoto: false
            });
            return;
          }

          this.setState({
            foto: base64,
            tomandoFoto: false,
            camaraVisible: false
          });
        });
      },
      300
    );
  };

  onBotonInfoClick = () => {
    localStorage.removeItem("camaraInfo");
    this.setState({ infoVisible: true });
  };

  mostrarDialogoError = mensaje => {
    this.setState({
      dialogoErrorVisible: true,
      dialogoErrorMensaje: mensaje
    });
  };

  onDialogoErrorClose = () => {
    this.setState({ dialogoErrorVisible: false });
  };

  crop = data => {
    const base64 = this.refs.cropper
      .getCroppedCanvas({
        maxWidth: 1500,
        maxHeight: 1500,
        fillColor: "#fff"
      })
      .toDataURL();
    this.props.onDni && this.props.onDni(base64);
    this.setState({ foto: undefined });
  };

  render() {
    const { classes, visible } = this.props;
    let { infoVisible, width, height, tomandoFoto, camaraVisible, foto } = this.state;

    const videoConstraints = {
      width: width,
      height: height,
      facingMode: "environment"
    };

    const cropperVisible = foto != undefined;
    camaraVisible = cropperVisible ? false : camaraVisible;

    const encuadreWidth = this.encuadre ? this.encuadre.clientWidth : 0;
    const encuadreHeight = this.encuadre ? this.encuadre.clientHeight : 0;

    const encuadreTop = this.encuadre ? (this.encuadre.clientHeight - height) / 2 : 0;
    const encuadreLeft = this.encuadre ? (this.encuadre.clientWidth - width) / 2 : 0;

    infoVisible = false;

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

          {cropperVisible && (
            <Cropper
              ref="cropper"
              src={foto || ""}
              viewMode={3}
              dragMode="move"
              style={{ height: "100%", width: "100%" }}
              aspectRatio={8.5 / 5.5}
              guides={false}
              zoomOnWheel={false}
              zoomOnTouch={false}
              crop={this.crop}
            />
          )}
          <div
            className={classNames(classes.camaraEncuadreTop, visible && infoVisible == false && "visible")}
            style={{ height: encuadreTop + 4 }}
          />
          <div
            className={classNames(classes.camaraEncuadreLeft, visible && infoVisible == false && "visible")}
            style={{
              width: encuadreLeft + 4,
              top: encuadreTop + 4,
              bottom: encuadreTop + 4
            }}
          />
          <div
            className={classNames(classes.camaraEncuadreRight, visible && infoVisible == false && "visible")}
            style={{
              width: encuadreLeft + 4,
              top: encuadreTop + 4,
              bottom: encuadreTop + 4
            }}
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

        <Typography variant="body2" className={classes.hint}>
          Encuadre la tarjeta de su DNI
        </Typography>

        <Button
          onClick={this.props.onBotonFileClick}
          variant="contained"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "white"
          }}
        >
          Prefiero subir un archivo
        </Button>

        {/* Dialogo Nuevo Usuario Exito */}
        <DialogoMensaje
          visible={this.state.dialogoErrorVisible || false}
          mensaje={this.state.dialogoErrorMensaje}
          textoSi="Aceptar"
          botonNoVisible={false}
          onClose={this.onDialogoErrorClose}
        />
      </div>
    );
  }
}

let componente = PanelCamara;
componente = withStyles(styles)(componente);
export default componente;
