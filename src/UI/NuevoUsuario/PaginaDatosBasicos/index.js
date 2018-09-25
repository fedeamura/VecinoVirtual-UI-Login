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
import { DatePicker } from "material-ui-pickers";
import MiSelect from "@Componentes/MiSelect";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import _ from "lodash";

//Mis componentes
import Validador from "@Componentes/_Validador";
import MiPanelMensaje from "@Componentes/MiPanelMensaje";
import MiBanerError from "@Componentes/MiBanerError";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_EstadoCivil from "@Rules/Rules_EstadoCivil";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaDatosBasicos extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onReady: () => {}
  };

  constructor(props) {
    super(props);

    let datosIniciales = props.datosIniciales || {};
    // let fechaNacimiento = new Date(1987, 1, 28);
    // if (props.datosIniciales != undefined) {
    //   let partes = props.datosIniciales.fechaNacimiento
    //     .split("T")[0]
    //     .split("-");
    //   fechaNacimiento = new Date(partes[0], parseInt(partes[1]) - 1, partes[2]);
    // }

    this.state = {
      estadosCiviles: undefined,
      errorEstadosCiviles: undefined,
      validandoUsuario: false,
      errorValidandoUsuario: undefined,
      nombre: datosIniciales.nombre || "",
      apellido: datosIniciales.apellido || "",
      dni: datosIniciales.dni || "",
      fechaNacimiento: datosIniciales.fechaNacimiento || new Date(1900, 0, 1),
      fechaNacimientoKeyPress: false,
      estadoCivil: datosIniciales.estadoCivil || undefined,
      sexo: datosIniciales.sexoMasculino || true ? "m" : "f",
      errores: [],
      error: undefined,
      mostrarError: false
    };
  }

  componentDidMount() {
    this.props.onCargando(true);
    this.setState({ errorEstadosCiviles: undefined }, () => {
      Rules_EstadoCivil.get()
        .then(data => {
          let estadosCiviles = data.map(item => {
            return { value: item.id, label: item.nombre };
          });
          estadosCiviles.unshift({ value: -1, label: "Seleccione..." });
          this.setState({
            estadosCiviles: estadosCiviles
          });
        })
        .catch(error => {
          this.setState({ errorEstadosCiviles: error });
        })
        .finally(() => {
          this.props.onCargando(false);
        });
    });
  }

  onInputFechaNacimientoChange = fecha => {
    this.setState({ fechaNacimiento: fecha });
  };

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

  onInputFechaNacimientoChange = fecha => {
    this.setState({ fechaNacimiento: fecha });
  };

  onInputEstadoCivilChange = e => {
    let errores = this.state.errores || [];
    errores["estadoCivil"] = undefined;
    this.setState({ estadoCivil: e.value, errores: errores });
  };

  onInputSexoChange = e => {
    this.setState({ sexo: e.target.value });
  };

  onBotonSiguienteClick = () => {
    const {
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      sexo,
      idEstadoCivil
    } = this.state;

    let errores = [];
    errores["nombre"] = Validador.validar(
      [
        Validador.requerido,
        Validador.min(nombre, 3),
        Validador.max(nombre, 50)
      ],
      nombre
    );
    errores["apellido"] = Validador.validar(
      [
        Validador.requerido,
        Validador.min(apellido, 3),
        Validador.max(apellido, 50)
      ],
      apellido
    );

    errores["dni"] = Validador.validar(
      [
        Validador.requerido,
        Validador.numericoEntero,
        Validador.min(dni, 7),
        Validador.max(dni, 8)
      ],
      dni
    );

    errores["fechaNacimiento"] =
      fechaNacimiento == undefined ? "Dato requerido" : undefined;

    //Si hay errores, corto aca
    this.setState({ errores: errores });

    let conError = false;
    for (var prop in errores) {
      if (errores.hasOwnProperty(prop) && errores[prop] != undefined) {
        conError = true;
      }
    }

    if (conError) return;

    this.props.onCargando(true);
    this.setState({ mostrarError: false }, () => {
      Rules_Usuario.validarRenaper({
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        fechaNacimiento: this.convertirFechaNacimientoString(fechaNacimiento),
        sexoMasculino: sexo == "m"
      })
        .then(data => {
          this.props.onReady({
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            fechaNacimiento: fechaNacimiento,
            sexoMasculino: sexo,
            idEstadoCivil: idEstadoCivil
          });
        })
        .catch(error => {
          this.setState({ error: error, mostrarError: true });
        })
        .finally(() => {
          this.props.onCargando(false);
        });
    });
  };

  convertirFechaNacimientoString = fecha => {
    let dia = fecha.getDate();
    if (dia < 10) dia = "0" + dia;
    let mes = fecha.getMonth() + 1;
    if (mes < 10) mes = "0" + mes;
    let año = fecha.getFullYear();
    return dia + "/" + mes + "/" + año;
  };

  render() {
    const { classes } = this.props;

    if (this.state.errorEstadosCiviles != undefined) {
      return (
        <div className={classes.root}>
          <MiPanelMensaje
            mensaje="Error inicializando los datos"
            icono="error"
            iconoColor="red"
          />
          ;
        </div>
      );
    }

    return (
      <div className={classes.root}>
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    );
  }

  renderContent() {
    const { classes, padding } = this.props;

    let opcionEstadoCivil = undefined;
    if (this.state.estadoCivil != undefined) {
      opcionEstadoCivil = _.find(this.state.estadosCiviles, item => {
        return item.value == this.state.idEstadoCivil;
      });
    }

    return (
      <div className={classes.root}>
        {/* Error  */}
        <MiBanerError
          visible={this.state.mostrarError}
          mensaje={this.state.error}
          onClose={() => {
            this.setState({ mostrarError: false });
          }}
        />

        {/* Contenido */}
        <div className={classes.content}>
          <div style={{ padding: padding, paddingTop: "16px" }}>
            <div className={classes.encabezado}>
              <Typography variant="headline">Nuevo Usuario</Typography>
              <Icon>keyboard_arrow_right</Icon>
              <Typography variant="subheading">Datos personales</Typography>
            </div>

            <Grid container spacing={16}>
              <Grid item xs={12} sm={6}>
                <FormControl
                  className={classes.formControl}
                  fullWidth
                  margin="dense"
                  error={this.state.errores["nombre"] !== undefined}
                  aria-describedby="textoNombreError"
                >
                  <InputLabel htmlFor="inputNombre">Nombre</InputLabel>
                  <Input
                    id="inputNombre"
                    autoFocus
                    value={this.state.nombre}
                    name="nombre"
                    inputProps={{
                      maxLength: 30
                    }}
                    type="text"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                  <FormHelperText id="textoNombreError">
                    {this.state.errores["nombre"]}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  className={classes.formControl}
                  fullWidth
                  margin="dense"
                  error={this.state.errores["apellido"] !== undefined}
                  aria-describedby="textoApellidoError"
                >
                  <InputLabel htmlFor="inputApellido">Apellido</InputLabel>
                  <Input
                    id="inputApellido"
                    value={this.state.apellido}
                    name="apellido"
                    inputProps={{
                      maxLength: 30
                    }}
                    type="text"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                  <FormHelperText id="textoApellidoError">
                    {this.state.errores["apellido"]}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  className={classes.formControl}
                  fullWidth
                  margin="dense"
                  error={this.state.errores["dni"] !== undefined}
                  aria-describedby="textoDniError"
                >
                  <InputLabel htmlFor="inputDni">N° de Documento</InputLabel>
                  <Input
                    id="inputDni"
                    value={this.state.dni}
                    name="dni"
                    type="number"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                  <FormHelperText id="textoDniError">
                    {this.state.errores["dni"]}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  keyboard
                  style={{ marginTop: "4px", width: "100%" }}
                  label="Fecha de nacimiento"
                  format="dd/MM/yyyy"
                  openToYearSelection={true}
                  disableFuture={true}
                  labelFunc={this.renderLabelFecha}
                  invalidDateMessage="Fecha inválida"
                  maxDateMessage="Fecha inválida"
                  minDateMessage="Fecha inválida"
                  mask={value =>
                    value
                      ? [
                          /\d/,
                          /\d/,
                          "/",
                          /\d/,
                          /\d/,
                          "/",
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/
                        ]
                      : []
                  }
                  value={this.state.fechaNacimiento}
                  onChange={this.onInputFechaNacimientoChange}
                  disableOpenOnEnter
                  animateYearScrolling={false}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  className={classes.formControl}
                  fullWidth
                  margin="dense"
                  error={this.state.errores["estadoCivil"] !== undefined}
                  aria-describedby="textoEstadoCivilError"
                >
                  <MiSelect
                    value={opcionEstadoCivil}
                    style={{ width: "100%" }}
                    label="Estado civil"
                    placeholder="Seleccione..."
                    onChange={this.onInputEstadoCivilChange}
                    options={this.state.estadosCiviles}
                  />
                  <FormHelperText id="textoEstadoCivilError">
                    {this.state.errores["estadoCivil"]}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} style={{ marginTop: "16px" }}>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">Sexo</FormLabel>
                  <RadioGroup
                    aria-label="Sexo"
                    name="sexo"
                    style={{ flexDirection: "row" }}
                    value={this.state.sexo}
                    onChange={this.onInputSexoChange}
                  >
                    <FormControlLabel
                      value="m"
                      control={<Radio />}
                      label="Masculino"
                    />
                    <FormControlLabel
                      value="f"
                      control={<Radio />}
                      label="Femenino"
                    />
                  </RadioGroup>
                </FormControl>
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
          <Button
            variant="flat"
            color="primary"
            className={classes.button}
            onClick={this.props.onBotonYaEstoyRegistradoClick}
          >
            Ya estoy registrado
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

let componente = PaginaDatosBasicos;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
