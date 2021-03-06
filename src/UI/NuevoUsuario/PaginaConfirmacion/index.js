import React from "react";

//Styles
import { withStyles, withTheme } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";

//Componentes
import { Typography, Icon, Button, Grid } from "@material-ui/core";
import _ from "lodash";
import ReCAPTCHA from "react-google-recaptcha";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

//Mis componentes
import MiBanerError from "@Componentes/MiBanerError";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaConfirmacion extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onReady: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      mostrarError: false,
      recaptcha: undefined,
      error: undefined
    };
  }

  componentDidMount() {}

  onReCaptchaCallback = e => {
    this.setState({ recaptcha: e });
  };

  onReCaptchaError = e => {
    this.setState({ recaptcha: undefined });
  };

  onReCaptchaExpired = e => {
    this.setState({ recaptcha: undefined });
  };

  onBotonSiguienteClick = () => {
    // const { recaptcha } = this.state;

    // this.setState({
    //   mostrarError: false
    // });

    // if (recaptcha == undefined) {
    //   this.setState({
    //     mostrarError: true,
    //     error: "Debe completar el ReCAPTCHA"
    //   });
    //   return;
    // }

    this.props.onReady({
      recaptcha: ""
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

  handleChange = e => {
    this.setState({ terminos: !(this.state.terminos || false) });
  };

  renderContent() {
    const { classes, theme } = this.props;

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
          <Grid container spacing={16}>
            <Grid item xs={12} />
            <Grid item xs={12}>
              <div className={classes.encabezado}>
                <Typography variant="headline">Nuevo Usuario</Typography>
                <Icon>keyboard_arrow_right</Icon>
                <Typography variant="subheading">Confirmación</Typography>
              </div>
            </Grid>
            <Grid item xs={12} />

            {/* <Grid item xs={12}>
              <Typography variant="subheading">Por favor complete el ReCAPTCHA para verificar su identidad</Typography>
            </Grid> */}

            {/* <Grid item xs={12}>
              <ReCAPTCHA
                size="normal"
                theme="light"
                sitekey="6LcdIWAUAAAAAKck5yZmk6CIScvib081K6QvD3T1"
                onExpired={this.onReCaptchaExpired}
                onErrored={this.onReCaptchaError}
                onChange={this.onReCaptchaCallback}
              />
            </Grid>
            <Grid item xs={12} /> */}

            <Grid item xs={12}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox checked={this.state.terminos} onChange={this.handleChange} name="terminos" />
                <Typography>
                  Al hacer click en "REGISTRAR" acepto los <a className={classes.link}>términos y condiciones</a>
                </Typography>
              </div>
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

        <Button
          variant="contained"
          disabled={this.state.terminos != true}
          color="primary"
          className={classes.button}
          onClick={this.onBotonSiguienteClick}
        >
          Registrar
        </Button>
      </div>
    );
  }
}

let componente = PaginaConfirmacion;
componente = withStyles(styles)(componente);
componente = withTheme()(componente);

componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
