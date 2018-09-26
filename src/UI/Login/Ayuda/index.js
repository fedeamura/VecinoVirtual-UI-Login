import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";
import "@UI/transitions.css";

//REDUX
import { connect } from "react-redux";

//Componentes
import {
  Typography,
  Grid,
  Icon,
  Button,
  IconButton,
  Input
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";

//Mis recursos
import ImagenHelper from "@Resources/imagenes/avatar_help.png";
import ImagenHeader from "@Resources/imagenes/chat_soporte_header.png";

const mapDispatchToProps = dispatch => ({});
const mapStateToProps = state => {
  return {};
};

class LoginAyuda extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      input: "",
      abierto: false,
      mensajes: [
        {
          mio: false,
          mensaje:
            "Hola! Soy el asistente virtual de Vecino Virtual. Podes preguntarme cualquier cosa y yo intentare ayudarte"
        }
      ]
    };
  }

  toggle = () => {
    this.setState({ abierto: !this.state.abierto });
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onInputKeyPress = event => {
    if (event.key === "Enter") {
      this.onBotonEnviarClick();
    }
  };

  onScrollRef = ref => {
    this.scroll = ref;
  };

  onBotonEnviarClick = () => {
    let { input, mensajes } = this.state;
    if (input.trim() == "") return;

    mensajes.push({
      mio: true,
      mensaje: input || "Sin texto"
    });

    if (mensajes.length % 3 == 0) {
      mensajes.push({
        mio: false,
        mensaje: "Respuesta automatica"
      });
    }

    this.setState({ mensajes: mensajes, input: "" }, () => {
      this.scroll.scrollTop = this.scroll.scrollHeight;
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div
          className={classes.persona}
          style={{
            backgroundImage: "url(" + ImagenHelper + ")"
          }}
        />
        {/* <Lottie
          options={opcionesAnimExito}
          height={150}
          width={150}
          style={{ minHeight: "150px" }}
        /> */}
        <Paper className={classNames(classes.burbuja)} onClick={this.toggle}>
          <Icon>chat</Icon>
          <Typography variant="body1">Necesitas ayuda?</Typography>
        </Paper>

        <Paper
          className={classNames(classes.panel, this.state.abierto && "abierto")}
        >
          <div className={classes.panelEncabezado}>
            <div>
              <Typography variant="title">Asistente virtual</Typography>
            </div>
            <IconButton onClick={this.toggle}>
              <Icon>close</Icon>
            </IconButton>
          </div>
          <div
            className={classes.panelContentHeader}
            style={{ backgroundImage: "url(" + ImagenHeader + ")" }}
          />
          <div className={classes.panelContent}>
            <div className={classes.contenedorMensajes} ref={this.onScrollRef}>
              {this.state.mensajes.map((item, index) => {
                return <Mensaje key={index} classes={classes} data={item} />;
              })}
            </div>

            <div className={classes.contenedorInput}>
              <Input
                value={this.state.input}
                onChange={this.onInputChange}
                name="input"
                className={classes.input}
                disableUnderline={true}
                onKeyPress={this.onInputKeyPress}
                margin="none"
                placeholder="¿Con qué necesitas ayuda?"
              />

              <IconButton onClick={this.onBotonEnviarClick}>
                <Icon color="primary">send</Icon>
              </IconButton>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

class Mensaje extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <Card
        className={classNames(
          classes.mensaje,
          this.props.data.mio == true && classes.mensajeMio
        )}
      >
        <Typography align={this.props.data.mio == true ? "right" : "left"}>
          {this.props.data.mensaje}
        </Typography>
      </Card>
    );
  }
}

let componente = LoginAyuda;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
