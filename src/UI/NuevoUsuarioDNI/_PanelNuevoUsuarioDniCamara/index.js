import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Componentes
import Webcam from "react-webcam";
// import ImageJS from "image-js";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

//Mis componentes
import DialogoMensaje from "@Componentes/MiDialogoMensaje";

class PanelCamara extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoVisible: localStorage.getItem("camaraInfo") == undefined,
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

    // this.props.onPuedeCapturar && this.props.onPuedeCapturar(true);
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
        // this.props.onPuedeCapturar && this.props.onPuedeCapturar(true);
        this.setState({ infoVisible: localStorage.getItem("camaraInfo") == undefined, camaraVisible: true });

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

  onBotonCamaraInfoClick = () => {
    localStorage.setItem("camaraInfo", "true");
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
    // if (this.state.tomandoFoto == true) return;

    // this.setState({ tomandoFoto: true }, () => {
    //   setTimeout(() => {
    //     const base64 = this.webcam.getScreenshot();
    //     this.base64ToImage(base64)
    //       .then(imagen => {
    //         const { width, height } = this.state;

    //         const contenedorWidth = this.encuadre.clientWidth;
    //         const contenedorHeight = this.encuadre.clientHeight;
    //         const contenedorAspectRatio = contenedorWidth / contenedorHeight;

    //         const imagenWidth = imagen.width;
    //         const imagenHeight = imagen.height;
    //         const imagenAspectRatio = imagenWidth / imagenHeight;
    //         const imagenWidth2 = imagenHeight * contenedorAspectRatio;
    //         const diffWidth = (imagenWidth - imagenWidth2) / 2;

    //         const encuadreLeft = (contenedorWidth - width) / 2;
    //         const porcentajeLeft = encuadreLeft / contenedorWidth;
    //         const encuadreTop = (contenedorHeight - height) / 2;
    //         const porcentajeTop = encuadreTop / contenedorHeight;

    //         let x = diffWidth + (imagen.width - diffWidth * 2) * porcentajeLeft;
    //         let imagenCortada = imagen.crop({
    //           x: x,
    //           y: imagen.height * porcentajeTop,
    //           width: imagen.width - x * 2,
    //           height: imagen.height - imagen.height * porcentajeTop * 2
    //         });
    //         if (imagenCortada.width > 1000 || imagenCortada.height > 1000) {
    //           imagenCortada = imagenCortada.resize({
    //             width: 1000
    //           });
    //         }
    //         const dniBase64 = imagenCortada.toDataURL("image/png");
    //         this.setState({ miniatura: dniBase64 });
    //         this.props.onDni && this.props.onDni(dniBase64);
    //         this.setState({ tomandoFoto: false });
    //       })
    //       .catch(error => {
    //         this.setState({ tomandoFoto: false });
    //         this.mostrarDialogoError(error);
    //       });
    //   }, 300);
    // });
  };

  // base64ToImage = foto => {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       var canvas = document.createElement("canvas");
  //       var ctx = canvas.getContext("2d");

  //       var image = new Image();
  //       image.onload = () => {
  //         ctx.drawImage(image, 0, 0);
  //         canvas.width = image.width;
  //         canvas.height = image.height;
  //         ctx.drawImage(image, 0, 0, image.width, image.height);

  //         let imagenJs = ImageJS.fromCanvas(canvas);
  //         resolve(imagenJs);
  //       };
  //       image.onerror = () => {
  //         reject("Error procesando la imagen. Por favor revise la selección realizada");
  //       };
  //       image.src = foto;
  //     } catch (ex) {
  //       reject("Error procesando la imagen. Por favor revise la selección realizada");
  //     }
  //   });
  // };

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

  render() {
    const { classes, visible } = this.props;
    let { infoVisible, width, height, tomandoFoto, camaraVisible } = this.state;

    const videoConstraints = {
      width: width,
      height: height,
      facingMode: "environment"
    };

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

        <Typography variant="body2" className={classes.hint}>
          Encuadre la tarjeta de su DNI
        </Typography>

        <Button
          onClick={this.props.onBotonFileClick}
          variant="contained"
          style={{ position: "absolute", top: 12, right: 12, backgroundColor: "white" }}
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
