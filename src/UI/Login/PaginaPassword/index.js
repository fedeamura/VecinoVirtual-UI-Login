import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

//REDUX
import { connect } from "react-redux";

//Componentes
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

//Mis componentes
import HintUsuarioSeleccionado from "./HintUsuarioSeleccionado";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const mapDispatchToProps = dispatch => ({});
const mapStateToProps = state => {
  return {};
};

class PaginaPassword extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onLogin: () => {},
    onUsuarioNoValidado: () => {}
  };

  static propTypes = {
    onCargando: PropTypes.func,
    onLogin: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      password: "",
      error: undefined,
      showPassword: false
    };
  }

  onBotonAccederClick = () => {
    const username = this.props.dataUsuario.username;
    const password = this.state.password;

    this.props.onCargando(true);
    this.setState({ error: undefined }, async () => {
      try {
        let validado = await Rules_Usuario.validarUsuarioActivadoByUserPass(username, password);
        if (validado === false) {
          this.props.onCargando(false);
          this.props.onUsuarioNoValidado(username, password);
          return;
        }

        let data = await Rules_Usuario.acceder(username, password);
        this.props.onCargando(false);
        this.props.onLogin(data);
      } catch (ex) {
        let mensaje = typeof ex == "object" ? ex.message : ex;
        this.setState({ error: mensaje });
        this.props.onCargando(false);
      }
    });
  };

  onInputChange = event => {
    this.setState({
      error: undefined,
      [event.target.name]: event.target.value
    });
  };

  onInputKeyPress = event => {
    if (event.key === "Enter") {
      this.onBotonAccederClick();
    }
  };

  onBotonShowPasswordClick = () => {
    this.setState({ showPassword: !this.state.showPassword });
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
      <div className={classes.content}>
        <Grid container spacing={16}>
          <Grid item xs={12} />
          <Grid item xs={12}>
            <HintUsuarioSeleccionado
              dataUsuario={this.props.dataUsuario}
              onBotonVerUsuariosRecientesClick={this.props.onBotonVerUsuariosRecientesClick}
            />
          </Grid>
          <Grid item xs={12} />
          <Grid item xs={12}>
            <TextField
              fullWidth
              autoFocus
              label="Contraseña"
              margin="dense"
              variant="outlined"
              error={this.state.error !== undefined}
              helperText={this.state.error}
              name="password"
              type={this.state.showPassword ? "text" : "password"}
              onKeyPress={this.onInputKeyPress}
              onChange={this.onInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="Toggle password visibility" onClick={this.onBotonShowPasswordClick}>
                      {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="text" color="primary" onClick={this.props.onBotonRecuperarPassword}>
              ¿No recordás tu contraseña?
            </Button>
          </Grid>
        </Grid>
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

        <Button variant="contained" color="primary" className={classes.button} onClick={this.onBotonAccederClick}>
          Acceder
        </Button>
      </div>
    );
  }
}

const styles = theme => {
  return {
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      height: "100%"
    },
    content: {
      flex: 1,
      overflow: "auto",
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing.unit * 4,
        paddingRight: theme.spacing.unit * 4
      }
    },
    botonRecuperarCUIL: {
      cursor: "pointer",
      textDecoration: "underline",
      color: theme.palette.primary.main
    },

    footer: {
      borderTop: "1px solid rgba(0,0,0,0.1)",
      display: "flex",
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing.unit * 4,
        paddingRight: theme.spacing.unit * 4
      }
    }
  };
};

let componente = PaginaPassword;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
