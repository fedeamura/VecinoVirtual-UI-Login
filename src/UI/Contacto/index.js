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
import { push, goBack } from "connected-react-router";

import { Typography, Icon, Button, Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

//Mis componentes
import MiCardLogin from "@Componentes/MiCardLogin";
import MiBaner from "@Componentes/MiBaner";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  },
  goBack: () => {
    dispatch(goBack());
  }
});

const mapStateToProps = state => {
  return {};
};

class Contacto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errores: {},
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "",

      cargando: false,
      visible: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ visible: true });
    }, 500);

    this.init();
  }

  init = () => {};

  onBotonVolverClick = () => {
    this.props.goBack();
  };
  onBotonEnviarClick = () => {
    let { nombre, email, telefono, mensaje } = this.state;
    nombre = (nombre || "").trim();
    telefono = (telefono || "").trim();
    email = (email || "").trim();
    mensaje = (mensaje || "").trim();

    if (nombre == "") {
      this.setState({ banerVisible: true, banerMensaje: "El nombre y apellido es un dato requerido", banerModo: "error" });
      return;
    }

    if (email == "") {
      this.setState({ banerVisible: true, banerMensaje: "El email es un dato requerido", banerModo: "error" });
      return;
    }

    if (telefono == "") {
      this.setState({ banerVisible: true, banerMensaje: "El teléfono es un dato requerido", banerModo: "error" });
      return;
    }

    if (mensaje == "") {
      this.setState({ banerVisible: true, banerMensaje: "El mensaje es un dato requerido", banerModo: "error" });
      return;
    }

    this.setState({ cargando: true, banerVisible: false }, async () => {
      try {
        await Rules_Usuario.contacto({
          nombre: nombre,
          email: email,
          telefono: telefono,
          mensaje: mensaje
        });

        this.setState({
          banerModo: "exito",
          banerVisible: true,
          banerMensaje: "Mensaje de contacto enviado correctamente",
          nombre: "",
          email: "",
          telefono: "",
          mensaje: ""
        });
      } catch (ex) {
        let mensaje = typeof ex == "object" ? ex.message : ex;
        this.setState({ banerVisible: true, banerMensaje: mensaje, banerModo: "error" });
      }

      this.setState({ cargando: false });
    });
  };

  onBanerBotonClick = () => {
    this.setState({ banerVisible: false });
  };

  onInputChange = e => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  onInputKeyPress = e => {
    if (e.key == "Enter") {
      this.onBotonEnviarClick();
    }
  };
  render() {
    const { classes } = this.props;
    const { cargando, visible } = this.state;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiCardLogin cargando={cargando || false} visible={visible || false} rootClassName={classes.cardRoot}>
            {this.renderContent()}
          </MiCardLogin>
        </div>
      </React.Fragment>
    );
  }

  renderContent() {
    const { classes } = this.props;
    const { errores, nombre, email, telefono, mensaje } = this.state;

    return (
      <div className={classes.content}>
        <MiBaner
          visible={this.state.banerVisible}
          mensaje={this.state.banerMensaje}
          onBotonClick={this.onBanerBotonClick}
          mostrarBoton={true}
          modo={this.state.banerModo}
        />
        <div className="main">
          <Grid container spacing={16}>
            <Grid item xs={12} />
            <Grid item xs={12}>
              <div className={classes.encabezado}>
                <Typography variant="headline">Contacto</Typography>
              </div>
            </Grid>
            <Grid item xs={12} />

            <Grid item xs={12}>
              <div className={classes.contenedorInfo}>
                <Icon>info_outlined</Icon>
                <Typography variant="body1" className="texto">
                  Complete el formulario y nos comunicaremos con usted a la brevedad
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                autoFocus
                autoComplete="off"
                variant="outlined"
                label="Nombre y Apellido"
                error={errores["nombre"] !== undefined}
                helperText={errores["nombre"]}
                value={nombre}
                name="nombre"
                type="text"
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                autoFocus
                autoComplete="off"
                variant="outlined"
                label="E-Mail"
                error={errores["email"] !== undefined}
                helperText={errores["email"]}
                value={email}
                name="email"
                type="email"
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                autoFocus
                autoComplete="off"
                variant="outlined"
                label="Teléfono"
                error={errores["telefono"] !== undefined}
                helperText={errores["telefono"]}
                value={telefono}
                name="telefono"
                type="text"
                onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                autoFocus
                autoComplete="off"
                variant="outlined"
                multiline={true}
                label="¿En que podemos ayudarlo?"
                error={errores["mensaje"] !== undefined}
                helperText={errores["mensaje"]}
                value={mensaje}
                name="mensaje"
                type="text"
                // onKeyPress={this.onInputKeyPress}
                onChange={this.onInputChange}
              />
            </Grid>
          </Grid>
        </div>
        <div className="footer">
          <div style={{ flex: 1 }}>
            <Button variant="text" color="primary" className={classes.button} onClick={this.onBotonVolverClick}>
              Volver
            </Button>
          </div>

          <Button variant="contained" color="primary" className={classes.button} onClick={this.onBotonEnviarClick}>
            Enviar solicitud de contacto
          </Button>
        </div>
      </div>
    );
  }
}

let componente = Contacto;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
