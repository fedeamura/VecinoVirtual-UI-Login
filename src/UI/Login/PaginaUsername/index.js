import React from "react";
import { withStyles } from "@material-ui/core/styles";

//REDUX
import { connect } from "react-redux";

//Componentes
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconDNI from "mdi-material-ui/AccountCardDetails";

//Mis componentes
import Validador from "@Componentes/_Validador";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaUsername extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.username,
      error: undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.username != this.props.username) {
      this.setState({ username: nextProps.username });
    }
  }

  onBotonSiguienteClick = () => {
    let { username } = this.state;

    let errorUsername = Validador.validar([Validador.requerido, Validador.min(username, 5), Validador.max(username, 20)], username);
    this.setState({ error: errorUsername });

    if (errorUsername != undefined) return;

    this.props.onCargando(true);
    this.setState({ error: undefined }, () => {
      Rules_Usuario.getInfoPublica(username)
        .then(data => {
          Rules_Usuario.guardarUsuarioReciente(data);
          this.props.onBotonSiguienteClick(data);
        })
        .catch(error => {
          this.setState({ error: error });
        })
        .finally(() => {
          this.props.onCargando(false);
        });
    });
  };

  onBotonGenerarCuilClick = () => {
    this.props.onBotonGenerarCuil();
  };

  onInputChange = event => {
    this.setState({
      error: undefined,
      [event.target.name]: event.target.value
    });
  };

  onInputKeyPress = event => {
    if (event.key === "Enter") {
      this.onBotonSiguienteClick();
    }
  };

  render() {
    const { classes, padding } = this.props;

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
          <Grid item xs={12} />

          <Grid item xs={12}>
            <Typography variant="title">Iniciar Sesión</Typography>
          </Grid>
          <Grid item xs={12} />

          <Grid item xs={12}>
            <TextField
              fullWidth
              autoFocus
              name="username"
              margin="dense"
              variant="outlined"
              error={this.state.error !== undefined}
              helperText={this.state.error}
              label="CUIL o Nombre de Usuario"
              inputProps={{
                maxLength: 20
              }}
              value={this.state.username}
              onKeyPress={this.onInputKeyPress}
              onChange={this.onInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="text" color="primary" onClick={this.onBotonGenerarCuilClick}>
              ¿No recordás tu CUIL?
            </Button>
          </Grid>

          <Grid item xs={12}>
            <div style={{ width: "100%", backgroundColor: "rgba(0,0,0,0.1)", height: "1px", marginTop: "16px", marginBottom: "16px" }} />
          </Grid>
          <Grid item xs={12} className={classes.fixPadding} style={{ marginBottom: "16px" }}>
            <Button variant="outlined" color="primary" onClick={this.props.onBotonLoginDniClick}>
              <IconDNI style={{ marginRight: 8 }} />
              Acceder con DNI
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
          <Button variant="text" color="primary" className={classes.button} onClick={this.props.onBotonNuevoUsuarioClick}>
            Nuevo usuario
          </Button>
        </div>

        <Button variant="contained" color="primary" className={classes.button} onClick={this.onBotonSiguienteClick}>
          Siguiente
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

let componente = PaginaUsername;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
