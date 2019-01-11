import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Componentes
import { Typography, Button, Icon, CircularProgress, Fab } from "@material-ui/core";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import _ from "lodash";
import loadImage from "blueimp-load-image";
import ImageJS from "image-js";
import Slider from "@material-ui/lab/Slider";
import Lottie from "react-lottie";
import * as animScan from "@Resources/animaciones/anim_scan.json";

//Mis componentes
import DialogoMensaje from "@Componentes/MiDialogoMensaje";

const lottieScan = {
  loop: true,
  autoplay: true,
  animationData: animScan,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const MAX_SIZE = 2000;

class PanelPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargandoFotoSeleccionada: false,
      cropVisible: false,
      foto: undefined,
      rotation: 0,
      crop: {
        x: 10,
        y: 10,
        height: 80,
        width: 80
      }
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
      crop: {
        x: 10,
        y: 10,
        height: 80,
        width: 80
      }
    });

    if (this.ref) {
      this.setState({ height: this.ref.clientHeight });
    }
  };

  base64ToImage = foto => {
    return new Promise((resolve, reject) => {
      try {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        var image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0, image.width, image.height);

          let imagenJs = ImageJS.fromCanvas(canvas);
          resolve(imagenJs);
        };
        image.onerror = () => {
          reject("Error procesando la imagen. Por favor revise la selección realizada");
        };
        image.src = foto;
      } catch (ex) {
        reject("Error procesando la imagen. Por favor revise la selección realizada");
      }
    });
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
    this.filePicker.value = "";
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
          this.setState({ foto: foto }, () => {
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

  onCropChange = crop => {
    if (crop == undefined || crop.width == 0 || crop.height == 0) return;

    this.setState({ crop: crop });
  };

  onCargando = val => {
    this.props.onCargando && this.props.onCargando(val);
  };

  onBotonSeleccionarImagenClick = async () => {
    const { crop, foto, rotation } = this.state;

    this.onCargando(true);
    this.base64ToImage(foto)
      .catch(error => {
        this.onCargando(false);
        this.mostrarDialogoError(error);
      })
      .then(imagen => {
        let base64 = undefined;
        try {
          let imagenRotada = imagen.rotate(rotation);
          let xNuevo = (imagenRotada.width - imagen.width) / 2;
          if (xNuevo < 0) xNuevo *= -1;

          let yNuevo = (imagenRotada.height - imagen.height) / 2;
          if (yNuevo < 0) yNuevo *= -1;

          let imagenRecortada = imagenRotada.crop({
            x: xNuevo,
            y: yNuevo,
            width: imagen.width,
            height: imagen.height
          });

          base64 = imagenRecortada
            .crop({
              x: imagen.width * (crop.x / 100),
              y: imagen.height * (crop.y / 100),
              width: imagen.width * (crop.width / 100),
              height: imagen.height * (crop.height / 100)
            })
            .resize({
              width: 1000
            })
            .toDataURL("image/png");
        } catch (ex) {
          this.onCargando(false);
          this.mostrarDialogoError("Error al procesar la imagen. Por favor revise la selección realizada");
          return;
        }

        if (base64 == undefined) {
          this.onCargando(false);
          this.mostrarDialogoError("Error al procesar la imagen. Por favor revise la selección realizada");
          return;
        }

        this.onCargando(false);
        if (this.props.onDni) {
          this.props.onDni(base64);
        }
      });
  };

  onBotonCerrarClick = () => {
    this.props.onClose && this.props.onClose();
  };

  onSliderRotationChange = (e, value) => {
    this.setState({ rotation: value });
  };

  mostrarDialogoError = error => {
    this.setState({ dialogoErrorError: error, dialogoErrorVisible: true });
  };

  onDialogoErrorClose = () => {
    this.setState({ dialogoErrorVisible: false });
  };

  onRef = ref => {
    this.ref = ref;
    if (ref) {
      this.setState({ height: ref.clientHeight });
    }
  };

  render() {
    const { classes, visible } = this.props;
    let { cropVisible, crop, foto, cargandoFotoSeleccionada } = this.state;

    return (
      <div className={classNames(classes.root, visible && "visible")} ref={this.onRef}>
        <input style={{ display: "none" }} ref={this.onFilePickerRef} type="file" id="pickerFile" accept="image/*" />

        <div className={classNames(classes.contenedor, visible && "visible")}>
          <Lottie
            options={lottieScan}
            height={130}
            width={130}
            style={{ minHeight: "100px", marginBottom: 16, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 8 }}
          />

          <Typography variant="title" className="hint" style={{ maxWidth: "300px" }}>
            Suba una foto del último ejemplar de su DNI para validar su identidad
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
                Seleccionar archivo
              </Button>
            </div>
          </div>
        </div>

        <div className={classNames(classes.contenedor, visible && cropVisible && "visible")} style={{ backgroundColor: "black" }}>
          <div style={{ maxHeight: this.state.height }}>
            <ReactCrop
              src={foto || ""}
              crop={crop}
              keepSelection={true}
              onChange={this.onCropChange}
              style={{ backgroundColor: "black", maxHeight: this.state.height }}
              imageStyle={{
                // minHeight: this.state.height,
                maxHeight: this.state.height,
                // maxHeight: "none",
                transform: "rotate(" + this.state.rotation + "deg)"
              }}
            />
          </div>

          <Typography variant="body2" className={classes.hint}>
            Encuadre la tarjeta de su DNI
          </Typography>

          <Fab size="small" className={classes.botonVolver} onClick={this.onBotonVolverClick} style={{ left: 8, top: 8 }}>
            <Icon style={{ color: "black" }}>arrow_back</Icon>
          </Fab>

          <div className={classes.contenedorSlider}>
            <Icon>rotate_left</Icon>
            <Slider
              classes={{ container: classes.slider }}
              value={this.state.rotation}
              aria-labelledby="label"
              min={-180}
              max={180}
              onChange={this.onSliderRotationChange}
            />
          </div>
        </div>

        <Button variant="contained" onClick={this.onBotonCamaraClick} style={{ position: "absolute", top: 12, right: 12 }}>
          Prefiero usar mi cámara
        </Button>

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
