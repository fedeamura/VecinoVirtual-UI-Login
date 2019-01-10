import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";

//Componentes
import { Typography, Icon, Button, Grid } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { DatePicker } from "material-ui-pickers";
import MiSelect from "@Componentes/MiSelect";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import _ from "lodash";

//Mis componentes
import Validador from "@Componentes/_Validador";
import MiPanelMensaje from "@Componentes/MiPanelMensaje";
import MiBanerError from "@Componentes/MiBanerError";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_EstadoCivil from "@Rules/Rules_EstadoCivil";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaModo extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onReady: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  onBotonDniClick = () => {
    this.props.onModo && this.props.onModo("dni");
  };

  onBotonAfipClick = () => {
    this.props.onModo && this.props.onModo("afip");
  };

  onBotonManualClick = () => {
    this.props.onModo && this.props.onModo("manual");
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
      <div className={classes.root}>
        {/* Contenido */}
        <div className={classes.content}>
          <div style={{ padding: padding, paddingTop: "16px" }}>
            {/* <div className={classes.encabezado}>
              <Typography variant="headline">Nuevo Usuario</Typography>
            </div> */}

            <Grid container spacing={16}>
              <Grid
                item
                xs={12}
                sm={4}
                style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", marginTop: 16 }}
              >
                <div variant="outlined" onClick={this.onBotonDniClick} className={classes.boton}>
                  <Typography className="titulo" variant="body2">Registrarse usando su DNI</Typography>
                  <Typography className="descripcion" variant="body1">Valide su identidad a través de su Documento Nacional de Identididad</Typography>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", marginTop: 16 }}
              >
                <div variant="outlined" onClick={this.onBotonAfipClick} className={classes.boton}>
                  <Typography className="titulo" variant="body2">Registrarse usando AFIP</Typography>
                  <Typography className="descripcion" variant="body1">Valide su identidad a través de su usuario de AFIP</Typography>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", marginTop: 16 }}
              >
                <div variant="outlined" onClick={this.onBotonManualClick} className={classes.boton}>
                  <Typography className="titulo" variant="body2">Registrarse manualmente</Typography>
                  <Typography className="descripcion" variant="body1">Valide su identidad ingresando manualmente sus datos personales</Typography>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
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
          <Button variant="text" color="primary" className={classes.button} onClick={this.props.onBotonYaEstoyRegistradoClick}>
            Ya estoy registrado
          </Button>
        </div>
      </div>
    );
  }
}

let componente = PaginaModo;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
