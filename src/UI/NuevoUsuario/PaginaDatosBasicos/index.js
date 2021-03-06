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
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { InlineDatePicker as DatePicker } from "material-ui-pickers";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import _ from "lodash";
import IconHelpOutlined from "@material-ui/icons/HelpOutlineOutlined";
import IconInfoOutlined from "@material-ui/icons/InfoOutlined";

//Mis componentes
import Validador from "@Componentes/_Validador";
import MiPanelMensaje from "@Componentes/MiPanelMensaje";
import MiBanerError from "@Componentes/MiBanerError";
import MiDialogoNumeroTramiteAyuda from "../../_Dialogos/DialogoNumeroTramiteAyuda";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

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

    this.state = {
      errorEstadosCiviles: undefined,
      validandoUsuario: false,
      errorValidandoUsuario: undefined,
      nombre: datosIniciales.nombre || "",
      apellido: datosIniciales.apellido || "",
      dni: datosIniciales.dni || "",
      fechaNacimiento: datosIniciales.fechaNacimiento || null,
      fechaNacimientoKeyPress: false,
      sexo: datosIniciales.sexoMasculino || true ? "m" : "f",
      numeroTramite: datosIniciales.numeroTramite || "",
      errores: [],
      error: undefined,
      mostrarError: false
    };
  }

  componentDidMount() {}

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

  onInputSexoChange = e => {
    this.setState({ sexo: e.target.value });
  };

  onBotonSiguienteClick = async () => {
    const { nombre, apellido, dni, fechaNacimiento, sexo, numeroTramite } = this.state;

    let errores = [];
    errores["nombre"] = Validador.validar([Validador.requerido, Validador.min(nombre, 3), Validador.max(nombre, 50)], nombre);
    errores["apellido"] = Validador.validar([Validador.requerido, Validador.min(apellido, 3), Validador.max(apellido, 50)], apellido);
    errores["dni"] = Validador.validar([Validador.requerido, Validador.numericoEntero, Validador.min(dni, 7), Validador.max(dni, 8)], dni);
    errores["fechaNacimiento"] = fechaNacimiento == undefined || fechaNacimiento == null ? "Dato requerido" : undefined;

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
    this.setState({ mostrarError: false }, async () => {
      try {
        await Rules_Usuario.validarRenaper({
          nombre: nombre,
          apellido: apellido,
          dni: dni,
          fechaNacimiento: this.convertirFechaNacimientoString(fechaNacimiento),
          sexoMasculino: sexo == "m",
          numeroTramite: numeroTramite == "" ? null : numeroTramite
        });
        this.props.onReady({
          nombre: nombre,
          apellido: apellido,
          dni: dni,
          fechaNacimiento: fechaNacimiento,
          sexoMasculino: sexo,
          numeroTramite: numeroTramite == "" ? null : numeroTramite
        });
        this.props.onCargando(false);
      } catch (ex) {
        let mensaje = typeof ex === "object" ? ex.message : ex;
        this.setState({ error: mensaje, mostrarError: true });
        this.props.onCargando(false);
      }
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

  onBotonAyudaNumeroTramiteClick = () => {
    this.setState({ dialogoInfoNumeroTramiteVisible: true });
  };

  onDialogoInfoNumeroTramiteClose = () => {
    this.setState({ dialogoInfoNumeroTramiteVisible: false });
  };

  render() {
    const { classes } = this.props;

    if (this.state.errorEstadosCiviles != undefined) {
      return (
        <div className={classes.root}>
          <MiPanelMensaje mensaje="Error inicializando los datos" icono="error" iconoColor="red" />;
        </div>
      );
    }

    return (
      <div className={classes.root}>
        {this.renderContent()}
        {this.renderFooter()}
        {this.renderDialogos()}
      </div>
    );
  }

  onBanerClose = () => {
    this.setState({ mostrarError: false });
  };
  renderContent() {
    const { classes } = this.props;
    let { mostrarError, error } = this.state;

    return (
      <div className={classes.root}>
        {/* Error  */}
        <MiBanerError visible={mostrarError} mensaje={error} onClose={this.onBanerClose} />

        {/* Contenido */}
        <div className={classes.content}>
          <Grid container spacing={16}>
            <Grid item xs={12} />
            <Grid item xs={12}>
              <div className={classes.encabezado}>
                <Typography variant="headline">Nuevo Usuario</Typography>
                <Icon>keyboard_arrow_right</Icon>
                <Typography variant="subheading">Datos personales</Typography>
              </div>
            </Grid>
            <Grid item xs={12} />

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                error={this.state.errores["nombre"] !== undefined}
                helperText={this.state.errores["nombre"]}
                label="Nombre"
                variant="outlined"
                autoFocus
                autoComplete="off"
                value={this.state.nombre}
                name="nombre"
                inputProps={{
                  maxLength: 30
                }}
                type="text"
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                error={this.state.errores["apellido"] !== undefined}
                helperText={this.state.errores["apellido"]}
                label="Apellido"
                autoComplete="off"
                id="inputApellido"
                value={this.state.apellido}
                name="apellido"
                inputProps={{
                  maxLength: 30
                }}
                type="text"
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                error={this.state.errores["dni"] !== undefined}
                helperText={this.state.errores["dni"]}
                label="N° de Documento"
                id="inputDni"
                variant="outlined"
                autoComplete="off"
                value={this.state.dni}
                name="dni"
                type="number"
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                keyboard
                variant="outlined"
                fullWidth
                error={this.state.errores["fechaNacimiento"] !== undefined}
                helperText={this.state.errores["fechaNacimiento"]}
                margin="dense"
                label="Fecha de nacimiento"
                openToYearSelection={true}
                disableFuture={true}
                format="dd/MM/yyyy"
                labelFunc={this.renderLabelFecha}
                invalidDateMessage="Fecha inválida"
                maxDateMessage="Fecha inválida"
                minDateMessage="Fecha inválida"
                mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                value={this.state.fechaNacimiento || null}
                onChange={this.onInputFechaNacimientoChange}
                disableOpenOnEnter
                animateYearScrolling={false}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Sexo</FormLabel>
                <RadioGroup
                  aria-label="Sexo"
                  name="sexo"
                  margin="dense"
                  style={{ flexDirection: "row" }}
                  value={this.state.sexo}
                  onChange={this.onInputSexoChange}
                >
                  <FormControlLabel value="m" control={<Radio />} label="Masculino" />
                  <FormControlLabel value="f" control={<Radio />} label="Femenino" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <div className={classes.contenedorInfo}>
                <IconInfoOutlined />
                <Typography variant="body1" className="texto">
                  El Nº de trámite es un dato opcional, pero algunas gestiones pueden requerirlo.
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                error={this.state.errores["numeroTramite"] !== undefined}
                helperText={this.state.errores["numeroTramite"]}
                label="N° de Tramite"
                variant="outlined"
                autoComplete="off"
                value={this.state.numeroTramite}
                name="numeroTramite"
                type="text"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="Ayuda" onClick={this.onBotonAyudaNumeroTramiteClick}>
                        <IconHelpOutlined />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
              />
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

        <Button variant="contained" color="primary" className={classes.button} onClick={this.onBotonSiguienteClick}>
          Siguiente
        </Button>
      </div>
    );
  }

  renderDialogos() {
    return (
      <MiDialogoNumeroTramiteAyuda
        onClose={this.onDialogoInfoNumeroTramiteClose}
        visible={this.state.dialogoInfoNumeroTramiteVisible || false}
      />
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
