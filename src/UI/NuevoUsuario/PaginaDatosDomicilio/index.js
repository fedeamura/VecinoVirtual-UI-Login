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
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import _ from "lodash";

//Mis componentes
import Validador from "@Componentes/_Validador";
import MiSelect from "@Componentes/MiSelect";
import Provincias from "./_provincias";
import Ciudades from "./_ciudades";
import MiBanerError from "@Componentes/MiBanerError";

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

    let idProvincia = datosIniciales.provinciaId || undefined;
    let idCiudad = datosIniciales.ciudadId || undefined;

    let ciudades = [];
    if (idProvincia != undefined) {
      ciudades = _.filter(Ciudades, item => {
        return item.id_provincia == idProvincia;
      }).map(item => {
        return { value: item.id, label: item.nombre };
      });
    }

    let provincias = Provincias.map(item => {
      return { value: item.id, label: item.nombre.toTitleCase() };
    });
    provincias.unshift({
      value: -1,
      label: "Seleccione..."
    });

    console.log(provincias);

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
      idProvincia: datosIniciales.idProvincia || undefined,
      idCiudad: datosIniciales.idCiudad || undefined,
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
    let errores = this.state.errores || [];
    errores["provincia"] = undefined;

    let idProvincia = e.value;
    if (idProvincia == -1) idProvincia = undefined;

    let idCiudad = undefined;
    if (idProvincia == PROVINCIA_CORDOBA) {
      idCiudad = CIUDAD_CORDOBA;
    }

    this.setState(
      {
        idProvincia: idProvincia,
        idCiudad: idCiudad,
        idBarrio: undefined,
        errores: errores,
        ciudades: _.filter(Ciudades, item => {
          return item.id_provincia == e.value;
        }).map(item => {
          return { value: item.id, label: item.nombre.toTitleCase() };
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
    let errores = this.state.errores || [];
    errores["ciudad"] = undefined;
    this.setState({
      idCiudad: e.value,
      idBarrio: undefined,
      errores: errores
    });

    if (e.value == CIUDAD_CORDOBA) {
      this.buscarBarrios();
    }
  };

  onBarrioChange = e => {
    let errores = this.state.errores || [];
    errores["barrio"] = undefined;
    this.setState({
      idBarrio: e.value,
      errores: errores
    });
  };

  buscarBarrios = () => {
    if (this.state.barrios.length != 0) return this.state.barrios;

    this.props.onCargando(true);
    Rules_Barrios.get()
      .then(info => {
        this.setState({
          barrios: _.sortBy(info, "nombre").map(item => {
            return { value: item.id, label: item.nombre.toTitleCase() };
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

  renderContent() {
    const { classes, padding } = this.props;

    console.log(this.state.idProvincia);

    return (
      <div className={classes.root}>
        {/* Error */}
        <MiBanerError
          visible={this.mostrarError}
          mensaje={this.state.error}
          onClose={() => {
            this.setState({ mostrarError: false });
          }}
        />

        {/* Contenido */}
        <div className={classes.content}>
          <div style={{ padding: padding, paddingTop: 0 }}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <div className={classes.encabezado}>
                  <Typography variant="headline">Nuevo Usuario</Typography>
                  <Icon>keyboard_arrow_right</Icon>
                  <Typography variant="subheading">Domicilio</Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={16}>
                  {/* Direccion */}
                  <Grid item xs={9} sm={10}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["direccion"] !== undefined}
                      aria-describedby="textoDireccionError"
                    >
                      <InputLabel htmlFor="inputDireccion">Direccion</InputLabel>
                      <Input
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
                      <FormHelperText id="textoDireccionError">{this.state.errores["direccion"]}</FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Altura */}
                  <Grid item xs={3} sm={2}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["altura"] !== undefined}
                      aria-describedby="textoAlturaError"
                    >
                      <InputLabel htmlFor="inputAltura">Altura</InputLabel>
                      <Input
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
                      <FormHelperText id="textoAlturaError">{this.state.errores["altura"]}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} />

                  {/* Torre */}
                  <Grid item xs={4}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["torre"] !== undefined}
                      aria-describedby="textoTorreError"
                    >
                      <InputLabel htmlFor="inputTorre">Torre</InputLabel>
                      <Input
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
                      <FormHelperText id="textoTorreError">{this.state.errores["torre"]}</FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Piso */}
                  <Grid item xs={4}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["piso"] !== undefined}
                      aria-describedby="textoPisoError"
                    >
                      <InputLabel htmlFor="inputPiso">Piso</InputLabel>
                      <Input
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
                      <FormHelperText id="textoPisoError">{this.state.errores["piso"]}</FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Depto */}
                  <Grid item xs={4}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["depto"] !== undefined}
                      aria-describedby="textoDeptoError"
                    >
                      <InputLabel htmlFor="inputDepto">Depto</InputLabel>
                      <Input
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
                      <FormHelperText id="textoDeptoError">{this.state.errores["depto"]}</FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Provincias */}
                  <Grid item xs={12} sm={4}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["provincia"] !== undefined}
                      aria-describedby="textoProvinciaError"
                    >
                      <MiSelect
                        value={this.state.idProvincia}
                        style={{ width: "100%" }}
                        label="Provincia"
                        placeholder="Seleccione..."
                        onChange={this.onProvinciaChange}
                        options={this.state.provincias}
                      />
                      <FormHelperText id="textoProvinciaError">{this.state.errores["provincia"]}</FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Ciudades */}
                  <Grid item xs={12} sm={4}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["ciudad"] !== undefined}
                      aria-describedby="textoCiudadError"
                    >
                      <MiSelect
                        disabled={this.state.idProvincia == undefined}
                        value={this.state.idCiudad}
                        style={{ width: "100%" }}
                        label="Ciudad"
                        placeholder="Seleccione..."
                        onChange={this.onCiudadChange}
                        options={this.state.ciudades}
                      />
                      <FormHelperText id="textoCiudadError">{this.state.errores["ciudad"]}</FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Barrio */}
                  {this.state.idCiudad == 543 && (
                    <Grid item xs={12} sm={4}>
                      <FormControl
                        className={classes.formControl}
                        fullWidth
                        margin="dense"
                        error={this.state.errores["barrio"] !== undefined}
                        aria-describedby="textoBarrioError"
                      >
                        <MiSelect
                          value={this.state.idBarrio}
                          style={{ width: "100%" }}
                          label="Barrio"
                          placeholder="Seleccione..."
                          onChange={this.onBarrioChange}
                          options={this.state.barrios}
                        />
                        <FormHelperText id="textoBarrioError">{this.state.errores["barrio"]}</FormHelperText>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </div>
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
