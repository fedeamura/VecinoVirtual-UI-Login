import React from "react";
import { withStyles } from "@material-ui/core/styles";

//Styles
import styles from "./styles";
import "@UI/transitions.css";

//REDUX
import { connect } from "react-redux";

//Componentes
import { Typography, Grid, Icon, Button } from "@material-ui/core";
import Lottie from "react-lottie";
import * as animExito from "@Resources/animaciones/anim_success.json";
import red from "@material-ui/core/colors/red";

//Mis componente
import DialogoInput from "@Componentes/MiDialogoInput";

//Mis rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

const opcionesAnimExito = {
  loop: false,
  autoplay: true,
  animationData: animExito,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

class PaginaUsuarioNoActivado extends React.Component {
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

  activar = () => {
    const username = this.props.username;
    const password = this.props.password;
    this.props.onCargando(true);
    Rules_Usuario.iniciarActivacion({
      username: username,
      password: password,
      urlRetorno: window.location.href
    })
      .then(email => {
        this.setState({ procesado: true, error: undefined, email: email });
      })
      .catch(error => {
        this.setState({ procesado: true, error: error });
      })
      .finally(() => {
        this.props.onCargando(false);
      });
  };

  onBotonActivarClick = () => {
    this.setState({ cargando: true, procesado: false }, () => {
      this.activar();
    });
  };

  onBotonReintentarClick = () => {
    this.activar();
  };

  onBotonCambiarEmailClick = () => {
    this.setState({ dialogoEmailVisible: true, dialogoEmailErrorVisible: false });
  };

  onDialogoEmailClose = () => {
    this.setState({ dialogoEmailVisible: false });
  };

  cambiarEmail = email => {
    if (email.trim() == "") {
      this.setState({ dialogoEmailErrorVisible: true, dialogoEmailErrorMensaje: "Ingrese la dirección de e-mail" });
      return;
    }

    this.props.onCargando(true);
    const username = this.props.username;
    const password = this.props.password;
    this.setState({ dialogoEmailErrorVisible: false, dialogoEmailVisible: false }, () => {
      Rules_Usuario.iniciarActivacion({
        username: username,
        password: password,
        emailNuevo: email,
        urlRetorno: window.location.href
      })
        .then(email => {
          this.setState({ procesado: true, error: undefined, email: email });
        })
        .catch(error => {
          this.setState({ procesado: true, error: error });
        })
        .finally(() => {
          this.props.onCargando(false);
        });
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.renderContent()}
        {this.renderFooter()}

        <DialogoInput
          textoSi="Aceptar"
          textoNo="Cancelar"
          mensaje="Ingrese su nueva dirección de e-mail"
          titulo="Cambiar e-mail"
          label="E-Mail"
          onBotonSiClick={this.cambiarEmail}
          mostrarBaner={this.state.dialogoEmailErrorVisible || false}
          textoBaner={this.state.dialogoEmailErrorMensaje || ""}
          visible={this.state.dialogoEmailVisible || false}
          onClose={this.onDialogoEmailClose}
        />
      </div>
    );
  }

  renderContent() {
    const { classes, padding } = this.props;
    return (
      <div className={classes.content}>
        {this.renderMain()}
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
          <Button variant="text" color="primary" className={classes.button} onClick={this.props.onBotonVolverClick}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  renderMain() {
    if (this.state.procesado === true || this.state.error !== undefined) return null;

    const { classes, padding } = this.props;

    return (
      <div className={classes.pagina} style={{ padding: padding }}>
        <Typography variant="headline" className={classes.texto}>
          Su usuario no se encuentra activado. Si lo desea puede solicitar nuevamente el e-mail de activación.
        </Typography>

        <Button variant="outlined" color="primary" style={{ marginTop: "16px" }} onClick={this.onBotonActivarClick}>
          Solicitar e-mail de activación
        </Button>
      </div>
    );
  }

  renderOk() {
    if (this.state.procesado === false || this.state.error !== undefined) return null;

    const { classes, padding } = this.props;

    return (
      <div className={classes.pagina} style={{ padding: padding }}>
        <Lottie options={opcionesAnimExito} height={120} width={120} style={{ minHeight: 120 }} />

        <Typography variant="headline" className={classes.texto} style={{ fontSize: 20, marginBottom: 16 }}>
          Se ha enviado un e-mail {this.state.email} con las instrucciones para la activacion de su usuario
        </Typography>

        <div>
          <Button variant="outlined" color="primary" onClick={this.onBotonCambiarEmailClick}>
            ¿No tenes acceso a esa casilla de e-mail?
          </Button>
        </div>
      </div>
    );
  }

  renderError() {
    if (this.state.procesado === false || this.state.error === undefined) return null;

    const { classes, padding } = this.props;

    return (
      <div className={classes.pagina} style={{ padding: padding }}>
        <Icon className={classes.icono} style={{ color: red["500"] }}>
          error
        </Icon>
        <Typography variant="headline" className={classes.texto}>
          {this.state.error}
        </Typography>
        <Button variant="outlined" style={{ marginTop: "16px" }} onClick={this.onBotonReintentarClick}>
          Reintentar
        </Button>
      </div>
    );
  }
}

let componente = PaginaUsuarioNoActivado;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
