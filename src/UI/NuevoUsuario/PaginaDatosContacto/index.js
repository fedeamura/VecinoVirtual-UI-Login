import React from "react";
import { loadCSS } from "fg-loadcss/src/loadCSS";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";

//Componentes
import { Typography, Icon, Button, Grid, IconButton } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import _ from "lodash";

//Mis componentes
import Validador from "@Componentes/_Validador";
import MiBanerError from "@Componentes/MiBanerError";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaDatosContacto extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onReady: () => {}
  };

  constructor(props) {
    super(props);

    let datosIniciales = props.datosIniciales || {};

    this.state = {
      email: datosIniciales.email || "",
      emailRepeat: datosIniciales.email || "",
      telefonoCelularArea: datosIniciales.telefonoCelularArea || "",
      telefonoCelularNumero: datosIniciales.telefonoCelularNumero || "",
      telefonoFijoArea: datosIniciales.telefonoFijoArea || "",
      telefonoFijoNumero: datosIniciales.telefonoFijoNumero || "",
      facebook: datosIniciales.facebook || "",
      twitter: datosIniciales.twitter || "",
      instagram: datosIniciales.instagram || "",
      linkedin: datosIniciales.linkedin || "",
      mostrarError: false,
      error: undefined,
      errores: []
    };
  }

  componentDidMount() {
    loadCSS("https://use.fontawesome.com/releases/v5.3.1/css/all.css", document.querySelector("#insertion-point-jss"));
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

  onBotonSiguienteClick = () => {
    const {
      email,
      emailRepeat,
      telefonoCelularArea,
      telefonoCelularNumero,
      telefonoFijoArea,
      telefonoFijoNumero,
      facebook,
      twitter,
      instagram,
      linkedin
    } = this.state;

    this.setState({ errores: [] });

    //Email
    let errores = this.state.errores;
    errores["email"] = Validador.validar([Validador.requerido, Validador.min(email, 5), Validador.max(email, 40), Validador.email], email);

    //Repetir email
    errores["emailRepeat"] = Validador.validar(
      [
        Validador.requerido,
        Validador.min(emailRepeat, 5),
        Validador.max(emailRepeat, 40),
        Validador.email,
        Validador.iguales(emailRepeat, email)
      ],
      emailRepeat
    );

    // Telefono Celular

    //Celular area
    errores["telefonoCelularArea"] = Validador.validar(
      [Validador.min(telefonoCelularArea, 2), Validador.max(telefonoCelularArea, 4), Validador.numericoEntero],
      telefonoCelularArea
    );

    //Celular numero
    errores["telefonoCelularNumero"] = Validador.validar(
      [Validador.min(telefonoCelularNumero, 4), Validador.max(telefonoCelularNumero, 8), Validador.numericoEntero],
      telefonoCelularNumero
    );

    //Si no tiene errores en el telefono valido que si ingreso uno de los 2, este el otro
    if (errores["telefonoCelularArea"] == undefined && errores["telefonoCelularNumero"] == undefined) {
      if ((telefonoCelularArea != "") != (telefonoCelularNumero != "")) {
        errores[telefonoCelularArea != "" ? "telefonoCelularNumero" : "telefonoCelularArea"] = "Dato requerido";
      }
    }

    // Telefono Fijo

    //Fijo Area
    errores["telefonoFijoArea"] = Validador.validar(
      [Validador.min(telefonoFijoArea, 2), Validador.max(telefonoFijoArea, 4), Validador.numericoEntero],
      telefonoFijoArea
    );

    //Fijo numero
    errores["telefonoFijoNumero"] = Validador.validar(
      [Validador.min(telefonoFijoNumero, 4), Validador.max(telefonoFijoNumero, 8), Validador.numericoEntero],
      telefonoFijoNumero
    );

    //Si no tiene errores en el telefono valido que si ingreso uno de los 2, este el otro
    if (errores["telefonoFijoArea"] == undefined && errores["telefonoFijoNumero"] == undefined) {
      if ((telefonoFijoArea != "") != (telefonoFijoNumero != "")) {
        errores[telefonoFijoArea != "" ? "telefonoFijoNumero" : "telefonoFijoArea"] = "Dato requerido";
      }
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

    //Valido que tenga algun telefono de contacto
    if ((telefonoFijoArea == undefined || telefonoFijoNumero == "") && (telefonoCelularArea == undefined || telefonoCelularNumero == "")) {
      this.setState({
        error: "Ingrese algún teléfono de contacto",
        mostrarError: true
      });
      return;
    }

    this.props.onReady({
      email: email,
      telefonoCelularArea: telefonoCelularArea,
      telefonoCelularNumero: telefonoCelularNumero,
      telefonoFijoArea: telefonoFijoArea,
      telefonoFijoNumero: telefonoFijoNumero,
      facebook: facebook,
      twitter: twitter,
      instagram: instagram,
      instagram: instagram,
      linkedin: linkedin
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
        <div className={classes.content}>
          <div style={{ padding: padding, paddingTop: 0 }}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <div className={classes.encabezado}>
                  <Typography variant="headline">Nuevo Usuario</Typography>
                  <Icon>keyboard_arrow_right</Icon>
                  <Typography variant="subheading">Datos de contacto</Typography>
                </div>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={16}>
                  {/* Email */}
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["email"] !== undefined}
                      aria-describedby="textoEmailError"
                    >
                      <InputLabel htmlFor="inputEmail">E-mail</InputLabel>
                      <Input
                        id="inputEmail"
                        autoFocus
                        inputProps={{
                          maxLength: 50
                        }}
                        value={this.state.email}
                        name="email"
                        type="text"
                        onKeyPress={this.onInputKeyPress}
                        onChange={this.onInputChange}
                      />
                      <FormHelperText id="textoEmailError">{this.state.errores["email"]}</FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* Repetir email */}
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["emailRepeat"] !== undefined}
                      aria-describedby="textoEmailRepeatError"
                    >
                      <InputLabel htmlFor="inputEmailRepeat">Repita su e-mail</InputLabel>
                      <Input
                        id="inputEmailRepeat"
                        value={this.state.emailRepeat}
                        inputProps={{
                          maxLength: 50
                        }}
                        name="emailRepeat"
                        type="text"
                        onKeyPress={this.onInputKeyPress}
                        onChange={this.onInputChange}
                      />
                      <FormHelperText id="textoEmailRepeatError">{this.state.errores["emailRepeat"]}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Grid container spacing={16}>
                      <Grid item xs={12}>
                        <Typography variant="body2">Teléfono Celular</Typography>
                      </Grid>

                      {/* Telefono Celular */}
                      <Grid item xs={3}>
                        <FormControl
                          className={classes.formControl}
                          fullWidth
                          margin="dense"
                          error={this.state.errores["telefonoCelularArea"] !== undefined}
                          aria-describedby="textoTelefonoCelularAreaError"
                        >
                          <InputLabel htmlFor="inputTelefonoCelularArea">Area</InputLabel>
                          <Input
                            id="inputTelefonoCelularArea"
                            value={this.state.telefonoCelularArea}
                            name="telefonoCelularArea"
                            type="number"
                            onKeyPress={this.onInputKeyPress}
                            onChange={this.onInputChange}
                            startAdornment={
                              <div style={{ display: "flex" }}>
                                <InputAdornment position="start">0</InputAdornment>
                              </div>
                            }
                          />
                          <FormHelperText id="textoTelefonoCelularAreaError">{this.state.errores["telefonoCelularArea"]}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={9}>
                        <FormControl
                          className={classes.formControl}
                          fullWidth
                          margin="dense"
                          error={this.state.errores["telefonoCelularNumero"] !== undefined}
                          aria-describedby="textoTelefonoCelularNumeroError"
                        >
                          <InputLabel htmlFor="inputTelefonoCelularNumero">Número</InputLabel>
                          <Input
                            id="inputTelefonoCelularNumero"
                            value={this.state.telefonoCelularNumero}
                            name="telefonoCelularNumero"
                            type="number"
                            onKeyPress={this.onInputKeyPress}
                            onChange={this.onInputChange}
                            startAdornment={<InputAdornment position="start">15</InputAdornment>}
                          />
                          <FormHelperText id="textoTelefonoCelularNumeroError">
                            {this.state.errores["telefonoCelularNumero"]}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Grid container spacing={16}>
                      <Grid item xs={12}>
                        <Typography variant="body2">Teléfono Fijo</Typography>
                      </Grid>

                      <Grid item xs={3}>
                        <FormControl
                          className={classes.formControl}
                          fullWidth
                          margin="dense"
                          error={this.state.errores["telefonoFijoArea"] !== undefined}
                          aria-describedby="textoTelefonoFijoAreaError"
                        >
                          <InputLabel htmlFor="inputTelefonoFijoArea">Area</InputLabel>
                          <Input
                            id="telefonoFijoArea"
                            value={this.state.telefonoFijoArea}
                            name="telefonoFijoArea"
                            type="number"
                            onKeyPress={this.onInputKeyPress}
                            onChange={this.onInputChange}
                            startAdornment={
                              <div style={{ display: "flex" }}>
                                <InputAdornment position="start">0</InputAdornment>
                              </div>
                            }
                          />
                          <FormHelperText id="textoTelefonoFijoAreaError">{this.state.errores["telefonoFijoArea"]}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={9}>
                        <FormControl
                          className={classes.formControl}
                          fullWidth
                          margin="dense"
                          error={this.state.errores["telefonoFijoNumero"] !== undefined}
                          aria-describedby="textoTelefonoFijoNumeroError"
                        >
                          <InputLabel htmlFor="inputTelefonoFijoNumero">Número</InputLabel>
                          <Input
                            id="inputTelefonoFijoNumero"
                            value={this.state.telefonoFijoNumero}
                            name="telefonoFijoNumero"
                            type="number"
                            onKeyPress={this.onInputKeyPress}
                            onChange={this.onInputChange}
                          />
                          <FormHelperText id="textoTelefonoFijoNumeroError">{this.state.errores["telefonoFijoNumero"]}</FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Telefono Fijo */}
                  <Grid item xs={12}>
                    <Typography variant="body2">Redes sociales</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["facebook"] !== undefined}
                      aria-describedby="textoFacebookError"
                    >
                      <InputLabel htmlFor="inputFacebook">Facebook</InputLabel>
                      <Input
                        id="inputFacebook"
                        value={this.state.facebook}
                        name="facebook"
                        inputProps={{
                          maxLength: 20
                        }}
                        onKeyPress={this.onInputKeyPress}
                        onChange={this.onInputChange}
                        startAdornment={
                          <div style={{ display: "flex" }}>
                            <InputAdornment position="start">
                              <i style={{ fontSize: 20, color: "#3b5998" }} className={classNames("fab", "fa-facebook-square")} />
                            </InputAdornment>
                          </div>
                        }
                      />
                      <FormHelperText id="textoFacebookError">{this.state.errores["facebook"]}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["twitter"] !== undefined}
                      aria-describedby="textoTwitterError"
                    >
                      <InputLabel htmlFor="inputTwitter">Twitter</InputLabel>
                      <Input
                        id="inputTwitter"
                        value={this.state.twitter}
                        name="twitter"
                        inputProps={{
                          maxLength: 20
                        }}
                        onKeyPress={this.onInputKeyPress}
                        onChange={this.onInputChange}
                        startAdornment={
                          <div style={{ display: "flex" }}>
                            <InputAdornment position="start">
                              <i style={{ fontSize: 20, color: "#1da1f2" }} className={classNames("fab", "fa-twitter-square")} />
                            </InputAdornment>
                          </div>
                        }
                      />
                      <FormHelperText id="textoTwitterError">{this.state.errores["twitter"]}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["instagram"] !== undefined}
                      aria-describedby="textoInstagramError"
                    >
                      <InputLabel htmlFor="inputInstagram">Instagram</InputLabel>
                      <Input
                        id="inputInstagram"
                        value={this.state.instagram}
                        name="instagram"
                        inputProps={{
                          maxLength: 20
                        }}
                        onKeyPress={this.onInputKeyPress}
                        onChange={this.onInputChange}
                        startAdornment={
                          <div style={{ display: "flex" }}>
                            <InputAdornment position="start">
                              <i style={{ fontSize: 20, color: "#e56969" }} className={classNames("fab", "fa-instagram")} />
                            </InputAdornment>
                          </div>
                        }
                      />
                      <FormHelperText id="textoInstagramError">{this.state.errores["instagram"]}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      margin="dense"
                      error={this.state.errores["linkedin"] !== undefined}
                      aria-describedby="textoLinkedinError"
                    >
                      <InputLabel htmlFor="inputLinkedin">LinkedIn</InputLabel>
                      <Input
                        id="inputLinkedin"
                        value={this.state.linkedin}
                        name="linkedin"
                        inputProps={{
                          maxLength: 20
                        }}
                        onKeyPress={this.onInputKeyPress}
                        onChange={this.onInputChange}
                        startAdornment={
                          <div style={{ display: "flex" }}>
                            <InputAdornment position="start">
                              <i style={{ fontSize: 20, color: "#0077B5" }} className={classNames("fab", "fa-linkedin")} />
                            </InputAdornment>
                          </div>
                        }
                      />
                      <FormHelperText id="textoLinkedinError">{this.state.errores["linkedin"]}</FormHelperText>
                    </FormControl>
                  </Grid>
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
          {this.props.desdeQR == false && (
            <Button variant="text" color="primary" className={classes.button} onClick={this.props.onBotonVolverClick}>
              Volver
            </Button>
          )}
        </div>

        <Button variant="contained" color="primary" className={classes.button} onClick={this.onBotonSiguienteClick}>
          Siguiente
        </Button>
      </div>
    );
  }
}

let componente = PaginaDatosContacto;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
