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
import { Typography, Icon, Button, Grid, IconButton } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import _ from "lodash";

//Mis componentes
import MiBanerError from "@Componentes/MiBanerError";
import Validador from "@Componentes/_Validador";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaDatosAcceso extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onReady: () => {}
  };

  constructor(props) {
    super(props);

    let datosIniciales = props.datosIniciales || {};

    this.state = {
      username: datosIniciales.username || "",
      password: datosIniciales.password || "",
      passwordRepeat: datosIniciales.password || "",
      mostrarError: false,
      error: undefined,
      errores: [],
      showPassword: false,
      showPasswordRepeat: false
    };
  }

  componentDidMount() {}

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
    const { username, password, passwordRepeat } = this.state;

    let errores = [];
    errores["username"] = Validador.validar(
      [
        // Validador.requerido,
        Validador.min(username, 8),
        Validador.max(username, 20)
      ],
      username
    );

    errores["password"] = Validador.validar([Validador.requerido, Validador.min(password, 8), Validador.max(password, 20)], password);

    errores["passwordRepeat"] = Validador.validar(
      [Validador.requerido, Validador.min(passwordRepeat, 8), Validador.max(passwordRepeat, 20)],
      passwordRepeat
    );

    //Si hay errores, corto aca
    this.setState({ errores: errores });

    let conError = false;
    for (var prop in errores) {
      if (errores.hasOwnProperty(prop) && errores[prop] != undefined) {
        conError = true;
      }
    }

    if (conError) return;

    if (password != passwordRepeat) {
      errores["password"] = "Las contraseñas no coinciden";
      this.setState({ errores: errores });
      return;
    }

    this.props.onCargando(true);
    this.setState({ mostrarError: false }, () => {
      if (username && username !== "") {
        Rules_Usuario.validarUsername(username)
          .then(existe => {
            if (existe === true) {
              this.setState({
                mostrarError: true,
                error: "El nombre de usuario ya se encuentra en uso"
              });
              return;
            }

            this.props.onReady({
              username: username,
              password: password
            });
          })
          .catch(error => {
            this.setState({ mostrarError: true, error: error });
          })
          .finally(() => {
            this.props.onCargando(false);
          });
      } else {
        this.props.onReady({
          username: "",
          password: password
        });
        this.props.onCargando(false);
      }
    });
  };

  onBotonShowPasswordClick = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  onBotonShowPasswordRepeatClick = () => {
    this.setState({ showPasswordRepeat: !this.state.showPasswordRepeat });
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
    const { classes } = this.props;

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

        <div className={classes.content}>
          {/* Contenido  */}
          <div>
            <Grid container spacing={16}>
              <Grid item xs={12} />
              <Grid item xs={12}>
                <div className={classes.encabezado}>
                  <Typography variant="headline">Nuevo Usuario</Typography>
                  <Icon>keyboard_arrow_right</Icon>
                  <Typography variant="subheading">Datos de acceso</Typography>
                </div>
              </Grid>
              <Grid item xs={12} />

              <Grid item xs={12}>
                <div className={classes.contenedorInfoRenaper}>
                  <Icon>check_circle</Icon>
                  <Typography variant="body1" className="texto">
                    Sus datos han sido validados correctamente con el Registro Nacional de Personas
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="inputUsername"
                  margin="dense"
                  autoFocus
                  autoComplete="off"
                  variant="outlined"
                  label="Nombre de usuario"
                  inputProps={{
                    maxLength: 20
                  }}
                  error={this.state.errores["username"] !== undefined}
                  helperText={this.state.errores["username"]}
                  value={this.state.username}
                  name="username"
                  type="text"
                  onKeyPress={this.onInputKeyPress}
                  onChange={this.onInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <div className={classes.contenedorInfoUsername}>
                  <Icon>info</Icon>
                  <Typography variant="body1" className="texto">
                    Su nombre de usuario por defecto es su número de CUIL pero, si usted lo desea, puede indicar uno. Tenga en cuenta que si
                    lo hace, usted todavía podrá acceder con su número de CUIL.
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} />
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="inputPassword"
                  margin="dense"
                  variant="outlined"
                  label="Contraseña"
                  inputProps={{
                    maxLength: 20
                  }}
                  error={this.state.errores["password"] !== undefined}
                  helperText={this.state.errores["password"]}
                  value={this.state.password}
                  name="password"
                  type={this.state.showPassword ? "text" : "password"}
                  onKeyPress={this.onInputKeyPress}
                  onChange={this.onInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="Toggle password visibility" onClick={this.onBotonShowPasswordClick} tabIndex="-1">
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="inputPasswordRepeat"
                  margin="dense"
                  variant="outlined"
                  label="Repita su contraseña"
                  inputProps={{
                    maxLength: 20
                  }}
                  error={this.state.errores["passwordRepeat"] !== undefined}
                  helperText={this.state.errores["passwordRepeat"]}
                  value={this.state.passwordRepeat}
                  name="passwordRepeat"
                  type={this.state.showPasswordRepeat ? "text" : "password"}
                  onKeyPress={this.onInputKeyPress}
                  onChange={this.onInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="Toggle password visibility" onClick={this.onBotonShowPasswordRepeatClick} tabIndex="-1">
                          {this.state.showPasswordRepeat ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </div>
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
}

let componente = PaginaDatosAcceso;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
