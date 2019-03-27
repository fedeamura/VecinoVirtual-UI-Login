import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";
import "@UI/transitions.css";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

//Componentes
import { Typography, Button, Icon } from "@material-ui/core";
import Lottie from "react-lottie";
import * as animExito from "@Resources/animaciones/anim_success.json";

//Mis compontentes
import MiPanelMensaje from "@Componentes/MiPanelMensaje";
import ContentSwapper from "@Componentes/ContentSwapper";
import DialogoMensaje from "@Componentes/MiDialogoMensaje";
import DialogoInput from "@Componentes/MiDialogoInput";
import DialogoForm from "@Componentes/MiDialogoForm";
import DialogoNumeroTramiteAyuda from "../../_Dialogos/DialogoNumeroTramiteAyuda";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const PAGINA_ERROR = "PAGINA_ERROR";
const PAGINA_OK = "PAGINA_OK";

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

class PaginaRecuperarPassword extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onBotonVolverClick: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      paginaActual: undefined,
      dialogoContactoVisible: false
    };
  }

  componentDidMount() {
    this.procesar();
  }

  procesar = () => {
    const username = this.props.username;
    this.props.onCargando(true);
    this.setState(
      {
        cargando: true,
        paginaActual: undefined
      },
      () => {
        Rules_Usuario.iniciarRecuperarPassword({
          username: username,
          urlRetorno: window.location.href
        })
          .then(() => {
            this.setState({
              mensajeExito: "Se ha enviado un e-mail a su casilla de correo con las instrucciones para recuperar tu contraseña",
              paginaActual: PAGINA_OK
            });
          })
          .catch(error => {
            this.setState({
              error: error,
              paginaActual: PAGINA_ERROR
            });
          })
          .finally(() => {
            this.props.onCargando(false);
            this.setState({ cargando: false });
          });
      }
    );
  };

  onBotonSinAccesoEmailClick = () => {
    this.setState(
      {
        cargando: true
      },
      async () => {
        let activado = await Rules_Usuario.validarUsuarioActivadoByUsername(this.props.username);
        if (activado == true) {
          this.setState({ dialogoContactoVisible: true });
        } else {
          this.setState({ dialogoEmailVisible: true, dialogoEmailCargando: false, dialogoEmailErrorVisible: false });
        }

        this.setState({ cargando: false });
      }
    );
  };

  onDialogoEmailClose = () => {
    let cargando = this.state.dialogoEmailCargando;
    if (cargando == true) return;
    this.setState({ dialogoEmailVisible: false, dialogoEmailErrorVisible: false });
  };

  onDialogoContactoClose = () => {
    this.setState({ dialogoContactoVisible: false });
  };

  onDialogoEmailBotonSiClick = async data => {
    const { email, numeroTramite } = data;
    if (numeroTramite == "") {
      this.setState({ dialogoEmailErrorMensaje: "Ingrese el numero de trámite", dialogoEmailErrorVisible: true });
      return;
    }

    if (email == "") {
      this.setState({ dialogoEmailErrorMensaje: "Ingrese el e-mail", dialogoEmailErrorVisible: true });
      return;
    }

    this.setState({ dialogoEmailErrorVisible: false, dialogoEmailCargando: true });

    try {
      var emailResultado = await Rules_Usuario.iniciarActivacionByNumeroTramite({
        numeroTramite: numeroTramite,
        emailNuevo: email,
        urlRetorno: window.location.href
      });

      this.setState(
        {
          dialogoEmailVisible: false,
          paginaActual: undefined
        },
        () => {
          setTimeout(() => {
            this.setState({
              paginaActual: PAGINA_OK,
              mensajeExito: "Se ha enviado un e-mail a " + emailResultado + " con las instrucciones para validar su usuario"
            });
          }, 300);
        }
      );
    } catch (ex) {
      let mensaje = typeof ex === "object" ? ex.message : ex;
      this.setState({ dialogoEmailCargando: false, dialogoEmailErrorMensaje: mensaje, dialogoEmailErrorVisible: true });
    }
  };

  onDialogoEmailBotonBanerClick = () => {
    this.setState({ dialogoEmailErrorVisible: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <ContentSwapper
          transitionName={"cross-fade"}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          className={classes.contentSwapper}
        >
          <div key="paginaOK" className={classes.contentSwapperContent} visible={"" + (this.state.paginaActual == PAGINA_OK)}>
            {this.renderPaginaOk()}
          </div>

          <div key="paginaError" className={classes.contentSwapperContent} visible={"" + (this.state.paginaActual == PAGINA_ERROR)}>
            {this.renderPaginaError()}
          </div>
        </ContentSwapper>

        {/* Contacto  */}
        <DialogoMensaje
          visible={this.state.dialogoContactoVisible || false}
          textoSi="Solicitar ayuda"
          botonNoVisible={false}
          onClose={this.onDialogoContactoClose}
          onBotonSiClick={() => {
            this.props.redireccionar("/Contacto");
          }}
          mensaje="Si no recuerda su contraseña y no tiene acceso a la casilla de correo asociada a su usuario por favor comuníquese con nosotros para poder ayudarlo"
        />

        {/* Activar usuario por numero de tramite */}
        <DialogoForm
          onClose={this.onDialogoEmailClose}
          textoSi="Validar e-mail"
          textoNo="Cancelar"
          titulo="Usuario no validado"
          mensaje="Para recuperar su contraseña primero debe validar su e-mail. Para ello ingrese el número de trámite de su DNI y su casilla de correo."
          mensajeChildren={
            <Button
              variant="flat"
              onClick={() => {
                this.setState({ dialogoNumeroTramiteAyudeVisible: true });
              }}
            >
              <Icon style={{ marginRight: 8 }}>help_outline_outlined</Icon>¿Necesitas ayuda con tu Nº de Trámite?
            </Button>
          }
          inputs={[
            {
              key: "numeroTramite",
              label: "Nª de trámite"
            },
            {
              key: "email",
              label: "E-mail nuevo"
            }
          ]}
          mostrarBaner={this.state.dialogoEmailErrorVisible || false}
          textoBaner={this.state.dialogoEmailErrorMensaje || ""}
          onBotonBanerClick={this.onDialogoEmailBotonBanerClick}
          autoCerrarBotonSi={false}
          mostrarBotonBaner={true}
          cargando={this.state.dialogoEmailCargando || false}
          onBotonSiClick={this.onDialogoEmailBotonSiClick}
          visible={this.state.dialogoEmailVisible}
        />

        {/* Ayuda numero de tramite */}
        <DialogoNumeroTramiteAyuda
          visible={this.state.dialogoNumeroTramiteAyudeVisible || false}
          onClose={() => {
            this.setState({ dialogoNumeroTramiteAyudeVisible: false });
          }}
        />
      </div>
    );
  }

  renderPaginaOk() {
    const { classes } = this.props;

    return (
      <div className={classes.pagina}>
        <div className={classes.content}>
          <Lottie options={opcionesAnimExito} height={120} width={120} style={{ minHeight: 120 }} />

          <Typography variant="headline" className={classes.texto} style={{ fontSize: 20, marginBottom: 16 }}>
            {this.state.mensajeExito || ""}
          </Typography>

          <div style={{}}>
            <Button variant="outlined" color="primary" onClick={this.onBotonSinAccesoEmailClick}>
              ¿No tenes acceso a la casilla de e-mail?
            </Button>
          </div>
        </div>
        <div className={classes.footer}>
          <div style={{ flex: 1 }}>
            <Button variant="text" color="primary" className={classes.button} onClick={this.props.onBotonVolverClick}>
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  renderPaginaError() {
    return <MiPanelMensaje boton="Volver" onBotonClick={this.props.onBotonVolverClick} error mensaje={this.state.error} />;
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
