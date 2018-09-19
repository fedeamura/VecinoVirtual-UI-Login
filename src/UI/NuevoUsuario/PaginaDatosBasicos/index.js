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

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_EstadoCivil from "@Rules/Rules_EstadoCivil";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

class PaginaDatosBasicos extends React.Component {
  static defaultProps = {
    onCargando: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      estadosCiviles: undefined,
      validandoUsuario: false,
      errorValidandoUsuario: undefined,
      nombre: "",
      apellido: "",
      dni: "",
      fechaNacimiento: undefined,
      fechaNacimientoKeyPress: false,
      estadoCivil: undefined,
      sexo: "m"
    };
  }

  componentDidMount() {
    Rules_EstadoCivil.get()
      .then(data => {
        this.setState({
          estadosCiviles: data.map(item => {
            return { value: item.id, label: item.nombre };
          })
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onInputFechaNacimientoChange = fecha => {
    this.setState({ fechaNacimiento: fecha });
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onInputKeyPress = event => {
    if (event.key === "Enter") {
      this.onBotonSiguienteClick();
    }
  };

  onInputFechaNacimientoChange = fecha => {
    this.setState({ fechaNacimiento: fecha });
  };

  onBotonSiguienteClick = () => {};

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
    if (this.state.estadosCiviles == undefined) return null;

    const { classes, padding } = this.props;
    return (
      <div
        className={classes.content}
        style={{ padding: padding, paddingTop: "16px" }}
      >
        <div className={classes.encabezado}>
          <Typography variant="headline">Nuevo Usuario</Typography>
          <Icon>keyboard_arrow_right</Icon>
          <Typography variant="subheading">Datos personales</Typography>
        </div>

        <Grid container spacing={16}>
          <Grid item xs={12} md={6}>
            <FormControl
              className={classes.formControl}
              fullWidth
              margin="dense"
              error={this.state.errorNombre !== undefined}
              aria-describedby="textoNombreError"
            >
              <InputLabel htmlFor="inputNombre">Nombre</InputLabel>
              <Input
                id="inputNombre"
                autoFocus
                value={this.state.nombre}
                name="nombre"
                type="text"
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
              />
              <FormHelperText id="textoNombreError">
                {this.state.errorNombre}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              className={classes.formControl}
              fullWidth
              margin="dense"
              error={this.state.errorApellido !== undefined}
              aria-describedby="textoApellidoError"
            >
              <InputLabel htmlFor="inputApellido">Apellido</InputLabel>
              <Input
                id="inputApellido"
                value={this.state.apellido}
                name="apellido"
                type="text"
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
              />
              <FormHelperText id="textoApellidoError">
                {this.state.errorApellido}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              className={classes.formControl}
              fullWidth
              margin="dense"
              error={this.state.errorDni !== undefined}
              aria-describedby="textoDniError"
            >
              <InputLabel htmlFor="inputDni">N° de Documento</InputLabel>
              <Input
                id="inputDni"
                value={this.state.dni}
                name="dni"
                type="text"
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
              />
              <FormHelperText id="textoDniError">
                {this.state.errorDni}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              keyboard
              style={{ marginTop: "4px", width: "100%" }}
              label="Fecha de nacimiento"
              format="dd/MM/yyyy"
              openToYearSelection={true}
              disableFuture={true}
              labelFunc={this.renderLabelFecha}
              invalidDateMessage="Fecha inválida"
              maxDateMessage="Fecha inválida"
              minDateMessage="Fecha inválida"
              mask={value =>
                value
                  ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
                  : []
              }
              value={this.state.fechaNacimiento}
              onChange={this.onInputFechaNacimientoChange}
              disableOpenOnEnter
              animateYearScrolling={true}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MiSelect
              value={0}
              style={{ width: "100%" }}
              label="Estado civil"
              placeholder="Seleccione..."
              onChange={this.handleChange}
              options={this.state.estadosCiviles}
            />
          </Grid>

          <Grid item xs={12} style={{ marginTop: "16px" }}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Sexo</FormLabel>
              <RadioGroup
                aria-label="Sexo"
                name="sexo"
                value={this.state.sexo}
                onChange={this.onInputSexoChange}
              >
                <FormControlLabel
                  value="m"
                  control={<Radio />}
                  label="Masculino"
                />
                <FormControlLabel
                  value="f"
                  control={<Radio />}
                  label="Femenino"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
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
        <div style={{ flex: 1 }} />

        <Button
          variant="raised"
          color="primary"
          className={classes.button}
          onClick={this.onBotonSiguienteClick}
        >
          Siguiente
        </Button>
      </div>
    );
  }
}

let componente = PaginaDatosBasicos;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
