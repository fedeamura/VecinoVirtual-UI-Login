import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import "@UI/transitions.css";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

//Mis componentes
import MiCardLogin from "@Componentes/MiCardLogin";
import ContentSwapper from "@Componentes/ContentSwapper";
import MiPanelMensaje from "@Componentes/MiPanelMensaje";
import PaginaDatosBasicos from "./PaginaDatosBasicos";
import PaginaDatosAcceso from "./PaginaDatosAcceso";
import PaginaDatosContacto from "./PaginaDatosContacto";
import PaginaDatosDomicilio from "./PaginaDatosDomicilio";
import PaginaFoto from "./PaginaFoto";
import PaginaConfirmacion from "./PaginaConfirmacion";

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

const PAGINA_EXTRA_ERROR_VALIDANDO_CODIGO =
  "PAGINA_EXTRA_ERROR_VALIDANDO_CODIGO";
const PAGINA_EXTRA_EXITO = "PAGINA_EXTRA_EXITO";
const PAGINA_EXTRA_ERROR_REGISTRANDO = "PAGINA_EXTRA_ERROR_REGISTRANDO";

const PAGINA_DATOS_BASICOS = 1;
const PAGINA_DATOS_ACCESO = 2;
const PAGINA_DATOS_CONTACTO = 3;
const PAGINA_DATOS_DOMICILIO = 4;
const PAGINA_FOTO = 5;
const PAGINA_CONFIRMACION = 6;

