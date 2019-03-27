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
import TextField from "@material-ui/core/TextField";
import _ from "lodash";
import memoize from "memoize-one";

//Mis componentes
import Validador from "@Componentes/_Validador";
import MiSelect from "@Componentes/MiSelect";
import MiBanerError from "@Componentes/MiBanerError";
import StringUtils from "@Componentes/Utils/String";

//Rukes
import Rules_EstadoCivil from "@Rules/Rules_EstadoCivil";
import Rules_Ocupacion from "@Rules/Rules_Ocupacion";
import Rules_EstudioAlcanzado from "@Rules/Rules_EstudioAlcanzado";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaDatosExtra extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onReady: () => {}
  };

  constructor(props) {
    super(props);

    let datosIniciales = props.datosIniciales || {};

    this.state = {
      //datos
      idEstadoCivil: datosIniciales.idEstadoCivil,
      idOcupacion: datosIniciales.idOcupacion,
      idEstudioAlcanzado: datosIniciales.idEstudioAlcanzado,
      cantidadHijos: datosIniciales.cantidadHijos,
      mostrarError: false,
      errores: []
    };
  }

  componentDidMount() {
    this.buscarDatos();
  }

  buscarDatos = async () => {
    this.props.onCargando(true);
    let estadosCiviles = await Rules_EstadoCivil.get();
    let ocupaciones = await Rules_Ocupacion.get();
    let estudiosAlcanzados = await Rules_EstudioAlcanzado.get();
    this.setState({ estadosCiviles, ocupaciones, estudiosAlcanzados });
    this.props.onCargando(false);
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value, errores: { ...this.state.errores, [e.target.name]: undefined } });
  };

  onInputKeyPress = event => {
    if (event.key === "Enter") {
      this.onBotonSiguienteClick();
    }
  };

  onBotonOmitirClick = () => {
    this.props.onReady(undefined);
  };

  onBotonSiguienteClick = () => {
    let { idEstadoCivil, idEstudioAlcanzado, idOcupacion, cantidadHijos } = this.state;

    let errores = [];
    this.setState({ errores: errores });

    if (cantidadHijos != "") {
      cantidadHijos = parseInt(cantidadHijos);

      if (cantidadHijos < 0) {
        errores["cantidadHijos"] = "Cantidad de hijos inválida";
      }
    } else {
      cantidadHijos = null;
    }

    //Si hay errores, corto aca
    this.setState({ errores: errores });
    let conError = false;
    for (var prop in errores) {
      if (errores.hasOwnProperty(prop) && errores[prop] != undefined) {
        conError = true;
      }
    }

    if (conError) return;

    this.props.onReady({
      idEstadoCivil: idEstadoCivil,
      idEstudioAlcanzado: idEstudioAlcanzado,
      idOcupacion: idOcupacion,
      cantidadHijos: cantidadHijos
    });
  };

  getOpcionesEstadosCiviles = memoize(data => {
    if (!data) return [];
    return data.map(item => {
      return {
        value: item.id,
        label: StringUtils.toTitleCase(item.nombre)
      };
    });
  });

  getEstudiosAlcanzados = memoize(data => {
    if (!data) return [];
    return data.map((item, index) => {
      let n = index + 1 + " | " + StringUtils.toTitleCase(item.nombre);
      return {
        value: item.id,
        label: n
      };
    });
  });

  getOcupaciones = memoize(data => {
    if (!data) return [];
    return data.map(item => {
      return {
        value: item.id,
        label: StringUtils.toTitleCase(item.nombre)
      };
    });
  });

  onOcupacionChange = e => {
    this.setState({
      idOcupacion: e != undefined ? e.value : undefined
    });
  };

  onEstadoCivilChange = e => {
    this.setState({
      idEstadoCivil: e != undefined ? e.value : undefined
    });
  };

  onEstudioAlcanzadoChange = e => {
    this.setState({
      idEstudioAlcanzado: e != undefined ? e.value : undefined
    });
  };

  onInputChange = e => {
    this.setState({
      errores: {
        ...this.state.errores,
        [e.currentTarget.name]: undefined
      },
      [e.currentTarget.name]: e.currentTarget.value
    });
  };

  onInputKeyPress = e => {
    if (e.key == "Enter") {
      this.onBotonSiguienteClick();
    }
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

  onErrorClose = () => {
    this.setState({ mostrarError: false });
  };

  renderContent() {
    const { classes } = this.props;

    const opcionesEstadoCivil = this.getOpcionesEstadosCiviles(this.state.estadosCiviles);
    const ocupaciones = this.getOcupaciones(this.state.ocupaciones);
    const estudiosAlcanzados = this.getEstudiosAlcanzados(this.state.estudiosAlcanzados);

    return (
      <div className={classes.root}>
        {/* Error */}
        <MiBanerError visible={this.mostrarError} mensaje={this.state.error} onClose={this.onErrorClose} />

        {/* Contenido */}
        <div className={classes.content}>
          <Grid container spacing={16}>
            <Grid item xs={12} />
            <Grid item xs={12}>
              <div className={classes.encabezado}>
                <Typography variant="headline">Nuevo Usuario</Typography>
                <Icon>keyboard_arrow_right</Icon>
                <Typography variant="subheading">Datos adicionales</Typography>
              </div>
            </Grid>
            <Grid item xs={12} />

            <Grid item xs={12}>
              <Grid container spacing={16}>
                <Grid item xs={12} sm={6}>
                  <MiSelect
                    value={this.state.idEstadoCivil}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    options={opcionesEstadoCivil}
                    onChange={this.onEstadoCivilChange}
                    label="Estado civil"
                    placeholder="Seleccione..."
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MiSelect
                    margin="dense"
                    value={this.state.idOcupacion}
                    onChange={this.onOcupacionChange}
                    fullWidth
                    variant="outlined"
                    options={ocupaciones}
                    label="Profesión / Oficio"
                    placeholder="Seleccione..."
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MiSelect
                    margin="dense"
                    fullWidth
                    value={this.state.idEstudioAlcanzado}
                    onChange={this.onEstudioAlcanzadoChange}
                    variant="outlined"
                    options={estudiosAlcanzados}
                    label="Estudios alcanzados"
                    placeholder="Seleccione..."
                  />
                </Grid>

                {/* Cantidad hijos */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    autoComplete="off"
                    type="number"
                    error={this.state.errores["cantidadHijos"] !== undefined}
                    helperText={this.state.errores["cantidadHijos"]}
                    label="Cantidad de Hijos"
                    autoFocus
                    inputProps={{
                      maxLength: 80
                    }}
                    value={this.state.cantidadHijos != null ? this.state.cantidadHijos : ""}
                    name="cantidadHijos"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

  renderFooter() {
    const { classes } = this.props;

    return (
      <div className={classes.footer}>
        <div style={{ flex: 1 }}>
          <Button variant="text" color="primary" className={classes.button} onClick={this.props.onBotonVolverClick}>
            Volver
          </Button>
        </div>

        <Button color="primary" className={classes.button} onClick={this.onBotonOmitirClick}>
          Omitir
        </Button>

        <div style={{ marginLeft: "8px" }} />

        <Button variant="contained" color="primary" className={classes.button} onClick={this.onBotonSiguienteClick}>
          Siguiente
        </Button>
      </div>
    );
  }
}

let componente = PaginaDatosExtra;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
