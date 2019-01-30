import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Compontes
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { InlineDatePicker as DatePicker } from "material-ui-pickers";

import MiBaner from "@Componentes/MiBaner";
import DateUtils from "@Componentes/Utils/Date";

const DNI_TEMPLATE = require("../../../_Resources/imagenes/dni_template.png");
const DNI_TEMPLATE_SEXO = require("../../../_Resources/imagenes/dni_template_sexo.png");
const DNI_TEMPLATE_EJEMPLAR = require("../../../_Resources/imagenes/dni_template_ejemplar.png");
const DNI_TEMPLATE_FECHA = require("../../../_Resources/imagenes/dni_template_fecha.png");
const DNI_TEMPLATE_TRAMITE = require("../../../_Resources/imagenes/dni_template_tramite.png");
const DNI_TEMPLATE_DNI = require("../../../_Resources/imagenes/dni_template_dni.png");

class DialogoDni extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sexo: "",
      ejemplar: "",
      fechaEmision: new Date(),
      dni: "",
      tramite: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    //Visible
    if (nextProps.visible != this.props.visible && nextProps.visible) {
      this.setState({ errorVisible: false, sexo: "", ejemplar: "", fechaEmision: new Date(), dni: "", tramite: "" });
    }

    //Error
    if (nextProps.errorVisible != this.props.errorVisible) {
      this.setState({ errorVisible: nextProps.errorMensaje, errorMensaje: nextProps.errorMensaje });
    }
  }

  onClose = () => {
    this.props.onClose && this.props.onClose();
  };

  onBotonNoClick = () => {
    this.props.onBotonNoClick && this.props.onBotonNoClick();
    let cerrar = !("autoCerrarBotonNo" in this.props) || this.props.autoCerrarBotonNo != false;
    cerrar && this.onClose();
  };

  onBotonSiClick = () => {
    this.props.onBotonSiClick && this.props.onBotonSiClick();
    let cerrar = !("autoCerrarBotonSi" in this.props) || this.props.autoCerrarBotonSi != false;
    cerrar && this.onClose();
  };

  onTextFieldFocus = e => {
    this.setState({ inputFocus: e.currentTarget.name });
  };

  onTextFieldBlur = e => {
    this.setState({ inputFocus: undefined });
  };

  onChange = e => {
    let { name, value } = e.currentTarget;
    switch (name) {
      case "sexo":
        {
          if (value != "") {
            if (value.toLowerCase() != "m" && value.toLowerCase() != "f") {
              return;
            }
          }
          value = value.toUpperCase();
        }
        break;

      case "ejemplar":
        {
          value = value.toUpperCase();
        }
        break;
    }
    this.setState({ [name]: value });
  };

  onInputFechaEmisionChange = fecha => {
    this.setState({ fechaEmision: fecha });
  };

  onReady = () => {
    const { sexo, ejemplar, fechaEmision, dni, tramite } = this.state;

    if (sexo.trim() == "") {
      this.mostrarError("Ingrese el sexo");
      return;
    }

    if (sexo.toLowerCase() != "m" && sexo.toLowerCase() != "f") {
      this.mostrarError("Sexo inválido");
      return;
    }

    if (ejemplar.trim() == "") {
      this.mostrarError("Ingrese el ejemplar");
      return;
    }

    var fecha = DateUtils.toDateString(fechaEmision);
    if (fecha == undefined) {
      this.mostrarError("La fecha de emisión es inválida");
      return;
    }
    console.log(fecha);

    if (dni.trim() == "") {
      this.mostrarError("Ingrese el N° de DNI");
      return;
    }

    if (tramite.trim() == "") {
      this.mostrarError("Ingrese el N° de Trámite");
      return;
    }

    this.onErrorClose();
    this.props.onReady &&
      this.props.onReady({
        sexoMasculino: sexo == "M",
        ejemplar: ejemplar,
        fechaEmision: fecha,
        dni: dni,
        tramite: tramite
      });
  };

  mostrarError = mensaje => {
    this.setState({ errorVisible: true, errorMensaje: mensaje });
  };

  onErrorClose = () => {
    this.setState({ errorVisible: false });
  };

  render() {
    const { classes, fullScreen } = this.props;
    const { inputFocus } = this.state;

    let imagen = DNI_TEMPLATE;
    switch (inputFocus) {
      case "sexo":
        {
          imagen = DNI_TEMPLATE_SEXO;
        }
        break;
      case "ejemplar":
        {
          imagen = DNI_TEMPLATE_EJEMPLAR;
        }
        break;

      case "fechaEmision":
        {
          imagen = DNI_TEMPLATE_FECHA;
        }
        break;

      case "dni":
        {
          imagen = DNI_TEMPLATE_DNI;
        }
        break;

      case "tramite":
        {
          imagen = DNI_TEMPLATE_TRAMITE;
        }
        break;
    }
    return (
      <React.Fragment>
        <Dialog open={this.props.visible || false} onClose={this.onClose} fullScreen={fullScreen} fullWidth maxWidth="md">
          <div>
            <MiBaner
              visible={this.state.errorVisible}
              mensaje={this.state.errorMensaje}
              mostrarBoton={false}
              modo="error"
              mostrarBoton={true}
              onBotonClick={this.onErrorClose}
            />
          </div>

          <DialogTitle id="responsive-dialog-title">Ingrese los datos de su DNI</DialogTitle>

          <DialogContent>
            <Grid container spacing={16}>
              <Grid item xs={fullScreen ? 12 : 4} style={{ marginTop: 16 }}>
                <img
                  src={imagen}
                  style={{
                    maxWidth: 400,
                    width: "100%"
                  }}
                />
              </Grid>
              <Grid item xs={fullScreen ? 12 : 8}>
                <Grid container spacing={16} style={{ marginTop: 16 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      autoComplete="off"
                      label="Sexo"
                      placeholder="M o F"
                      onChange={this.onChange}
                      value={this.state.sexo}
                      name="sexo"
                      inputProps={{ maxLength: 1 }}
                      variant="outlined"
                      onFocus={this.onTextFieldFocus}
                      onBlur={this.onTextFieldBlur}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      inputProps={{ maxLength: 1 }}
                      autoComplete="off"
                      placeholder="A, B, C, D..."
                      label="Ejemplar"
                      name="ejemplar"
                      variant="outlined"
                      onChange={this.onChange}
                      value={this.state.ejemplar}
                      onFocus={this.onTextFieldFocus}
                      onBlur={this.onTextFieldBlur}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <DatePicker
                      keyboard
                      variant="outlined"
                      fullWidth
                      onFocus={this.onTextFieldFocus}
                      onBlur={this.onTextFieldBlur}
                      name="fechaEmision"
                      margin="dense"
                      label="Fecha de emisión"
                      openToYearSelection={true}
                      format="dd/MM/yyyy"
                      labelFunc={this.renderLabelFecha}
                      invalidDateMessage="Fecha inválida"
                      maxDateMessage="Fecha inválida"
                      minDateMessage="Fecha inválida"
                      mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                      value={this.state.fechaEmision}
                      onChange={this.onInputFechaEmisionChange}
                      disableOpenOnEnter
                      animateYearScrolling={false}
                    />

                    {/* <TextField
                      fullWidth
                      autoComplete="off"
                      label="Fecha de Emisión"
                      name="fechaEmision"
                      variant="outlined"
                      onChange={this.onChange}
                      value={this.state.fechaEmision}
                      onFocus={this.onTextFieldFocus}
                      onBlur={this.onTextFieldBlur}
                    /> */}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="N° de DNI"
                      inputProps={{ maxLength: 8 }}
                      name="dni"
                      autoComplete="off"
                      variant="outlined"
                      onChange={this.onChange}
                      value={this.state.dni}
                      onFocus={this.onTextFieldFocus}
                      onBlur={this.onTextFieldBlur}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="N° de Trámite"
                      onChange={this.onChange}
                      name="tramite"
                      inputProps={{ maxLength: 11 }}
                      autoComplete="off"
                      variant="outlined"
                      onFocus={this.onTextFieldFocus}
                      onBlur={this.onTextFieldBlur}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.onClose}>
              Cancelar
            </Button>
            <Button color="primary" onClick={this.onReady}>
              Aceptar
            </Button>
          </DialogActions>
          <div className={classNames(classes.contentOverlayCargando, this.props.cargando && classes.contentOverlayCargandoVisible)} />
          <div className={classNames(classes.contenedorCargando, this.props.cargando === true && classes.contenedorCargandoVisible)}>
            <LinearProgress color="secondary" />
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}

let componente = DialogoDni;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
export default componente;
