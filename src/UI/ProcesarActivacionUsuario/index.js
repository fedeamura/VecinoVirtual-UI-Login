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

class ProcesarActivacionUsuario extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.location.search.split("codigo=")[1]);
    this.state = {
      codigo: props.location.search.split("codigo=")[1],
      validandoCodigo: true,
      visible: false,
      paginaOkVisible: false,
      paginaErrorVisible: false,
      urlRetorno: ""
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ visible: true });
    }, 500);

    this.procesar();
  }

  procesar = () => {
    this.setState({ cargando: true }, () => {
      Rules_Usuario.procesarActivacionUsuario(this.state.codigo)
        .then(data => {
          this.setState({
            urlRetorno: data,
            error: undefined,
            paginaOkVisible: true,
            paginaErrorVisible: false
          });
        })
        .catch(error => {
          this.setState({
            error: error,
            paginaOkVisible: false,
            paginaErrorVisible: true
          });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  onBotonReintentarClick = () => {
    this.procesar();
  };

  onBotonAceptarClick = () => {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        window.location = this.state.urlRetorno;
      }, 500);
    });
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
                <Typography variant="title">Validar e-mail</Typography>
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
          E-mail validado correctamente
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
          onClick={this.onBotonAceptarClick}
        >
          Aceptar
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

let componente = ProcesarActivacionUsuario;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
