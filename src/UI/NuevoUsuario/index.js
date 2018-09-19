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

//Componentes
import { Typography } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";

//Mis componentes
import MiCard from "@Componentes/MiCard";
import ContentSwapper from "@Componentes/ContentSwapper";
import PaginaDatosBasicos from "./PaginaDatosBasicos";

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

const PAGINA_DATOS_BASICOS = "DATOS_BASICOS";
const PAGINA_DATOS_ACCESO = "DATOS_ACCESO";

class NuevoUsuario extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      codigo: props.match.params.codigo, //Busco el codigo en el query string
      validandoCodigo: true,
      errorValidandoCodigo: undefined,
      infoLogin: undefined,
      visible: false,
      paginaActual: PAGINA_DATOS_BASICOS
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ visible: true });
    }, 500);

    this.validarCodigo();
  }

  validarCodigo = () => {
    this.setState({ validandoCodigo: true }, () => {
      Rules_Aplicacion.getInfoLogin(this.state.codigo)
        .then(data => {
          this.setState({ infoLogin: data, errorValidandoCodigo: undefined });
        })
        .catch(error => {
          this.setState({
            infoLogin: undefined,
            errorValidandoCodigo: error
          });
        })
        .finally(() => {
          this.setState({ validandoCodigo: false });
        });
    });
  };

  onBotonReintentarValidarCodigoClick = () => {
    this.validarCodigo();
  };

  render() {
    const { classes } = this.props;

    const titulo =
      this.state.infoLogin == undefined
        ? ""
        : this.state.infoLogin.aplicacionNombre;

    const cargando = this.state.cargando || this.state.validandoCodigo;

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
            {/* Linea cargando */}
            <LinearProgress
              className={classNames(classes.progress, cargando && "visible")}
            />

            {/* Encabezado */}
            <div
              className={classes.header}
              style={{ padding: padding, paddingBottom: "16px" }}
            >
              <div className={classes.imagenLogoMuni} />
              <div className={classes.contenedorTextosSistema}>
                <Typography variant="headline">Vecino Virtual</Typography>
                <Typography variant="title">{titulo}</Typography>
              </div>
            </div>

            {/* contenido  */}
            <div className={classes.content}>{this.renderContent()}</div>

            {/* overlay cargando */}
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
    if (this.state.validandoCodigo === true) return null;

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
        </ContentSwapper>
      </div>
    );
  }

  renderPaginaDatosBasicos() {
    return <PaginaDatosBasicos padding={padding} />;
  }

  renderPaginaDatosAcceso() {
    return null;
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
