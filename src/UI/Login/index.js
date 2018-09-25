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

//Mis componentes
import MiCardLogin from "@Componentes/MiCardLogin";
import PaginaUsername from "./PaginaUsername";
import PaginaPassword from "./PaginaPassword";
import PaginaUsuariosRecientes from "./PaginaUsuariosRecientes";
import PaginaGenerarCUIL from "./PaginaGeneralCuil";
import PaginaRecuperarPassword from "./PaginaRecuperarPassword";
import PaginaUsuarioNoActivado from "./PaginaUsuarioNoActivado";
import ContentSwapper from "@Componentes/ContentSwapper";
import Ayuda from "./Ayuda";
import MiPanelMensaje from "@Componentes/MiPanelMensaje";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_Aplicacion from "@Rules/Rules_Aplicacion";

const PAGINA_EXTRA_ERROR_VALIDANDO_CODIGO =
  "PAGINA_EXTRA_ERROR_VALIDANDO_CODIGO";

const PAGINA_USERNAME = 1;
const PAGINA_PASSWORD = 2;
const PAGINA_USUARIOS_RECIENTES = 3;
const PAGINA_GENERAR_CUIL = 4;
const PAGINA_RECUPERAR_PASSWORD = 5;
const PAGINA_USUARIO_NO_ACTIVADO = 6;

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  }
});

const mapStateToProps = state => {
  return {};
};

