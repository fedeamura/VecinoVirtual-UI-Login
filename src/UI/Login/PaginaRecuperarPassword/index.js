import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

//Styles
import styles from "./styles";
import "@UI/transitions.css";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

//Componentes
import { Typography, Icon, Button } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import Lottie from "react-lottie";
import * as animExito from "@Resources/animaciones/anim_success.json";

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

class PaginaRecuperarPassword extends React.Component {
  static defaultProps = {
    onCargando: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      procesado: false,
      error: undefined
    };
  }

  componentDidMount() {
    this.procesar();
  }

  procesar = () => {
    const username = this.props.username;
    this.props.onCargando(true);
    this.setState({ cargando: true }, () => {
      Rules_Usuario.iniciarRecuperarPassword({
        username: username,
        urlRetorno: window.location.href
      })
        .then(() => {
          this.setState({ error: undefined });
        })
        .catch(error => {
          this.setState({ error: error });
        })
        .finally(() => {
          this.props.onCargando(false);
          this.setState({ cargando: false });
        });
    });
  };

  onBotonReintentarClick = () => {
    this.procesar();
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
      <div className={classes.content}>
        {this.renderCargando()}
        {this.renderOk()}
        {this.renderError()}
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
            onClick={this.props.onBotonVolverClick}
          >
            Volver
          </Button>
        </div>
      </div>
    );
  }

  renderCargando() {
    if (this.state.cargando !== true) return null;
    return null;
  }

  renderOk() {
    if (this.state.cargando !== false || this.state.error !== undefined)
      return null;

    const { classes, padding } = this.props;

    return (
      <div className={classes.pagina} style={{ padding: padding }}>
        <Lottie
          options={opcionesAnimExito}
          height={150}
          width={150}
          style={{ minHeight: "150px" }}
        />

        <Typography variant="headline" className={classes.texto}>
          Se ha enviado un e-mail a su casilla de correo con las instrucciones
          para recuperar su contraseña
        </Typography>
      </div>
    );
  }

  renderError() {
    if (this.state.cargando !== false || this.state.error === undefined)
      return null;

    const { classes, padding } = this.props;

    return (
      <div className={classes.pagina} style={{ padding: padding }}>
        <Icon className={classes.icono} style={{ color: red["500"] }}>
          error
        </Icon>
        <Typography variant="headline" className={classes.texto}>
          {this.state.error}
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

let componente = PaginaRecuperarPassword;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