class NuevoUsuario extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      codigo: props.match.params.codigo, //Busco el codigo en el query string
      validandoCodigo: true,
      errorValidandoCodigo: undefined,
      infoLogin: undefined,
      errorRegistrando: undefined,
      //Datos
      datosBasicos: undefined,
      datosAcceso: undefined,
      datosContacto: undefined,
      datosDomicilio: undefined,
      foto: undefined,
      //UI
      visible: false,
      paginaAnterior: undefined,
      paginaActual: undefined,
      paginaExtraActual: undefined
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ visible: true });
    }, 500);

    this.validarCodigo();
  }

  validarCodigo = () => {
    this.setState(
      {
        validandoCodigo: true,
        paginaActual: undefined
      },
      () => {
        Rules_Aplicacion.getInfoLogin(this.state.codigo)
          .then(data => {
            this.setState({
              infoLogin: data
            });

            this.cambiarPagina(PAGINA_DATOS_BASICOS);
          })
          .catch(error => {
            this.setState({
              errorValidandoCodigo: error,
              paginaExtraActual: PAGINA_EXTRA_ERROR_VALIDANDO_CODIGO
            });
          })
          .finally(() => {
            this.setState({ validandoCodigo: false });
          });
      }
    );
  };

  onCargando = cargando => {
    this.setState({ cargando: cargando || false });
  };

  cambiarPagina = pagina => {
    this.setState({
      paginaAnterior: this.state.paginaActual,
      paginaActual: pagina
    });
  };

  onDatosBasicosReady = datos => {
    this.setState({
      datosBasicos: datos
    });

    this.cambiarPagina(PAGINA_DATOS_ACCESO);
  };

  onDatosAccesoReady = datos => {
    this.setState({
      datosAcceso: datos
    });

    this.cambiarPagina(PAGINA_DATOS_CONTACTO);
  };

  onDatosContactoReady = datos => {
    this.setState({
      datosContacto: datos
    });

    this.cambiarPagina(PAGINA_DATOS_DOMICILIO);
  };

  onDatosDomicilioReady = datos => {
    this.setState({
      datosDomicilio: datos
    });

    this.cambiarPagina(PAGINA_FOTO);
  };

  onFotoReady = datos => {
    this.setState({
      foto: datos
    });

    this.cambiarPagina(PAGINA_CONFIRMACION);
  };

  onConfirmacionReady = recaptcha => {
    try {
      let telefonoFijo = undefined;
      if (this.state.datosContacto.telefonoFijoArea != undefined) {
        telefonoFijo = (
          this.state.datosContacto.telefonoFijoArea +
          "-" +
          this.state.datosContacto.telefonoFijoNumero
        ).trim();
      }

      let telefonoCelular = undefined;
      if (this.state.datosContacto.telefonoCelularArea != undefined) {
        telefonoCelular = (
          this.state.datosContacto.telefonoCelularArea +
          "-" +
          this.state.datosContacto.telefonoCelularNumero
        ).trim();
      }

      let comando = {
        comando: {
          nombre: this.state.datosBasicos.nombre,
          apellido: this.state.datosBasicos.apellido,
          dni: this.state.datosBasicos.dni,
          fechaNacimiento: this.convertirFechaNacimientoString(
            this.state.datosBasicos.fechaNacimiento
          ),
          sexoMasculino: this.state.datosBasicos.sexoMasculino,
          idEstadoCivil: this.state.datosBasicos.idEstadoCivil,
          domicilio:
            this.state.datosDomicilio == undefined
              ? undefined
              : {
                  direccion: this.state.datosDomicilio.direccion,
                  altura: this.state.datosDomicilio.altura,
                  torre: this.state.datosDomicilio.torre,
                  piso: this.state.datosDomicilio.piso,
                  depto: this.state.datosDomicilio.depto,
                  ciudad: this.state.datosDomicilio.ciudad,
                  idCiudad: this.state.datosDomicilio.idCiudad,
                  barrio: this.state.datosDomicilio.barrio,
                  idBarrio: this.state.datosDomicilio.idBarrio,
                  provincia: this.state.datosDomicilio.provincia,
                  idProvincia: this.state.datosDomicilio.idProvincia
                },
          email: this.state.datosContacto.email,
          telefonoFijo: telefonoFijo,
          telefonoCelular: telefonoCelular,
          facebook: this.state.datosContacto.facebook,
          twitter: this.state.datosContacto.twitter,
          instragram: this.state.datosContacto.instragram,
          linkedin: this.state.datosContacto.linkedin,
          username: this.state.datosAcceso.username,
          password: this.state.datosAcceso.password,
          base64FotoPersonal: this.state.foto
        },
        passwordDefault: false,
        urlRetorno:
          window.location.origin +
          window.Config.BASE_URL +
          "/#/Login/" +
          this.state.codigo
      };

      this.setState({ cargando: true }, () => {
        Rules_Usuario.registrar(comando)
          .then(() => {
            this.setState({ paginaExtraActual: PAGINA_EXTRA_EXITO });
          })
          .catch(error => {
            this.setState({
              errorRegistrando: error
            });

            this.setState({
              paginaExtraActual: PAGINA_EXTRA_ERROR_REGISTRANDO
            });
          })
          .finally(() => {
            this.setState({ cargando: false });
          });
      });
    } catch (ex) {
      this.setState({
        cargando: false,
        errorRegistrando: "Error procesando la solicitud"
      });
      this.setState({ paginaExtraActual: PAGINA_EXTRA_ERROR_REGISTRANDO });
    }
  };

  convertirFechaNacimientoString = fecha => {
    let dia = fecha.getDate();
    if (dia < 10) dia = "0" + dia;
    let mes = fecha.getMonth() + 1;
    if (mes < 10) mes = "0" + mes;
    let año = fecha.getFullYear();
    return dia + "/" + mes + "/" + año;
  };

  onPaginaDatosBasicosBotonYaEstoyRegistradoClick = () => {
    this.setState({ visible: false }, () => {
      this.props.redireccionar("/Login/" + this.state.codigo);
    });
  };

  onPaginaDatosAccesoBotonVolverClick = () => {
    this.cambiarPagina(PAGINA_DATOS_BASICOS);
  };

  onPaginaDatosContactoBotonVolverClick = () => {
    this.cambiarPagina(PAGINA_DATOS_ACCESO);
  };

  onPaginaDatosDomicilioBotonVolverClick = () => {
    this.cambiarPagina(PAGINA_DATOS_CONTACTO);
  };

  onPaginaFotoBotonVolverClick = () => {
    this.cambiarPagina(PAGINA_DATOS_DOMICILIO);
  };

  onPaginaConfirmacionBotonVolverClick = () => {
    this.cambiarPagina(PAGINA_FOTO);
  };

  onPaginaErrorRegistrandoBotonReintentarClick = () => {
    this.setState({ paginaExtraActual: undefined });
  };

  onPaginaExitoBotonInicioClick = () => {
    this.props.redireccionar("/Login/" + this.state.codigo);
  };

  render() {
    const { classes } = this.props;

    const cargando = this.state.cargando || this.state.validandoCodigo;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiCardLogin
            cargando={cargando}
            visible={this.state.visible}
            rootClassName={classes.cardRoot}
            titulo="Vecino Virtual"
            subtitulo="Nuevo usuario"
          >
            {this.renderContent()}
          </MiCardLogin>
        </div>
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
          <div
            key="paginaDatosBasicos"
            className={classes.contentSwapperContent}
            visible={"" + (this.state.paginaActual == PAGINA_DATOS_BASICOS)}
          >
            {this.renderPaginaDatosBasicos()}
          </div>
          <div
            key="paginaDatosAcceso"
            className={classes.contentSwapperContent}
            visible={"" + (this.state.paginaActual == PAGINA_DATOS_ACCESO)}
          >
            {this.renderPaginaDatosAcceso()}
          </div>
          <div
            key="paginaDatosContacto"
            className={classes.contentSwapperContent}
            visible={"" + (this.state.paginaActual == PAGINA_DATOS_CONTACTO)}
          >
            {this.renderPaginaDatosContacto()}
          </div>
          <div
            key="paginaDatosDomicilio"
            className={classes.contentSwapperContent}
            visible={"" + (this.state.paginaActual == PAGINA_DATOS_DOMICILIO)}
          >
            {this.renderPaginaDatosDomicilio()}
          </div>
          <div
            key="paginaFoto"
            className={classes.contentSwapperContent}
            visible={"" + (this.state.paginaActual == PAGINA_FOTO)}
          >
            {this.renderPaginaFoto()}
          </div>
          <div
            key="paginaConfirmacion"
            className={classes.contentSwapperContent}
            visible={"" + (this.state.paginaActual == PAGINA_CONFIRMACION)}
          >
            {this.renderPaginaConfirmacion()}
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

          <div
            className={classNames(
              classes.paginaExtra,
              this.state.paginaExtraActual == PAGINA_EXTRA_ERROR_REGISTRANDO &&
                "visible"
            )}
          >
            {this.renderPaginaErrorRegistrando()}
          </div>

          <div
            className={classNames(
              classes.paginaExtra,
              this.state.paginaExtraActual == PAGINA_EXTRA_EXITO && "visible"
            )}
          >
            {this.renderPaginaExito()}
          </div>
        </div>
      </div>
    );
  }

  renderPaginaErrorValidandoCodigo() {
    return <MiPanelMensaje error mensaje={this.state.errorValidandoCodigo} />;
  }

  renderPaginaDatosBasicos() {
    return (
      <PaginaDatosBasicos
        padding={padding}
        datosIniciales={this.state.datosBasicos}
        onCargando={this.onCargando}
        onReady={this.onDatosBasicosReady}
        onBotonYaEstoyRegistradoClick={
          this.onPaginaDatosBasicosBotonYaEstoyRegistradoClick
        }
      />
    );
  }

  renderPaginaDatosAcceso() {
    return (
      <PaginaDatosAcceso
        padding={padding}
        datosIniciales={this.state.datosAcceso}
        onCargando={this.onCargando}
        onReady={this.onDatosAccesoReady}
        onBotonVolverClick={this.onPaginaDatosAccesoBotonVolverClick}
      />
    );
  }

  renderPaginaDatosContacto() {
    return (
      <PaginaDatosContacto
        padding={padding}
        datosIniciales={this.state.datosContacto}
        onCargando={this.onCargando}
        onReady={this.onDatosContactoReady}
        onBotonVolverClick={this.onPaginaDatosContactoBotonVolverClick}
      />
    );
  }

  renderPaginaDatosDomicilio() {
    return (
      <PaginaDatosDomicilio
        padding={padding}
        datosIniciales={this.state.datosDomicilio}
        onCargando={this.onCargando}
        onReady={this.onDatosDomicilioReady}
        onBotonVolverClick={this.onPaginaDatosDomicilioBotonVolverClick}
      />
    );
  }

  renderPaginaFoto() {
    let sexoMasculino =
      this.state.datosBasicos != undefined
        ? this.state.datosBasicos.sexoMasculino || false
        : false;
    return (
      <PaginaFoto
        padding={padding}
        datosIniciales={this.state.foto}
        onCargando={this.onCargando}
        onReady={this.onFotoReady}
        sexoMasculino={sexoMasculino}
        onBotonVolverClick={this.onPaginaFotoBotonVolverClick}
      />
    );
  }

  renderPaginaConfirmacion() {
    return (
      <PaginaConfirmacion
        padding={padding}
        onCargando={this.onCargando}
        onReady={this.onConfirmacionReady}
        onBotonVolverClick={this.onPaginaConfirmacionBotonVolverClick}
      />
    );
  }

  renderPaginaErrorRegistrando() {
    return (
      <MiPanelMensaje
        error
        mensaje={this.state.errorRegistrando}
        boton="Reintentar"
        onBotonClick={this.onPaginaErrorRegistrandoBotonReintentarClick}
      />
    );
  }

  renderPaginaExito() {
    let email =
      this.state.datosContacto != undefined
        ? this.state.datosContacto.email
        : "Sin e-mail";
    return (
      <MiPanelMensaje
        lottieExito
        mensaje="Su usuario ha sido creado correctamente."
        detalle={
          "Le enviamos un e-mail a " +
          email +
          " con las instrucciones para activarlo"
        }
        boton="Volver al inicio"
        onBotonClick={this.onPaginaExitoBotonInicioClick}
      />
    );
  }
}

let componente = NuevoUsuario;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
