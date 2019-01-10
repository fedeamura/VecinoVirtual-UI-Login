import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

import { isMobile } from "react-device-detect";
import { CircularProgress, Button } from "@material-ui/core";
import { QueryString } from "@Componentes/urlUtils";

//Mis Componentes
import PanelCamara from "./_PanelNuevoUsuarioDniCamara";
import PanelFilePicker from "./_PanelNuevoUsuarioDniFilePicker";
import DialogoDniManual from "./_DialogoDniManual";
import DialogoMensaje from "@Componentes/MiDialogoMensaje";
import DialogoInput from "@Componentes/MiDialogoInput";

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

class PanelNuevoUsuario extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      codigo: props.match.params.codigo, //Busco el codigo en el query string
      cargando: true,
      validandoCodigoErrorVisible: false,
      validandoCodigoErrorMensaje: false,
      infoLogin: undefined,
      modo: "file"
    };
  }

  componentDidMount() {
    localStorage.removeItem("dataNuevoUsuario");

    setTimeout(() => {
      this.setState({ visible: true });
    }, 500);
    this.validarCodigo();
  }

  validarCodigo = () => {
    this.setState(
      {
        cargando: true,
        validandoCodigoErrorVisible: false
      },
      () => {
        Rules_Aplicacion.getInfoLogin(this.state.codigo)
          .then(data => {
            this.setState({
              infoLogin: data
            });
          })
          .catch(error => {
            this.setState({
              validandoCodigoErrorVisible: true,
              validandoCodigoErrorMensaje: error
            });
          })
          .finally(() => {
            this.setState({ cargando: false });
          });
      }
    );
  };

  onBotonCamaraClick = () => {
    this.setState({ modo: "camara" });
  };

  onBotonFileClick = () => {
    this.setState({ modo: "file" });
  };

  onClose = () => {
    this.props.redireccionar("/Login/" + this.state.codigo);
  };

  // Mando a logear
  onLogin = () => {
    let user = this.state.dialogoNuevoUsuarioLoginData;

    this.setState({ dialogoNuevoUsuarioLoginVisible: false, visible: false }, () => {
      setTimeout(() => {
        let url = this.state.infoLogin.url;
        //Si no esta validado lo mando a validar
        if (user.validacionDNI === false) {
          let q = QueryString(window.location.href);
          if (q.url) {
            if (url.indexOf("?") != -1) {
              url += "&url=" + q.url;
            } else {
              url += "?url=" + q.url;
            }
          }
          window.location.replace(`${window.Config.URL_VALIDAR_RENAPER}/#/?token=${user.token}&url=${encodeURIComponent(url)}`);
        }
        //Sino logeo
        else {
          if (url.indexOf("?") != -1) {
            url += "&token=" + user.token;
          } else {
            url += "?token=" + user.token;
          }
          let q = QueryString(window.location.href);
          if (q.url) {
            url += "&url=" + q.url;
          }
          window.location.replace(url);
        }
      }, 500);
    });
  };

  onFotoDniReady = base64 => {
    this.setState({ cargando: true, fotoDni: base64, datosDni: undefined }, () => {
      Rules_Usuario.loginByQR(base64)
        .then(dataUserLogeado => {
          if (dataUserLogeado) {
            this.setState({ cargando: false });
            this.mostrarDialogoLogin(dataUserLogeado);
          } else {
            Rules_Usuario.nuevoUsuarioQR(base64)
              .then(data => {
                this.setState({ cargando: false });
                this.mostrarDialogoScanExito(data);
              })
              .catch(error => {
                this.setState({ cargando: false });
                this.mostrarDialogoScanDniError(error);
              });
          }
        })
        .catch(error => {
          this.setState({ cargando: false });

          if (error == "Su usuario no está activado por e-mail") {
            this.mostrarDialogoDebeActivarUsuario(base64);
          } else {
            this.mostrarDialogoScanDniError(error);
          }
        });
    });
  };

  crearUsuarioConDatos = () => {
    let user = this.state.dialogoNuevoUsuarioExitoData;
    this.setState({ dialogoNuevoUsuarioExitoVisible: false }, () => {
      setTimeout(() => {
        let partes = user.fechaNacimiento.split("T")[0].split("-");
        let fechaNacimiento = new Date(partes[0], parseInt(partes[1]) - 1, partes[2]);

        localStorage.setItem(
          "dataNuevoUsuario",
          JSON.stringify({
            fotoDni: this.state.fotoDni,
            datosDni: this.state.datosDni,
            nombre: user.nombre,
            apellido: user.apellido,
            dni: "" + user.dni,
            fechaNacimiento: fechaNacimiento,
            sexoMasculino: user.sexoMasculino ? "m" : "f"
          })
        );

        this.props.redireccionar("/NuevoUsuario/" + this.state.codigo + "?conData=true");
      }, 300);
    });
  };

  //Dialogo login (el usuario ya existia entonces lo puedo logear)
  mostrarDialogoLogin = data => {
    this.setState({
      dialogoNuevoUsuarioLoginVisible: true,
      dialogoNuevoUsuarioLoginData: data
    });
  };

  onDialogoLoginBotonAceptarClick = () => {
    this.onLogin(this.state.dialogoNuevoUsuarioLoginData);
  };

  //Dialogo exito al analizar dni
  mostrarDialogoScanExito = data => {
    this.setState({
      dialogoNuevoUsuarioExitoVisible: true,
      dialogoNuevoUsuarioExitoData: data
    });
  };

  onDialogoScanExitoBotonAceptarClick = () => {
    this.crearUsuarioConDatos();
  };

  // Dialogo debe activar usuario
  mostrarDialogoDebeActivarUsuario = data => {
    this.setState({
      dialogoNuevoUsuarioActivarUsuarioVisible: true,
      dialogoNuevoUsuarioActivarUsuarioCargando: false,
      dialogoNuevoUsuarioActivarUsuarioData: data
    });
  };

  onDialogoDebeActivarUsuarioClose = () => {
    let cargando = this.state.dialogoNuevoUsuarioActivarUsuarioCargando || false;
    if (cargando == true) return;
    this.setState({ dialogoNuevoUsuarioActivarUsuarioVisible: false });
  };

  onDialogoDebeActivarUsuarioBotonAceptarClick = () => {
    this.setState({ dialogoNuevoUsuarioActivarUsuarioCargando: true }, () => {
      let data = this.state.dialogoNuevoUsuarioActivarUsuarioData;

      //Si es object voy por datos QR, sino por imagen QR
      let promesa;
      if (typeof data == "object") {
        promesa = Rules_Usuario.iniciarActivacionPorDatosQR({
          datosQR: data,
          urlRetorno: window.location.href
        });
      } else {
        promesa = Rules_Usuario.iniciarActivacionPorQR({
          data: data,
          urlRetorno: window.location.href
        });
      }
      promesa
        .then(email => {
          this.setState({ dialogoNuevoUsuarioActivarUsuarioVisible: false });
          this.mostrarDialogoEmailActivacionEnviado(email);
        })
        .catch(error => {
          this.mostrarDialogoScanDniError(error);
        })
        .finally(() => {
          this.setState({ dialogoNuevoUsuarioActivarUsuarioCargando: false });
        });
    });
  };

  //Dialogo E-mail Activacion enviado
  mostrarDialogoEmailActivacionEnviado = email => {
    this.setState({ dialogoNuevoUsuarioActivarUsuarioExitoVisible: true, dialogoNuevoUsuarioActivarUsuarioExitoEmail: email });
  };

  onDialogoEmailActivacionEnviadoBotonAceptarClick = () => {
    this.setState({ dialogoNuevoUsuarioActivarUsuarioExitoVisible: false }, () => {
      this.props.redireccionar("/Login/" + this.state.codigo);
    });
  };

  onDialogoEmailActivacionEnviadoBotonCambiarEmailClick = () => {
    this.setState({
      dialogoNuevoUsuarioActivarUsuarioCambiarEmailErrorVisible: false,
      dialogoNuevoUsuarioActivarUsuarioExitoVisible: false,
      dialogoNuevoUsuarioActivarUsuarioCambiarEmailVisible: true
    });
  };

  onNuevoEmail = email => {
    if (email == undefined || email == "") {
      this.setState({
        dialogoNuevoUsuarioActivarUsuarioCambiarEmailError: "Ingrese el e-mail",
        dialogoNuevoUsuarioActivarUsuarioCambiarEmailErrorVisible: true
      });
      return;
    }

    this.setState(
      {
        dialogoNuevoUsuarioActivarUsuarioCambiarEmailVisible: false,
        dialogoNuevoUsuarioActivarUsuarioCambiarEmailErrorVisible: false,
        dialogoNuevoUsuarioActivarUsuarioExitoVisible: false,
        dialogoNuevoUsuarioActivarUsuarioVisible: true,
        dialogoNuevoUsuarioActivarUsuarioCargando: true
      },
      () => {
        let data = this.state.dialogoNuevoUsuarioActivarUsuarioData;

        //Si es object voy por datos QR, sino por imagen QR
        let promesa;
        if (typeof data == "object") {
          promesa = Rules_Usuario.iniciarActivacionPorDatosQR({
            datosQR: data,
            emailNuevo: email,
            urlRetorno: window.location.href
          });
        } else {
          promesa = Rules_Usuario.iniciarActivacionPorQR({
            data: data,
            emailNuevo: email,
            urlRetorno: window.location.href
          });
        }

        promesa
          .then(email => {
            this.setState({ dialogoNuevoUsuarioActivarUsuarioVisible: false });
            this.mostrarDialogoEmailActivacionEnviado(email);
          })
          .catch(error => {
            this.mostrarDialogoError(error);
          })
          .finally(() => {
            this.setState({ dialogoNuevoUsuarioActivarUsuarioCargando: false });
          });
      }
    );
  };

  onNuevoEmailClose = () => {
    this.setState({ dialogoNuevoUsuarioActivarUsuarioCambiarEmailVisible: false });
  };

  // Dialogo error escaneado DNI
  mostrarDialogoScanDniError = error => {
    this.setState({ dialogoNuevoUsuarioErrorVisible: true, dialogoNuevoUsuarioErrorMensaje: error });
  };

  onDialogoNuevoUsuarioDniErrorClose = () => {
    this.setState({ dialogoNuevoUsuarioErrorVisible: false });
  };

  // Dialogo error
  mostrarDialogoError = error => {
    this.setState({ dialogoErrorVisible: true, dialogoErrorMensaje: error });
  };

  onDialogoErrorClose = () => {
    this.setState({ dialogoErrorVisible: false });
  };

  // Datos Manulmente
  mostrarDialogoDatosManualmente = () => {
    this.setState({
      dialogoNuevoUsuarioErrorVisible: false,
      dialogoNuevoUsuarioManualVisible: true,
      dialogoNuevoUsuarioManualCargando: false
    });
  };

  onDialogoDatosManualmenteClose = () => {
    let cargando = this.state.dialogoNuevoUsuarioManualCargando;
    if (cargando) return;

    this.setState({ dialogoNuevoUsuarioManualVisible: false });
  };

  onDialogoDatosManualmenteReady = data => {
    this.setState(
      { dialogoNuevoUsuarioManualCargando: true, dialogoNuevoUsuarioManualErrorVisible: false, datosDni: data, fotoDni: undefined },
      () => {
        Rules_Usuario.loginByDatosQR(data)
          .then(dataUserLogeado => {
            if (dataUserLogeado) {
              this.setState({ dialogoNuevoUsuarioManualVisible: false });
              this.mostrarDialogoLogin(dataUserLogeado);
            } else {
              Rules_Usuario.nuevoUsuarioByDataQR(data)
                .then(data => {
                  this.setState({ dialogoNuevoUsuarioManualVisible: false });
                  this.mostrarDialogoScanExito(data);
                })
                .catch(error => {
                  this.setState({
                    dialogoNuevoUsuarioManualCargando: false,
                    dialogoNuevoUsuarioManualErrorVisible: true,
                    dialogoNuevoUsuarioManualErrorMensaje: error
                  });
                });
            }
          })
          .catch(error => {
            if (error == "Su usuario no está activado por e-mail") {
              this.setState({ dialogoNuevoUsuarioManualVisible: false });
              this.mostrarDialogoDebeActivarUsuario(data);
            } else {
              this.setState({
                dialogoNuevoUsuarioManualCargando: false,
                dialogoNuevoUsuarioManualErrorVisible: true,
                dialogoNuevoUsuarioManualErrorMensaje: error
              });
            }
          });
      }
    );
  };

  render() {
    const { classes } = this.props;
    const { modo } = this.state;

    return (
      <div className={classNames(classes.root, this.state.visible && "visible")}>
        <PanelCamara
          visible={modo == "camara"}
          onBotonFileClick={this.onBotonFileClick}
          onClose={this.onClose}
          onDni={this.onFotoDniReady}
        />
        <PanelFilePicker
          visible={modo == "file"}
          onBotonCamaraClick={this.onBotonCamaraClick}
          onClose={this.onClose}
          onDni={this.onFotoDniReady}
        />

        {this.renderDialogos()}
        {this.renderCargando()}
      </div>
    );
  }

  renderDialogos() {
    return (
      <React.Fragment>
        {/* Dialogo Error escaneado */}
        <DialogoMensaje
          visible={this.state.dialogoNuevoUsuarioErrorVisible || false}
          mensaje={this.state.dialogoNuevoUsuarioErrorMensaje}
          onClose={this.onDialogoNuevoUsuarioDniErrorClose}
          icon={"error"}
          iconColor="red"
          botonNoVisible={false}
          textoSi="Aceptar"
        >
          <Button variant="outlined" color="primary" style={{ marginTop: 16 }} onClick={this.mostrarDialogoDatosManualmente}>
            ¿Tiene problemas al analizar su DNI?
          </Button>
        </DialogoMensaje>

        {/* Dialogo manual */}
        <DialogoDniManual
          visible={this.state.dialogoNuevoUsuarioManualVisible}
          onClose={this.onDialogoDatosManualmenteClose}
          onReady={this.onDialogoDatosManualmenteReady}
          cargando={this.state.dialogoNuevoUsuarioManualCargando}
          errorVisible={this.state.dialogoNuevoUsuarioManualErrorVisible}
          errorMensaje={this.state.dialogoNuevoUsuarioManualErrorMensaje}
        />

        {/* Dialogo  Nuevo usuario Login */}
        <DialogoMensaje
          visible={this.state.dialogoNuevoUsuarioLoginVisible || false}
          mensaje={"Su usuario ya existe. Al presionar 'Continuar' usted accederá al sistema"}
          icon={"check_circle_outline"}
          iconColor="green"
          botonNoVisible={false}
          onBotonSiClick={this.onLogin}
          textoSi="Continuar"
        />

        {/* Dialogo Nuevo Usuario Exito */}
        <DialogoMensaje
          visible={this.state.dialogoNuevoUsuarioExitoVisible || false}
          mensaje={"Su DNI se ha analizado correctamente. Al presionar 'Continuar' usted podrá continuar con el registro de su usuario"}
          botonNoVisible={false}
          icon={"check_circle_outline"}
          iconColor="green"
          onBotonSiClick={this.onDialogoScanExitoBotonAceptarClick}
          textoSi="Continuar"
        />

        {/* Dialogo Activar usuario */}
        <DialogoMensaje
          autoCerrarBotonSi={false}
          cargando={this.state.dialogoNuevoUsuarioActivarUsuarioCargando || false}
          visible={this.state.dialogoNuevoUsuarioActivarUsuarioVisible || false}
          onClose={this.onDialogoDebeActivarUsuarioClose}
          mensaje={
            "Usted ya posee un usuario registrado, pero el mismo no se encuentra activado por e-mail. Si lo desea puede solicitar nuevamente el e-mail de activacion."
          }
          textoSi="Reenviar e-mail"
          onBotonSiClick={this.onDialogoDebeActivarUsuarioBotonAceptarClick}
          textoNo="Cancelar"
        />

        {/* Dialogo Activar usuario exito */}
        <DialogoMensaje
          visible={this.state.dialogoNuevoUsuarioActivarUsuarioExitoVisible || false}
          mensaje={`Se ha enviado un e-mail a ${this.state.dialogoNuevoUsuarioActivarUsuarioExitoEmail ||
            ""} con las instrucciones para la activacion de su usuario`}
          botonNoVisible={false}
          icon={"check_circle_outline"}
          iconColor="green"
          onBotonSiClick={this.onDialogoEmailActivacionEnviadoBotonAceptarClick}
          textoSi="Aceptar"
        >
          <Button
            onClick={this.onDialogoEmailActivacionEnviadoBotonCambiarEmailClick}
            variant="outlined"
            color="primary"
            style={{ marginTop: 16 }}
          >
            ¿No podés acceder a esa casilla de e-mail?
          </Button>
        </DialogoMensaje>

        {/* Dialogo  error */}
        <DialogoMensaje
          visible={this.state.dialogoErrorVisible || false}
          mensaje={this.state.dialogoErrorMensaje}
          onClose={this.onDialogoErrorClose}
          icon={"error"}
          iconColor="red"
          botonNoVisible={false}
          textoSi="Aceptar"
        />

        {/* Dialogo cambair email */}
        <DialogoInput
          titulo="Cambiar e-mail"
          placeholder="E-Mail"
          textoSi="Cambiar"
          textoNo="Cancelar"
          textoBaner={this.state.dialogoNuevoUsuarioActivarUsuarioCambiarEmailError}
          mostrarBaner={this.state.dialogoNuevoUsuarioActivarUsuarioCambiarEmailErrorVisible}
          autoCerrarBotonSi={false}
          onClose={this.onNuevoEmailClose}
          visible={this.state.dialogoNuevoUsuarioActivarUsuarioCambiarEmailVisible || false}
          onBotonSiClick={this.onNuevoEmail}
        />
      </React.Fragment>
    );
  }

  renderCargando() {
    let visible = this.state.cargando;

    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: "white",
          zIndex: 10,
          transition: "opacity 0.3s",
          pointerEvents: visible ? "auto" : "none",
          opacity: visible ? 1 : 0,
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress />
      </div>
    );
  }
}

let componente = PanelNuevoUsuario;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