const padding = "2rem";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //Init
      codigo: props.match.params.codigo, //Busco el codigo en el query string
      validandoCodigo: true,
      errorValidandoCodigo: undefined,
      infoLogin: undefined,
      //UI
      visible: false,
      cargando: false,
      paginaAnterior: undefined,
      paginaActual: undefined,
      //Info util
      dataUsuario: undefined,
      cuilGenerado: undefined,
      activarUsername: undefined,
      activarPassword: undefined
    };
  }

  componentDidMount() {
    this.setState(
      {
        validandoCodigo: true,
        paginaActual: undefined
      },
      () => {
        Rules_Aplicacion.getInfoLogin(this.state.codigo)
          .then(info => {
            this.setState({
              infoLogin: info
            });
            this.cambiarPagina(PAGINA_USERNAME);
          })
          .catch(error => {
            this.setState({
              errorValidandoCodigo: error,
              paginaExtraActual: PAGINA_EXTRA_ERROR_VALIDANDO_CODIGO
            });
          })
          .finally(() => {
            this.setState({
              validandoCodigo: false
            });
          });
      }
    );

    setTimeout(() => {
      this.setState({ visible: true });
    }, 500);
  }

  onCargando = cargando => {
    this.setState({ cargando: cargando || false });
  };

  cambiarPagina = pagina => {
    this.setState({
      paginaAnterior: this.state.paginaActual,
      paginaActual: pagina
    });
  };

  onLogin = user => {
    this.setState({ visible: false });
    console.log(user);
    setTimeout(() => {
      window.location.replace(
        this.state.infoLogin.url + "?token=" + user.token
      );
    }, 500);
  };

  onCuilGenerado = cuilGenerado => {
    this.setState({
      username: cuilGenerado
    });

    this.cambiarPagina(PAGINA_USERNAME);
  };

  onPaginaUsernameBotonNuevoUsuarioClick = () => {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        this.props.redireccionar("/NuevoUsuario/" + this.state.codigo);
      }, 500);
    });
  };

  onPaginaUsernameBotonGenerarCuilClick = () => {
    this.cambiarPagina(PAGINA_GENERAR_CUIL);
  };

  onPaginaPasswordBotonVerUsuariosRecientesClick = () => {
    this.cambiarPagina(PAGINA_USUARIOS_RECIENTES);
  };

  onPaginaPasswordBotonVolverClick = () => {
    this.cambiarPagina(PAGINA_USERNAME);
  };

  onPaginaPasswordBotonRecuperarPasswordClick = () => {
    this.cambiarPagina(PAGINA_RECUPERAR_PASSWORD);
  };

  onPaginaPasswordUsuarioNoValidado = (username, password) => {
    this.setState({
      activarUsername: username,
      activarPassword: password
    });
    this.cambiarPagina(PAGINA_USUARIO_NO_ACTIVADO);
  };

  onPaginaRecuperarPasswordBotonVolverClick = () => {
    this.cambiarPagina(PAGINA_PASSWORD);
  };

  onPaginaGenerarCuilBotonVolverClick = () => {
    this.setState({ cuilGenerado: undefined });
    this.cambiarPagina(PAGINA_USERNAME);
  };

  onPaginaUsuariosRecientesBotonVolverClick = () => {
    this.cambiarPagina(PAGINA_PASSWORD);
  };

  onPaginaUsernameBotonSiguienteClick = data => {
    console.log(data);
    this.setState({ dataUsuario: data, username: data.username });
    this.cambiarPagina(PAGINA_PASSWORD);
  };

  onPaginaUsuarioRecientesUsuarioSeleccionado = data => {
    Rules_Usuario.guardarUsuarioReciente(data);
    this.onPaginaUsernameBotonSiguienteClick(data);
  };

  onPaginaUsuariosRecientesOtraCuentaClick = () => {
    this.cambiarPagina(PAGINA_USERNAME);
  };

  onPaginaUsuarioNoActivadoBotonVolverClick = () => {
    this.cambiarPagina(PAGINA_PASSWORD);
  };

  render() {
    const { classes } = this.props;

    const nombreSistema =
      this.state.infoLogin != undefined
        ? this.state.infoLogin.aplicacionNombre
        : "";

    const cargando = this.state.cargando || this.state.validandoCodigo;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiCardLogin
            titulo="Vecino Virtual"
            subtitulo={nombreSistema}
            cargando={cargando}
            visible={this.state.visible}
          >
            {this.renderContent()}
          </MiCardLogin>
        </div>

        <Ayuda expandido={this.state.expandido} />
      </React.Fragment>
    );
  }

  renderContent() {
    const { classes } = this.props;

    const anim =
      this.state.paginaAnterior == undefined
        ? "cross-fade"
        : this.state.paginaAnterior < this.state.paginaActual
          ? "mover-derecha"
          : "mover-izquierda";

    return (
      <div className={classes.content}>
        <ContentSwapper
          transitionName={anim}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          className={classes.contentSwapper}
        >
          {/* <div
          key="paginaErrorValidandoCodigo"
          className={classes.contentSwapperContent}
          visible={
            "" + (this.state.paginaActual == PAGINA_ERROR_VALIDANDO_CODIGO)
          }
        >
          {this.renderPaginaErrorValidandoCodigo()}
        </div> */}

          <div
            key="paginaUsername"
            className={classes.contentSwapperContent}
            visible={"" + (this.state.paginaActual == PAGINA_USERNAME)}
          >
            {this.renderPaginaUsername()}
          </div>
          <div
            key="paginaPassword"
            className={classes.contentSwapperContent}
            visible={"" + (this.state.paginaActual == PAGINA_PASSWORD)}
          >
            {this.renderPaginaPassword()}
          </div>
          <div
            key="paginaUsuariosRecientes"
            className={classes.contentSwapperContent}
            visible={
              "" + (this.state.paginaActual == PAGINA_USUARIOS_RECIENTES)
            }
          >
            {this.renderPaginaUsuariosRecientes()}
          </div>
          <div
            key="paginaGenerarCuil"
            className={classes.contentSwapperContent}
            visible={"" + (this.state.paginaActual == PAGINA_GENERAR_CUIL)}
          >
            {this.renderPaginaGenerarCuil()}
          </div>
          <div
            key="paginaRecuperarPassword"
            className={classes.contentSwapperContent}
            visible={
              "" + (this.state.paginaActual == PAGINA_RECUPERAR_PASSWORD)
            }
          >
            {this.renderPaginaRecuperarPassword()}
          </div>

          <div
            key="paginaUsuarioNoActivado"
            className={classes.contentSwapperContent}
            visible={
              "" + (this.state.paginaActual == PAGINA_USUARIO_NO_ACTIVADO)
            }
          >
            {this.renderPaginaUsuarioNoActivado()}
          </div>
        </ContentSwapper>

        {/* Paginas flotantes */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none"
          }}
        >
          <div
            className={classNames(
              classes.paginaExtra,
              this.state.paginaExtraActual ==
                PAGINA_EXTRA_ERROR_VALIDANDO_CODIGO && "visible"
            )}
          >
            {this.renderPaginaErrorValidandoCodigo()}
          </div>
        </div>
      </div>
    );
  }

  renderPaginaErrorValidandoCodigo() {
    return <MiPanelMensaje error mensaje={this.state.errorValidandoCodigo} />;
  }

  renderPaginaUsername() {
    return (
      <PaginaUsername
        padding={padding}
        onCargando={this.onCargando}
        username={this.state.username != undefined ? this.state.username : ""}
        onBotonNuevoUsuarioClick={this.onPaginaUsernameBotonNuevoUsuarioClick}
        onBotonSiguienteClick={this.onPaginaUsernameBotonSiguienteClick}
        onBotonGenerarCuil={this.onPaginaUsernameBotonGenerarCuilClick}
      />
    );
  }

  renderPaginaPassword() {
    return (
      <PaginaPassword
        dataUsuario={this.state.dataUsuario}
        onCargando={this.onCargando}
        onLogin={this.onLogin}
        padding={padding}
        onBotonVolverClick={this.onPaginaPasswordBotonVolverClick}
        onBotonVerUsuariosRecientesClick={
          this.onPaginaPasswordBotonVerUsuariosRecientesClick
        }
        onBotonRecuperarPassword={
          this.onPaginaPasswordBotonRecuperarPasswordClick
        }
        onUsuarioNoValidado={this.onPaginaPasswordUsuarioNoValidado}
      />
    );
  }

  renderPaginaUsuariosRecientes() {
    return (
      <PaginaUsuariosRecientes
        padding={padding}
        onUsuarioSeleccionado={this.onPaginaUsuarioRecientesUsuarioSeleccionado}
        onOtraCuentaClick={this.onPaginaUsuariosRecientesOtraCuentaClick}
        onBotonVolverClick={this.onPaginaUsuariosRecientesBotonVolverClick}
      />
    );
  }

  renderPaginaGenerarCuil() {
    return (
      <PaginaGenerarCUIL
        padding={padding}
        onCargando={this.onCargando}
        onBotonVolverClick={this.onPaginaGenerarCuilBotonVolverClick}
        onCuilGenerado={this.onCuilGenerado}
      />
    );
  }

  renderPaginaRecuperarPassword() {
    let username = "";
    if (this.state.dataUsuario != undefined) {
      username = this.state.dataUsuario.username;
    }

    return (
      <PaginaRecuperarPassword
        padding={padding}
        onBotonVolverClick={this.onPaginaRecuperarPasswordBotonVolverClick}
        onCargando={this.onCargando}
        username={username}
      />
    );
  }

  renderPaginaUsuarioNoActivado() {
    let username = this.state.activarUsername;
    let password = this.state.activarPassword;

    return (
      <PaginaUsuarioNoActivado
        padding={padding}
        onCargando={this.onCargando}
        onBotonVolverClick={this.onPaginaUsuarioNoActivadoBotonVolverClick}
        username={username}
        password={password}
      />
    );
  }
}

let componente = Login;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
