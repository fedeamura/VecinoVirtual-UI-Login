import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Componentes
import { Typography, Button, Icon, CircularProgress } from "@material-ui/core";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import _ from "lodash";
import loadImage from "blueimp-load-image";
import ImageJS from "image-js";
import Slider from "@material-ui/lab/Slider";

//Mis rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const MAX_SIZE = 2000;

class PanelPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pickerVisible: true,
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && this.props.visible) {
      this.setState({
        pickerVisible: true,
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
    }
  }
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
    this.setState({
      pickerVisible: true,
      cropVisible: false,
      rotation: 0,
      crop: {
        x: 10,
        y: 10,
        height: 80,
        width: 80
      }
    });
  };

  onFile = evt => {
    var files = evt.target.files; // FileList object
    if (files.length != 1) return;

    var file = files[0];

    this.setState({ cargando: true }, () => {
      loadImage(
        file,
        canvas => {
          let foto = canvas.toDataURL("image/png", 0.7);
          this.setState({
            cargando: false,
            foto: foto,
            pickerVisible: false,
            cropVisible: true
          });
        },
        { maxWidth: MAX_SIZE, orientation: true, canvas: true }
      );
    });
  };

  onCropChange = crop => {
    this.setState({ crop: crop });
  };

  onBotonSubirClick = async () => {
    const { crop, foto, rotation } = this.state;

    this.base64ToImage(foto).then(imagen => {
      let imagenRotada = imagen.rotate(rotation);
      let imagenRecortada = imagenRotada.crop({
        x: (imagenRotada.width - imagen.width) / 2,
        y: (imagenRotada.height - imagen.height) / 2,
        width: imagen.width,
        height: imagen.height
      });
      let base64 = imagenRecortada
        .crop({
          x: imagen.width * (crop.x / 100),
          y: imagen.height * (crop.y / 100),
          width: imagen.width * (crop.width / 100),
          height: imagen.height * (crop.height / 100)
        })
        .toDataURL("image/png");

      Rules_Usuario.validarQR(base64)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  onBotonCerrarClick = () => {
    this.props.onClose && this.props.onClose();
  };

  onBotonRotateLeftClick = async () => {
    let nueva = this.state.rotation - 5;
    this.setState({
      rotation: nueva
    });
  };

  onBotonRotateRightClick = async () => {
    let nueva = this.state.rotation + 5;
    this.setState({
      rotation: nueva
    });
  };

  base64ToImage = foto => {
    return new Promise((resolve, reject) => {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      var image = new Image();
      image.onload = function() {
        ctx.drawImage(image, 0, 0);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);

        let imagenJs = ImageJS.fromCanvas(canvas);
        resolve(imagenJs);
      };
      image.src = foto;
    });
  };

  onSliderRotationChange = (e, value) => {
    this.setState({ rotation: value });
  };

  render() {
    const { classes, visible } = this.props;
    let { pickerVisible, cropVisible, crop, foto, cargando } = this.state;

    return (
      <div className={classNames(classes.root, visible && "visible")}>
        <input style={{ display: "none" }} ref={this.onFilePickerRef} type="file" id="pickerFile" accept="image/*" />

        <div className={classNames(classes.contenedor, visible && pickerVisible && "visible")}>
          <Typography variant="title" className="hint">
            Suba una foto del último ejemplar de su DNI para validar su identidad
          </Typography>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 16 }}>
            <CircularProgress style={{ position: "absolute" }} className={classNames(classes.hideView, visible && cargando && "visible")} />
            <div
              className={classNames(classes.hideView, visible && !cargando && "visible")}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Button variant="raised" color="primary" onClick={this.onBotonSeleccionarArchivoClick}>
                Seleccionar archivo
              </Button>

              <Button variant="outlined" color="primary" onClick={this.onBotonCamaraClick} style={{ marginTop: 16 }}>
                Prefiero usar mi cámara
              </Button>
            </div>
          </div>
        </div>

        <div className={classNames(classes.contenedor, visible && cropVisible && "visible")} style={{ backgroundColor: "black" }}>
          <ReactCrop
            src={foto}
            crop={crop}
            onChange={this.onCropChange}
            style={{ backgroundColor: "white", width: "100%" }}
            imageStyle={{
              width: "100%",
              transform: "rotate(" + this.state.rotation + "deg)"
            }}
          />

          <Typography variant="title" className={classes.hintCrop}>
            Encuadre la tarjeta de su DNI
          </Typography>

          <Button variant="raised" className={classes.botonVolver} onClick={this.onBotonVolverClick}>
            <Icon style={{ color: "black", marginRight: 8 }}>arrow_back</Icon>
            Cambiar imagen
          </Button>

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

          <Button
            variant="extendedFab"
            onClick={this.onBotonSubirClick}
            color="primary"
            className={classNames(classes.fabCortar, visible && crop && "visible")}
          >
            Seleccionar imagen
          </Button>
        </div>

        <Button variant="raised" className={classes.botonCerrar} onClick={this.onBotonCerrarClick}>
          <Icon style={{ color: "black", marginRight: 8 }}>close</Icon>
          Cancelar
        </Button>
      </div>
    );
  }
}

let componente = PanelPicker;
componente = withStyles(styles)(componente);
export default componente;
