import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Componentes
import { Typography, Button, Icon, CircularProgress, Fab } from "@material-ui/core";
import _ from "lodash";
import loadImage from "blueimp-load-image";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Slider from "@material-ui/lab/Slider";
import Lottie from "react-lottie";
import * as animScan from "@Resources/animaciones/anim_scan.json";

//Mis componentes
import DialogoMensaje from "@Componentes/MiDialogoMensaje";
import { isMobile } from "react-device-detect";

const lottieScan = {
  loop: true,
  autoplay: true,
  animationData: animScan,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const MAX_SIZE = 1500;

class PanelPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargandoFotoSeleccionada: false,
      cropVisible: false,
      foto: undefined,
      rotation: 0,
      zoom: 1
    };
  }

  componentDidMount() {
    this.filePicker.addEventListener("change", this.onFile, false);
    window.addEventListener("file-seleccionar", this.onBotonSeleccionarImagenClick);
  }

  componentWillUnmount() {
    window.removeEventListener("file-seleccionar", this.onBotonSeleccionarImagenClick);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && this.props.visible) {
      this.resetState();
    }
  }

  resetState = () => {
    this.setState({
      cargandoFotoSeleccionada: false,
      cropVisible: false,
      foto: undefined,
      rotation: 0,
      zoom: 1
    });

    this.setState({ cargandoFotoSeleccionada: false });
    this.filePicker.value = "";
  };

  onFilePickerRef = ref => {
    this.filePicker = ref;
  };

  onBotonSeleccionarArchivoClick = () => {
    this.filePicker.value = "";
    this.filePicker.click();
  };

  onBotonCamaraClick = () => {
    this.props.onBotonCamaraClick && this.props.onBotonCamaraClick();
  };

  onBotonVolverClick = () => {
    this.props.onPuedeCapturar && this.props.onPuedeCapturar(false);
    this.resetState();
  };

  onFile = evt => {
    var files = evt.target.files; // FileList object
    if (files.length != 1) return;

    var file = files[0];

    this.setState({ cargandoFotoSeleccionada: true }, () => {
      loadImage(
        file,
        canvas => {
          let foto = canvas.toDataURL("image/png", 0.7);
          this.setState({ foto: foto, zoom: 1, rotate: 0 }, () => {
            this.setState(
              {
                cropVisible: true
              },
              () => {
                setTimeout(() => {
                  this.props.onPuedeCapturar && this.props.onPuedeCapturar(true);
                  this.setState({ cargandoFotoSeleccionada: false });
                }, 200);
              }
            );
          });
        },
        { maxWidth: MAX_SIZE, orientation: true, canvas: true }
      );
    });
  };

  crop = data => {};

  onCargando = val => {
    this.props.onCargando && this.props.onCargando(val);
  };

  onBotonSeleccionarImagenClick = async () => {
    this.onCargando(true);
    setTimeout(() => {
      const base64 = this.refs.cropper
        .getCroppedCanvas({
          maxWidth: MAX_SIZE,
          maxHeight: MAX_SIZE,
          fillColor: "#fff"
        })
        .toDataURL();
      if (this.props.onDni) {
        this.props.onDni(base64);
      }
    }, 300);
  };

  onBotonCerrarClick = () => {
    this.props.onClose && this.props.onClose();
  };

  onSliderRotationChange = (e, value) => {
    this.setState({ rotation: value });
  };

  onSliderZoomChange = (e, value) => {
    this.setState({ zoom: value });
  };

  mostrarDialogoError = error => {
    this.setState({ dialogoErrorError: error, dialogoErrorVisible: true });
  };

  onDialogoErrorClose = () => {
    this.setState({ dialogoErrorVisible: false });
  };

  render() {
    const { classes, visible } = this.props;
    let { cropVisible, foto, cargandoFotoSeleccionada } = this.state;

    return (
      <div className={classNames(classes.root, visible && "visible")}>
        <input style={{ display: "none" }} ref={this.onFilePickerRef} type="file" id="pickerFile" accept="image/*" capture="camera" />

        <div className={classNames(classes.contenedor, visible && "visible")}>
          <Lottie
            options={lottieScan}
            height={130}
            width={130}
            style={{ minHeight: "100px", marginBottom: 16, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 8 }}
          />

          <Typography variant="title" className="hint" style={{ maxWidth: "300px" }}>
            {isMobile
              ? "Capture una foto del último ejemplar de su DNI para validar su identidad"
              : "Seleccione una foto del último ejemplar de su DNI para validar su identidad"}
          </Typography>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 16 }}>
            <CircularProgress
              style={{ position: "absolute" }}
              className={classNames(classes.hideView, visible && cargandoFotoSeleccionada && "visible")}
            />

            <div
              className={classNames(classes.hideView, visible && !cargandoFotoSeleccionada && "visible")}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Button variant="contained" color="primary" onClick={this.onBotonSeleccionarArchivoClick}>
                {isMobile ? "Capturar foto" : "Seleccionar foto"}
              </Button>
            </div>
          </div>
        </div>

        <div className={classNames(classes.contenedor, visible && cropVisible && "visible")} style={{ backgroundColor: "black" }}>
          <div style={{ maxHeight: "100%", maxWidth: "100%", width: "100%", height: "100%" }}>
            <Cropper
              ref="cropper"
              src={foto || ""}
              dragMode="move"
              style={{ height: "100%", width: "100%" }}
              aspectRatio={3.0 / 0.8}
              guides={true}
              zoomOnWheel={true}
              zoomOnTouch={true}
              rotateTo={this.state.rotation || 0}
              crop={this.crop}
            />
          </div>

          <Typography variant="body2" className={classes.hint}>
            Encuadre el código de barras
          </Typography>

          <Fab
            size="small"
            className={classes.botonVolver}
            onClick={this.onBotonVolverClick}
            style={{ left: 8, top: 8, backgroundColor: "white" }}
          >
            <Icon style={{ color: "black" }}>arrow_back</Icon>
          </Fab>

          <div className={classes.contenedorSliderRotate}>
            <Icon>rotate_left</Icon>
            <Slider
              classes={{ container: classes.slider }}
              value={this.state.rotation}
              aria-labelledby="label"
              min={-180}
              max={180}
              onChange={this.onSliderRotationChange}
            />
            <Icon>rotate_right</Icon>
          </div>

          {/* <div className={classes.contenedorSliderZoom}>
            <Icon>zoom_out</Icon>
            <Slider
              classes={{ container: classes.slider }}
              value={this.state.zoom}
              aria-labelledby="label"
              min={1}
              max={4}
              onChange={this.onSliderZoomChange}
            />
            <Icon>zoom_int</Icon>
          </div> */}
        </div>

        {/* <Button
          variant="contained"
          onClick={this.onBotonCamaraClick}
          style={{ position: "absolute", top: 12, right: 12, backgroundColor: "white" }}
        >
          Prefiero usar mi cámara
        </Button> */}

        {/* Dialogo error */}
        <DialogoMensaje
          visible={this.state.dialogoErrorVisible || false}
          mensaje={this.state.dialogoErrorError}
          onClose={this.onDialogoErrorClose}
          icon={"error"}
          iconColor="red"
          botonNoVisible={false}
          textoSi="Aceptar"
        />
      </div>
    );
  }
}

let componente = PanelPicker;
componente = withStyles(styles)(componente);
export default componente;
