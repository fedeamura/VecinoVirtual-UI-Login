import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";

//Componentes
import { Typography, Icon, Button, Grid } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import _ from "lodash";

import red from "@material-ui/core/colors/red";

//Mis componentes
import MiBanerError from "@Componentes/MiBanerError";
import FotoUtils from "@Componentes/_FotoUtils";
import FOTO_PLACEHOLDER_FEMALE from "@Resources/imagenes/user_placeholder_female.png";
import FOTO_PLACEHOLDER_MALE from "@Resources/imagenes/user_placeholder_male.png";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaFoto extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onReady: () => {}
  };

  constructor(props) {
    super(props);

    let datosIniciales = props.datosIniciales || undefined;

    this.state = {
      sexoMasculino: props.sexoMasculino || true,
      mostrarError: false,
      foto: datosIniciales || undefined,
      error: undefined
    };
  }

  componentDidMount() {
    this.filePicker.addEventListener("change", this.onFile, false);
  }

  onFilePickerRef = ref => {
    this.filePicker = ref;
  };

  onFile = evt => {
    var files = evt.target.files; // FileList object
    if (files.length != 1) return;

    var file = files[0];
    var fr = new FileReader();

    console.log(file.size);
    if (file.size > 10 * 1024 * 1024) {
      this.setState({
        mostrarError: true,
        error: "Tamaño de imagen demasiado grande"
      });
      return;
    }

    let extension = file.name.split(".").pop();
    if (!_.includes(["png", "jpg"], extension)) {
      this.setState({
        mostrarError: true,
        error: "Formato de imagen no soportado"
      });
      return;
    }

    this.props.onCargando(true);
    fr.onload = e => {
      this.filePicker.value = "";
      FotoUtils.achicar(e.target.result, 500)
        .then(imagen => {
          this.setState({ procesandoFoto: true }, () => {
            setTimeout(() => {
              this.setState({ foto: imagen }, () => {
                this.setState({
                  procesandoFoto: false
                });
              });
            }, 500);
          });
        })
        .catch(error => {
          this.setState({ mostrarError: true, error: error });
        })
        .finally(() => {
          this.props.onCargando(false);
        });
    };
    fr.readAsDataURL(file);
  };

  onBotonSeleccionarFotoClick = () => {
    this.filePicker.value = "";
    this.filePicker.click();
  };

  onBotonSiguienteClick = () => {
    const { foto } = this.state;

    let errores = [];
    this.setState({ errores: errores });

    //Si hay errores, corto aca
    this.setState({ errores: errores });

    let conError = false;
    for (var prop in errores) {
      if (errores.hasOwnProperty(prop) && errores[prop] != undefined) {
        conError = true;
      }
    }

    if (conError) return;

    this.props.onReady(foto);
  };

  onBotonQuitarFotoClick = () => {
    this.filePicker.value = "";
    this.setState({ procesandoFoto: true }, () => {
      setTimeout(() => {
        this.setState({ foto: undefined, procesandoFoto: false });
      }, 500);
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    );
  }

  renderContent() {
    const { classes, padding } = this.props;

    let foto =
      this.state.foto == undefined
        ? this.state.sexoMasculino
          ? FOTO_PLACEHOLDER_MALE
          : FOTO_PLACEHOLDER_FEMALE
        : this.state.foto;

    return (
      <div className={classes.root}>
        {/* Error */}
        <MiBanerError
          visible={this.state.mostrarError}
          mensaje={this.state.error}
          onClose={() => {
            this.setState({ mostrarError: false });
          }}
        />

        {/* Contenido */}
        <div
          className={classes.content}
          style={{ padding: padding, paddingTop: 0 }}
        >
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <div className={classes.encabezado}>
                <Typography variant="headline">Nuevo Usuario</Typography>
                <Icon>keyboard_arrow_right</Icon>
                <Typography variant="subheading">Foto</Typography>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className={classes.contenedorForm}>
                <Avatar
                  className={classNames(
                    classes.foto,
                    this.state.procesandoFoto && "procesando"
                  )}
                  src={foto}
                />

                <Button
                  onClick={this.onBotonSeleccionarFotoClick}
                  variant="outlined"
                  color="primary"
                >
                  Seleccionar foto
                </Button>

                {this.state.foto != undefined && (
                  <Button
                    onClick={this.onBotonQuitarFotoClick}
                    variant="flat"
                    style={{ marginTop: "0.5rem", color: red["500"] }}
                  >
                    Quitar foto
                  </Button>
                )}

                <input
                  style={{ display: "none" }}
                  ref={this.onFilePickerRef}
                  type="file"
                  id="pickerFile"
                  accept="image/*"
                />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

  renderFooter() {
    const { classes, padding } = this.props;

    return (
      <div
        className={classes.footer}
        style={{
          padding: padding,
          paddingBottom: "16px",
          paddingTop: "16px"
        }}
      >
        <div style={{ flex: 1 }}>
          <Button
            variant="flat"
            color="primary"
            className={classes.button}
            onClick={this.props.onBotonVolverClick}
          >
            Volver
          </Button>
        </div>

        <Button
          variant="raised"
          color="primary"
          className={classes.button}
          onClick={this.onBotonSiguienteClick}
        >
          Siguiente
        </Button>
      </div>
    );
  }
}

let componente = PaginaFoto;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
