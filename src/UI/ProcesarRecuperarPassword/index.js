import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

//Styles
import "@UI/transitions.css";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

//Componentes
import { Typography, Icon, Button } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Grid } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import red from "@material-ui/core/colors/red";
import Lottie from "react-lottie";
import * as animExito from "@Resources/animaciones/anim_success.json";

//Mis componentes
import MiCard from "@Componentes/MiCard";
import ContentSwapper from "@Componentes/ContentSwapper";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const opcionesAnimExito = {
  loop: false,
  autoplay: true,
  animationData: animExito,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  }
});

const mapStateToProps = state => {
  return {};
};

const padding = "2rem";

class ProcesarRecuperarPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      codigo: props.location.search.split("codigo=")[1],
      validandoCodigo: true,
      cargando: false,
      password: "",
      passwordRepeat: "",
      errorPassword: undefined,
      errorPasswordRepeat: undefined,
      showPassword: false,
      showPasswordRepeat: false,
      visible: false,
      paginaPasswordVisible: true,
      paginaOkVisible: false,
      paginaErrorVisible: false,
      urlRetorno: ""
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ visible: true });
    }, 500);

    this.setState({ validandoCodigo: true }, () => {
      Rules_Usuario.getRecuperacionCuenta(this.state.codigo)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          this.setState({ errorValidandoCodigo: error });
        })
        .finally(() => {
          this.setState({ validandoCodigo: false });
        });
    });
  }

  onBotonShowPasswordClick = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  onBotonShowPasswordRepeatClick = () => {
    this.setState({ showPasswordRepeat: !this.state.showPasswordRepeat });
  };

  onInputChange = event => {
    this.setState({
      error: undefined,
      [event.target.name]: event.target.value
    });
  };

  onInputKeyPress = event => {
    if (event.key === "Enter") {
      this.recuperarPassword();
    }
  };

  recuperarPassword = () => {
    const { password, passwordRepeat } = this.state;

    this.setState({
      errorPassword: undefined,
      errorPasswordRepeat: undefined
    });

    if (password.length < 8) {
      this.setState({
        errorPassword: "Mínimo 8 caracteres"
      });
      return;
    }

    if (password != passwordRepeat) {
      this.setState({
        errorPasswordRepeat: "Las contraseñas no coinciden"
      });
      return;
    }

    this.setState({ cargando: true }, () => {
      Rules_Usuario.procesarRecuperarPassword({
        codigo: this.state.codigo,
        password: password
      })
        .then(data => {
          this.setState({
            urlRetorno: data,
            cargando: false,
            paginaPasswordVisible: false,
            paginaOkVisible: true,
            paginaErrorVisible: false
          });
        })
        .catch(error => {
          this.setState({
            error: error,
            cargando: false,
            paginaPasswordVisible: false,
            paginaOkVisible: false,
            paginaErrorVisible: true
          });
        });
    });
  };

  onBotonReintentarClick = () => {
    this.setState({
      paginaErrorVisible: false,
      paginaPasswordVisible: true,
      paginaOkVisible: false
    });
  };

  onBotonInicioClick = () => {
    window.location = this.state.urlRetorno;
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiCard
            padding={false}
            rootClassName={classNames(
              classes.cardRoot,
              this.state.visible && "visible"
            )}
            className={classNames(classes.cardContent)}
          >
            <LinearProgress
              className={classNames(
                classes.progress,
                this.state.cargando && "visible"
              )}
            />

            <div className={classes.header} style={{ padding: padding }}>
              <div className={classes.imagenLogoMuni} />
              <div className={classes.contenedorTextosSistema}>
                <Typography variant="headline">Vecino Virtual</Typography>
                <Typography variant="title">Cambiar contraseña</Typography>
              </div>
            </div>

            {this.renderContent()}

            <div
              className={classNames(
                classes.overlayCargando,
                this.state.cargando && "visible"
              )}
            />
          </MiCard>
        </div>
      </React.Fragment>
    );
  }

  renderContent() {
    const { classes } = this.props;

    return (
      <div className={classes.content}>
        <ContentSwapper
          transitionName="cross-fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          className={classes.contentSwapper}
        >
          <div
            key="paginaPassword"
            style={{ height: "100%", width: "100%", display: "flex" }}
            visible={"" + this.state.paginaPasswordVisible}
          >
            {this.renderPaginaPassword()}
          </div>
          <div
            key="paginaOk"
            style={{ height: "100%", width: "100%", display: "flex" }}
            visible={"" + this.state.paginaOkVisible}
          >
            {this.renderPaginaOk()}
          </div>
          <div
            key="paginaError"
            style={{ height: "100%", width: "100%", display: "flex" }}
            visible={"" + this.state.paginaErrorVisible}
          >
            {this.renderPaginaError()}
          </div>
        </ContentSwapper>
      </div>
    );
  }

  renderPaginaPassword() {
    const { classes } = this.props;

    if (this.state.errorValidandoCodigo !== undefined) {
      return this.renderErrorValidandoCodigo();
    }

    return (
      <div className={classes.content}>
        {this.renderPaginaPasswordMain()}
        {this.renderPaginaPasswordFooter()}
      </div>
    );
  }

  renderPaginaPasswordMain() {
    if (this.state.validandoCodigo === true) return null;

    const { classes } = this.props;

    return (
      <div className={classes.mainContent} style={{ padding: padding }}>
        <Grid container>
          <Grid item xs={12} className={classes.fixPadding}>
            <FormControl
              className={classes.formControl}
              fullWidth
              margin="normal"
              error={this.state.errorPassword !== undefined}
              aria-describedby="textoPasswordError"
            >
              <InputLabel htmlFor="inputPassword">Contraseña</InputLabel>
              <Input
                id="inputPassword"
                autoFocus
                value={this.state.password}
                name="password"
                type={this.state.showPassword ? "text" : "password"}
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.onBotonShowPasswordClick}
                    >
                      {this.state.showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText id="textoPasswordError">
                {this.state.errorPassword}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} className={classes.fixPadding}>
            <FormControl
              className={classes.formControl}
              fullWidth
              margin="normal"
              error={this.state.errorPasswordRepeat !== undefined}
              aria-describedby="textoPasswordRepeatError"
            >
              <InputLabel htmlFor="inputPasswordRepeat">
                Repetita la contraseña
              </InputLabel>
              <Input
                id="inputPasswordRepeat"
                value={this.state.passwordRepeat}
                name="passwordRepeat"
                type={this.state.showPasswordRepeat ? "text" : "password"}
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.onBotonShowPasswordRepeatClick}
                    >
                      {this.state.showPasswordRepeat ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText id="textoPasswordRepeatError">
                {this.state.errorPasswordRepeat}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </div>
    );
  }

  renderErrorValidandoCodigo() {
    const { classes } = this.props;

    return (
      <div className={classes.contenedorError} style={{ padding: padding }}>
        <Icon className={classes.iconoError} style={{ color: red["500"] }}>
          error
        </Icon>
        <Typography variant="headline" className={classes.textoError}>
          {this.state.errorValidandoCodigo || "Error procesando la solicitud"}
        </Typography>
      
      </div>
    );
  }
  
  renderPaginaPasswordFooter() {
    const { classes } = this.props;

    return (
      <div
        className={classes.footer}
        style={{
          padding: padding,
          paddingBottom: "16px",
          paddingTop: "16px"
        }}
      >
        <div style={{ flex: 1 }} />

        <Button
          variant="raised"
          color="primary"
          className={classes.button}
          onClick={this.recuperarPassword}
        >
          Recuperar contraseña
        </Button>
      </div>
    );
  }

  renderPaginaOk() {
    const { classes } = this.props;

    return (
      <div className={classes.contenedorOk}>
        {this.renderPaginaOkContent()}
        {this.renderPaginaOkFooter()}
      </div>
    );
  }

  renderPaginaOkContent() {
    const { classes } = this.props;

    return (
      <div className={classes.contenedorOkContent} style={{ padding: padding }}>
        <Lottie
          options={opcionesAnimExito}
          height={150}
          width={150}
          style={{ minHeight: "150px" }}
        />

        <Typography variant="headline" className={classes.textoOk}>
          Su contraseña ha sido modificada correctamente
        </Typography>
      </div>
    );
  }
  renderPaginaOkFooter() {
    const { classes } = this.props;

    return (
      <div
        className={classes.footer}
        style={{
          padding: padding,
          paddingBottom: "16px",
          paddingTop: "16px"
        }}
      >
        <div style={{ flex: 1 }} />

        <Button
          variant="raised"
          color="primary"
          className={classes.button}
          onClick={this.onBotonInicioClick}
        >
          Ir a inicio
        </Button>
      </div>
    );
  }

  renderPaginaError() {
    const { classes } = this.props;

    return (
      <div className={classes.contenedorError} style={{ padding: padding }}>
        <Icon className={classes.iconoError} style={{ color: red["500"] }}>
          error
        </Icon>
        <Typography variant="headline" className={classes.textoError}>
          {this.state.error || "Error procesando la solicitud"}
        </Typography>
        <Button
          variant="outlined"
          style={{ marginTop: "16px" }}
          onClick={this.onBotonReintentarClick}
        >
          Reintentar
        </Button>
      </div>
    );
  }
}

let componente = ProcesarRecuperarPassword;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
