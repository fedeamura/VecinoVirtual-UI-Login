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
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import _ from "lodash";

//Mis componentes
import Validador from "@Componentes/_Validador";
import MiSelect from "@Componentes/MiSelect";
import Provincias from "./_provincias";
import Ciudades from "./_ciudades";
import MiBanerError from "@Componentes/MiBanerError";
import StringUtils from "@Componentes/Utils/String";

//Mis Rules
import Rules_Barrios from "@Rules/Rules_Barrios";

const PROVINCIA_CORDOBA = 7;
const CIUDAD_CORDOBA = 543;

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaDatosDomicilio extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onReady: () => {}
  };

  constructor(props) {
    super(props);

    let datosIniciales = props.datosIniciales || {};

    let idProvincia = datosIniciales.provinciaId || PROVINCIA_CORDOBA;
    let idCiudad = datosIniciales.ciudadId || CIUDAD_CORDOBA;

    let ciudades = [];
    if (idProvincia != undefined) {
      ciudades = _.filter(Ciudades, item => {
        return item.id_provincia == idProvincia;
      }).map(item => {
        return { value: item.id, label: item.nombre };
      });
    }

    let provincias = Provincias.map(item => {
      return { value: item.id, label: StringUtils.toTitleCase(item.nombre) };
    });

    this.state = {
      provincias: provincias,
      ciudades: ciudades,
      barrios: [],
      errorCargandoBarrios: undefined,
      //datos
      direccion: datosIniciales.direccion || "",
      altura: datosIniciales.altura || "",
      torre: datosIniciales.torre || "",
      piso: datosIniciales.piso || "",
      depto: datosIniciales.depto || "",
      idProvincia: idProvincia,
      idCiudad: idCiudad,
      idBarrio: datosIniciales.idBarrio || undefined,
      mostrarError: false,
      errores: []
    };
  }

  componentDidMount() {
    if (this.state.idCiudad == CIUDAD_CORDOBA) {
      this.buscarBarrios();
    }
  }

  onInputChange = e => {
    let errores = this.state.errores || [];
    errores[e.target.name] = undefined;
    this.setState({ [e.target.name]: e.target.value, errores: errores });
  };

  onInputKeyPress = event => {
    if (event.key === "Enter") {
      this.onBotonSiguienteClick();
    }
  };

  onProvinciaChange = e => {

    if (e == undefined) {
      this.setState({
        idProvincia: undefined,
        idCiudad: undefined,
        idBarrio: undefined,
        errores: { ...this.state.errores, provincia: undefined }
      });
      return;
    }

    let idProvincia = e.value;
    let idCiudad = undefined;
    if (idProvincia == PROVINCIA_CORDOBA) {
      idCiudad = CIUDAD_CORDOBA;
    }

    this.setState(
      {
        idProvincia: idProvincia,
        idCiudad: idCiudad,
        idBarrio: undefined,
        errores: {
          ...this.state.errores,
          provincia: undefined
        },
        ciudades: _.filter(Ciudades, item => {
          return item.id_provincia == e.value;
        }).map(item => {
          return { value: item.id, label: StringUtils.toTitleCase(item.nombre) };
        })
      },
      () => {
        if (idCiudad == CIUDAD_CORDOBA) {
          this.buscarBarrios();
        }
      }
    );
  };

  onCiudadChange = e => {
    if (e == undefined) {
      this.setState({
        idCiudad: undefined,
        idBarrio: undefined,
        errores: { ...this.state.errores, ciudad: undefined }
      });
      return;
    }

    this.setState({
      idCiudad: e.value,
      idBarrio: undefined,
      errores: {
        ...this.state.errores,
        ciudad: undefined
      }
    });

    if (e.value == CIUDAD_CORDOBA) {
      this.buscarBarrios();
    }
  };

  onBarrioChange = e => {
    if (e == undefined) {
      this.setState({
        idBarrio: undefined,
        errores: { ...this.state.errores, barrio: undefined }
      });
      return;
    }

    this.setState({
      idBarrio: e.value,
      errores: {
        ...this.state.errores,
        barrio: undefined
      }
    });
  };

  buscarBarrios = () => {
    if (this.state.barrios.length != 0) return this.state.barrios;

    this.props.onCargando(true);
    Rules_Barrios.get()
      .then(info => {
        this.setState({
          barrios: _.sortBy(info, "nombre").map(item => {
            return { value: item.id, label: StringUtils.toTitleCase(item.nombre) };
          })
        });
      })
      .catch(error => {
        this.setState({ error: error, mostrarError: true });
      })
      .finally(() => {
        this.props.onCargando(false);
      });
  };

  onBotonOmitirClick = () => {
    // this.setState({ errores: [] });
    this.props.onReady(undefined);
  };

  onBotonSiguienteClick = () => {
    const { direccion, altura, torre, piso, depto, idBarrio, idCiudad, idProvincia } = this.state;

    let errores = [];
    this.setState({ errores: errores });

    errores["direccion"] = Validador.validar([Validador.requerido, Validador.min(direccion, 5), Validador.max(direccion, 100)], direccion);

    errores["altura"] = Validador.validar([Validador.max(altura, 10)], altura);

    if (idProvincia == undefined) {
      errores["provincia"] = "Dato requerido";
    }

    if (idCiudad == undefined) {
      errores["ciudad"] = "Dato requerido";
    }

    if (idCiudad == CIUDAD_CORDOBA && idBarrio == undefined) {
      errores["barrio"] = "Dato requerido";
    }

    //Si hay errores, corto aca
    this.setState({ errores: errores });

    let conError = false;
    for (var prop in errores) {
      if (errores.hasOwnProperty(prop) && errores[prop] != undefined) {
        conError = true;
      }
    }

    if (conError) return;

    let provinciaSeleccionada = _.find(this.state.provincias, item => {
      return item.value == this.state.idProvincia;
    });

    let ciudadSeleccionada = _.find(this.state.ciudades, item => {
      return item.value == this.state.idCiudad;
    });

    let barrioSeleccionado = _.find(this.state.barrios, item => {
      return item.value == this.state.idBarrio;
    });

    this.props.onReady({
      direccion: direccion,
      altura: altura,
      torre: torre,
      piso: piso,
      depto: depto,
      provincia: provinciaSeleccionada != undefined ? provinciaSeleccionada.label : undefined,
      idProvincia: provinciaSeleccionada != undefined ? provinciaSeleccionada.value : undefined,
      ciudad: ciudadSeleccionada != undefined ? ciudadSeleccionada.label : undefined,
      idCiudad: ciudadSeleccionada != undefined ? ciudadSeleccionada.value : undefined,
      barrio: barrioSeleccionado != undefined ? barrioSeleccionado.label : undefined,
      idBarrio: barrioSeleccionado != undefined ? barrioSeleccionado.value : undefined
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

  onErrorClose = () => {
    this.setState({ mostrarError: false });
  };

  renderContent() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {/* Error */}
        <MiBanerError visible={this.mostrarError} mensaje={this.state.error} onClose={this.onErrorClose} />

        {/* Contenido */}
        <div className={classes.content}>
          <Grid container spacing={16}>
            <Grid item xs={12} />
            <Grid item xs={12}>
              <div className={classes.encabezado}>
                <Typography variant="headline">Nuevo Usuario</Typography>
                <Icon>keyboard_arrow_right</Icon>
                <Typography variant="subheading">Domicilio</Typography>
              </div>
            </Grid>
            <Grid item xs={12} />

            <Grid item xs={12}>
              <Grid container spacing={16}>
                {/* Direccion */}
                <Grid item xs={9} sm={10}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    autoComplete="off"
                    error={this.state.errores["direccion"] !== undefined}
                    helperText={this.state.errores["direccion"]}
                    label="Dirección"
                    id="inputDireccion"
                    autoFocus
                    inputProps={{
                      maxLength: 80
                    }}
                    value={this.state.direccion}
                    name="direccion"
                    type="text"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                </Grid>

                {/* Altura */}
                <Grid item xs={3} sm={2}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    autoComplete="off"
                    error={this.state.errores["altura"] !== undefined}
                    helperText={this.state.errores["altura"]}
                    label="Altura"
                    id="inputAltura"
                    value={this.state.altura}
                    name="altura"
                    inputProps={{
                      maxLength: 10
                    }}
                    type="text"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                </Grid>

                {/* Torre */}
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    autoComplete="off"
                    error={this.state.errores["torre"] !== undefined}
                    helperText={this.state.errores["torre"]}
                    label="Torre"
                    id="inputTorre"
                    value={this.state.torre}
                    name="torre"
                    inputProps={{
                      maxLength: 20
                    }}
                    type="text"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                </Grid>

                {/* Piso */}
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    autoComplete="off"
                    error={this.state.errores["piso"] !== undefined}
                    helperText={this.state.errores["piso"]}
                    label="Piso"
                    id="inputPiso"
                    value={this.state.piso}
                    name="piso"
                    inputProps={{
                      maxLength: 20
                    }}
                    type="text"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                </Grid>

                {/* Depto */}
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    error={this.state.errores["depto"] !== undefined}
                    helperText={this.state.errores["depto"]}
                    label="Depto"
                    variant="outlined"
                    id="inputTorre"
                    value={this.state.depto}
                    name="depto"
                    inputProps={{
                      maxLength: 20
                    }}
                    type="text"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                </Grid>

                {/* Provincias */}
                <Grid item xs={12} sm={4}>
                  <MiSelect
                    margin="dense"
                    fullWidth
                    variant="outlined"
                    autoComplete="off"
                    value={this.state.idProvincia}
                    style={{ width: "100%" }}
                    error={this.state.errores["provincia"] !== undefined}
                    helperText={this.state.errores["provincia"]}
                    label="Provincia"
                    placeholder="Seleccione..."
                    onChange={this.onProvinciaChange}
                    options={this.state.provincias}
                  />
                </Grid>

                {/* Ciudades */}
                {this.state.idProvincia != undefined && (
                  <Grid item xs={12} sm={4}>
                    <MiSelect
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      error={this.state.errores["ciudad"] !== undefined}
                      helperText={this.state.errores["ciudad"]}
                      disabled={this.state.idProvincia == undefined}
                      value={this.state.idCiudad}
                      label="Ciudad"
                      placeholder="Seleccione..."
                      onChange={this.onCiudadChange}
                      options={this.state.ciudades}
                    />
                  </Grid>
                )}

                {/* Barrio */}
                {this.state.idCiudad == 543 && (
                  <Grid item xs={12} sm={4}>
                    <MiSelect
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      error={this.state.errores["barrio"] !== undefined}
                      helperText={this.state.errores["barrio"]}
                      value={this.state.idBarrio}
                      label="Barrio"
                      placeholder="Seleccione..."
                      onChange={this.onBarrioChange}
                      options={this.state.barrios}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

  renderFooter() {
    const { classes } = this.props;

    return (
      <div className={classes.footer}>
        <div style={{ flex: 1 }}>
          <Button variant="text" color="primary" className={classes.button} onClick={this.props.onBotonVolverClick}>
            Volver
          </Button>
        </div>

        <Button color="primary" className={classes.button} onClick={this.onBotonOmitirClick}>
          Omitir
        </Button>

        <div style={{ marginLeft: "8px" }} />

        <Button variant="contained" color="primary" className={classes.button} onClick={this.onBotonSiguienteClick}>
          Siguiente
        </Button>
      </div>
    );
  }
}

let componente = PaginaDatosDomicilio;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
