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
import { Typography, Icon } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import red from "@material-ui/core/colors/red";

//Mis componentes
import MiCard from "@Componentes/MiCard";
import PaginaUsername from "./PaginaUsername";
import PaginaPassword from "./PaginaPassword";
import PaginaUsuariosRecientes from "./PaginaUsuariosRecientes";
import PaginaGenerarCUIL from "./PaginaGeneralCuil";
import PaginaRecuperarPassword from "./PaginaRecuperarPassword";
import PaginaUsuarioNoActivado from "./PaginaUsuarioNoActivado";
import ContentSwapper from "@Componentes/ContentSwapper";
import Ayuda from "./Ayuda";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_Aplicacion from "@Rules/Rules_Aplicacion";

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
      //Info util
      dataUsuario: undefined,
      cuilGenerado: undefined,
      activarUsername: undefined,
      activarPassword: undefined,
      //Ayuda
      ayudaExpandido: false,
      //Paginas
      paginaUsernameVisible: true,
      paginaPasswordVisible: false,
      paginaUsuariosRecientesVisible: false,
      paginaGenerarCuilVisible: false,
      paginaRecuperarPasswordVisible: false,
      paginaUsuarioNoActivadoVisible: false
    };
  }

  componentDidMount() {
    this.setState({ validandoCodigo: true }, () => {
      Rules_Aplicacion.getInfoLogin(this.state.codigo)
        .then(info => {
          this.setState({ infoLogin: info });
        })
        .catch(error => {
          this.setState({ errorValidandoCodigo: error });
        })
        .finally(() => {
          this.setState({ validandoCodigo: false });
        });
    });

    setTimeout(() => {
      this.setState({ visible: true });
    }, 500);
  }

  cambiarPagina = (pagina, callback) => {
    this.setState(
      {
        paginaUsernameVisible: false,
        paginaPasswordVisible: false,
        paginaUsuariosRecientesVisible: false,
        paginaGenerarCuilVisible: false,
        paginaRecuperarPasswordVisible: false,
        paginaUsuarioNoActivadoVisible: false,
        [pagina]: true
      },
      () => {
        if (callback) {
          callback();
        }
      }
    );
  };

  onCargando = cargando => {
    this.setState({ cargando: cargando || false });
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
    this.setState({ cuilGenerado: cuilGenerado });
    this.cambiarPagina("paginaUsernameVisible");
  };

  onPaginaUsernameBotonSiguienteClick = data => {
    this.setState({ dataUsuario: data }, () => {
      this.cambiarPagina("paginaPasswordVisible");
    });
  };

  onPaginaUsernameBotonGenerarCuilClick = () => {
    this.cambiarPagina("paginaGenerarCuilVisible");
  };

  onPaginaPasswordBotonVerUsuariosRecientesClick = () => {
    this.cambiarPagina("paginaUsuariosRecientesVisible");
  };

  onPaginaPasswordBotonVolverClick = () => {
    this.cambiarPagina("paginaUsernameVisible");
  };

  onPaginaPasswordBotonRecuperarPasswordClick = () => {
    this.cambiarPagina("paginaRecuperarPasswordVisible");
  };

  onPaginaPasswordUsuarioNoValidado = (username, password) => {
    this.setState(
      { activarUsername: username, activarPassword: password },
      () => {
        this.cambiarPagina("paginaUsuarioNoActivadoVisible");
      }
    );
  };

  onPaginaRecuperarPasswordBotonVolverClick = () => {
    this.cambiarPagina("paginaPasswordVisible");
  };

  onPaginaGenerarCuilBotonVolverClick = () => {
    this.setState({ cuilGenerado: undefined });
    this.cambiarPagina("paginaUsernameVisible");
  };

  onPaginaUsuariosRecientesBotonVolverClick = () => {
    this.cambiarPagina("paginaPasswordVisible");
  };

  onPaginaUsuarioRecientesUsuarioSeleccionado = data => {
    Rules_Usuario.guardarUsuarioReciente(data);
    this.onPaginaUsernameBotonSiguienteClick(data);
  };

  onPaginaUsuariosRecientesOtraCuentaClick = () => {
    this.cambiarPagina("paginaUsernameVisible");
  };

  onPaginaUsuarioNoActivadoBotonVolverClick = () => {
    this.cambiarPagina("paginaPasswordVisible");
  };

  render() {
    const { classes } = this.props;

    const nombreSistema =
      this.state.infoLogin != undefined
        ? this.state.infoLogin.aplicacionNombre
        : "";

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
                <Typography variant="title">{nombreSistema}</Typography>
              </div>
            </div>

            {this.renderValidandoCodigo()}
            {this.renderContent()}

            <div
              className={classNames(
                classes.overlayCargando,
                this.state.cargando && "visible"
              )}
            />
          </MiCard>
        </div>

        <Ayuda expandido={this.state.expandido} />
      </React.Fragment>
    );
  }

  renderValidandoCodigo() {
    if (this.state.validandoCodigo === false) return null;
    return null;
  }

  renderContent() {
    if (this.state.validandoCodigo === true) return null;

    if (this.state.errorValidandoCodigo !== undefined) {
      return this.renderErrorValidandoCodigo();
    }

    const { classes } = this.props;

    return (
      <ContentSwapper
        transitionName="roll-up"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        className={classes.contentSwapper}
      >
        <div
          key="paginaUsername"
          style={{ height: "100%", width: "100%" }}
          visible={"" + this.state.paginaUsernameVisible}
        >
          {this.renderPaginaUsername()}
        </div>
        <div
          key="paginaPassword"
          style={{ height: "100%", width: "100%" }}
          visible={"" + this.state.paginaPasswordVisible}
        >
          {this.renderPaginaPassword()}
        </div>
        <div
          key="paginaUsuariosRecientes"
          style={{ height: "100%", width: "100%" }}
          visible={"" + this.state.paginaUsuariosRecientesVisible}
        >
          {this.renderPaginaUsuariosRecientes()}
        </div>
        <div
          key="paginaGenerarCuil"
          style={{ height: "100%", width: "100%" }}
          visible={"" + this.state.paginaGenerarCuilVisible}
        >
          {this.renderPaginaGenerarCuil()}
        </div>
        <div
          key="paginaRecuperarPassword"
          style={{ height: "100%", width: "100%" }}
          visible={"" + this.state.paginaRecuperarPasswordVisible}
        >
          {this.renderPaginaRecuperarPassword()}
        </div>

        <div
          key="paginaUsuarioNoActivado"
          style={{ height: "100%", width: "100%" }}
          visible={"" + this.state.paginaUsuarioNoActivadoVisible}
        >
          {this.renderPaginaUsuarioNoActivado()}
        </div>
      </ContentSwapper>
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
          {this.state.errorValidandoCodigo}
        </Typography>
      </div>
    );
  }

  renderPaginaUsername() {
    return (
      <PaginaUsername
        padding={padding}
        cuilGenerado={this.state.cuilGenerado}
        onCargando={this.onCargando}
        username={this.state.username}
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
