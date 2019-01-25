import React from "react";
import { withStyles } from "@material-ui/core/styles";

//Styles
import "@UI/transitions.css";
import styles from "./styles";

//Componentes
import { Typography, Icon, Button, Grid } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import red from "@material-ui/core/colors/red";

//Mis componentes
import MiBanerError from "@Componentes/MiBanerError";
import Validador from "@Componentes/_Validador";

//REDUX
import { connect } from "react-redux";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaGenerarCUIL extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onCuil: () => {},
    onBotonVolverClick: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      dni: "",
      errorDni: undefined,
      sexo: "m",
      errorSexo: undefined,
      mostrarError: false,
      error: undefined
    };
  }

  onBotonGenerarClick = () => {
    let { dni } = this.state;

    this.setState({ errorDni: undefined, mostrarError: false });

    let errorDni = Validador.validar([Validador.requerido, Validador.numericoEntero, Validador.min(dni, 7), Validador.max(dni, 8)], dni);

    if (errorDni != undefined) {
      this.setState({ errorDni: errorDni });
      return;
    }

    let comando = {
      dni: this.state.dni,
      sexoMasculino: this.state.sexo === "m"
    };

    this.props.onCargando(true);
    Rules_Usuario.generarCuil(comando)
      .then(cuil => {
        if (cuil == undefined || cuil == "") {
          this.setState({
            mostrarError: true,
            error: "Error procesando la solicitud"
          });
          return;
        }

        this.props.onCuilGenerado(cuil);
      })
      .catch(error => {
        this.setState({
          mostrarError: true,
          error: error
        });
      })
      .finally(() => {
        this.props.onCargando(false);
      });
  };

  onInputChange = event => {
    this.setState({
      errorDni: undefined,
      [event.target.name]: event.target.value
    });
  };

  onInputKeyPress = event => {
    if (event.key === "Enter") {
      this.onBotonGenerarClick();
    }
  };

  onSexoChange = event => {
    this.setState({ errorSexo: undefined, sexo: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.renderPaginaFormContent()}
        {this.renderPaginaFormFooter()}
      </div>
    );
  }

  renderPaginaFormContent() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <MiBanerError
          visible={this.state.mostrarError}
          onClose={() => {
            this.setState({ mostrarError: false });
          }}
          mensaje={this.state.error}
        />

        <div className={classes.content}>
          <Grid container spacing={16}>
            <Grid item xs={12} />
            <Grid item xs={12} />

            <Grid item xs={12}>
              <Typography variant="title">Generar CUIL</Typography>
            </Grid>
            <Grid item xs={12} />

            <Grid item xs={12}>
              <TextField
                fullWidth
                autoFocus
                margin="dense"
                variant="outlined"
                autoComplete="off"
                error={this.state.errorDni !== undefined}
                helperText={this.state.errorDni}
                label="N° de Documento"
                id="inputDni"
                autoFocus
                value={this.state.password}
                name="dni"
                type="number"
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                className={classes.formControl}
                fullWidth
                margin="normal"
                error={this.state.errorSexo !== undefined}
                aria-describedby="textoSexoError"
              >
                <FormLabel component="legend">Sexo</FormLabel>
                <RadioGroup
                  aria-label="Gender"
                  name="gender1"
                  style={{ display: "flex", flexDirection: "row" }}
                  className={classes.group}
                  value={this.state.sexo}
                  onChange={this.onSexoChange}
                >
                  <FormControlLabel value="m" control={<Radio />} label="Masculino" />

                  <FormControlLabel value="f" control={<Radio />} label="Femenino" />
                </RadioGroup>
                {this.state.errorSexo != undefined && <FormHelperText>{this.state.errorSexo}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
  renderPaginaFormFooter() {
    const { classes } = this.props;

    return (
      <div className={classes.footer}>
        <div style={{ flex: 1 }}>
          <Button variant="text" color="primary" className={classes.button} onClick={this.props.onBotonVolverClick}>
            Volver
          </Button>
        </div>

        <Button variant="contained" color="primary" className={classes.button} onClick={this.onBotonGenerarClick}>
          Obtener CUIL
        </Button>
      </div>
    );
  }

  renderPaginaError() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.renderPaginaErrorContent()}
        {this.renderPaginaErrorFooter()}
      </div>
    );
  }

  renderPaginaErrorContent() {
    const { classes } = this.props;

    return (
      <div className={classes.contenedorError}>
        <Icon className={classes.iconoError} style={{ color: red["500"] }}>
          error
        </Icon>
        <Typography variant="headline" className={classes.textoError}>
          {this.state.error || "Error procesando la solicitud"}
        </Typography>
        <Button variant="outlined" style={{ marginTop: "16px" }} onClick={this.onBotonGenerarClick}>
          Reintentar
        </Button>
      </div>
    );
  }

  renderPaginaErrorFooter() {
    const { classes } = this.props;

    return (
      <div className={classes.footer}>
        <div style={{ flex: 1 }}>
          <Button variant="text" color="primary" className={classes.button} onClick={this.props.onBotonVolverClick}>
            Volver
          </Button>
        </div>
      </div>
    );
  }
}

let componente = PaginaGenerarCUIL;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
