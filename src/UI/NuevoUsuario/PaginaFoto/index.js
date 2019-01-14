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
import Avatar from "@material-ui/core/Avatar";
import _ from "lodash";
import red from "@material-ui/core/colors/red";
import loadImage from "blueimp-load-image";
import AvatarEditor from "react-avatar-editor";
import Dropzone from "react-dropzone";
import Slider from "@material-ui/lab/Slider";

//Mis componentes
import MiBanerError from "@Componentes/MiBanerError";
import FOTO_PLACEHOLDER_FEMALE from "@Resources/imagenes/user_placeholder_female.png";
import FOTO_PLACEHOLDER_MALE from "@Resources/imagenes/user_placeholder_male.png";

const MAX_SIZE = 1000;

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaFoto extends React.Component {
  static defaultProps = {
    onCargando: () => {},
    onReady: () => {}
  };

  constructor(props) {
    super(props);

    let datosIniciales = props.datosIniciales || undefined;

    this.state = {
      sexoMasculino: props.sexoMasculino || true,
      mostrarError: false,
      foto: datosIniciales || undefined,
      error: undefined
    };
  }

  onBotonOmitirClick = () => {
    this.setState({ foto: undefined, base64: undefined }, () => {
      this.informarFoto();
      this.props.onReady();
    });
  };

  onBotonSiguienteClick = () => {
    const { foto } = this.state;
    if (foto == undefined) {
      this.setState({ mostrarError: true, error: 'Seleccione una foto. En caso de no desear hacerlo presione "OMITIR"' });
      return;
    }

    this.setState({ mostrarError: false });
    const base64 = this.editor.getImageScaledToCanvas().toDataURL("image/png", 1);
    this.setState({ base64: base64 }, () => {
      this.informarFoto();
      this.props.onReady();
    });
  };

  informarFoto = () => {
    this.props.onFoto(this.state.base64);
  };

  onBotonQuitarFotoClick = () => {
    this.setState({ foto: undefined, base64: undefined, zoom: 1 }, () => {
      this.informarFoto();
    });
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

  handleDrop = dropped => {
    var file = dropped[0];
    this.props.onCargando(true);
    this.setState({ mostrarError: false, zoom: 1 });
    loadImage(
      file,
      canvas => {
        if (canvas.type == "error") {
          this.props.onCargando(false);
          this.setState({ mostrarError: true, error: "Error procesando su imagen. Por favor intente nuevamente" });
          return;
        }

        let foto = canvas.toDataURL("image/png", 0.7);
        this.setState({ procesandoFoto: true }, () => {
          setTimeout(() => {
            this.setState({ foto: foto }, () => {
              this.props.onCargando(false);
              this.setState({
                procesandoFoto: false
              });
            });
          }, 500);
        });
      },
      { maxWidth: MAX_SIZE, orientation: true, canvas: true }
    );
  };

  onSliderChange = (e, value) => {
    this.setState({ zoom: value });
  };

  setEditorRef = ref => {
    this.editor = ref;
  };

  renderContent() {
    const { classes } = this.props;
    const { foto } = this.state;

    return (
      <div className={classes.root}>
        {/* Error */}
        <MiBanerError
          visible={this.state.mostrarError}
          mensaje={this.state.error}
          onClose={() => {
            this.setState({ mostrarError: false });
          }}
        />

        {/* Contenido */}
        <div className={classes.content}>
          <Grid container spacing={16}>
            <Grid item xs={12} />
            <Grid item xs={12}>
              <div className={classes.encabezado}>
                <Typography variant="headline">Nuevo Usuario</Typography>
                <Icon>keyboard_arrow_right</Icon>
                <Typography variant="subheading">Foto</Typography>
              </div>
            </Grid>
            <Grid item xs={12} />

            <Grid item xs={12} style={{ overflowX: "hidden" }}>
              <div className={classes.contenedorForm}>
                {/* <Dropzone onDrop={this.handleDrop} disableClick style={{ width: "250px", height: "250px" }}>
                </Dropzone> */}

                {foto == undefined && (
                  <Dropzone onDrop={this.handleDrop}>
                    {({ getRootProps, getInputProps, isDragActive }) => {
                      return (
                        <div {...getRootProps()} className={classNames("dropzone", { "dropzone--isActive": isDragActive })}>
                          <input {...getInputProps()} />
                          <div className={classes.dropZone}>
                            <div style={{ opacity: isDragActive ? 0 : 1 }}>
                              <div
                                className="img"
                                style={{
                                  backgroundImage:
                                    "url(https://h5p.org/sites/default/files/styles/medium-logo/public/logos/drag-and-drop-icon.png?itok=0dFV3ej6)"
                                }}
                              />
                              <Typography variant="body2" style={{ textAlign: "center" }}>
                                Arrastre y suelte aquí una foto
                              </Typography>

                              <Typography variant="body1" style={{ marginTop: "8px", marginBottom: "8px" }}>
                                o
                              </Typography>
                              <Button variant="outlined">Seleccione un archivo</Button>
                            </div>
                            <div style={{ opacity: isDragActive ? 1 : 0, pointerEvents: "none" }}>
                              <Typography variant="body1" style={{ textAlign: "center" }}>
                                Suelte aquí su foto
                              </Typography>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </Dropzone>
                )}

                {foto != undefined && (
                  <React.Fragment>
                    <div
                      style={{
                        width: "250px",
                        height: "250px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <AvatarEditor
                        ref={this.setEditorRef}
                        width={1000}
                        height={1000}
                        image={this.state.foto}
                        scale={this.state.zoom}
                        borderRadius={500}
                        style={{ borderRadius: "8px", transform: "scale(0.25)" }}
                      />
                    </div>

                    <div className={classes.contenedorSlider}>
                      <Icon>zoom_out</Icon>
                      <Slider
                        classes={{ container: classes.slider }}
                        value={this.state.zoom}
                        aria-labelledby="label"
                        min={1}
                        max={2}
                        onChange={this.onSliderChange}
                      />
                      <Icon>zoom_in</Icon>
                    </div>

                    <Button variant="outlined" onClick={this.onBotonQuitarFotoClick} style={{ marginTop: "16px" }}>
                      Elegir otra foto
                    </Button>
                  </React.Fragment>
                )}
              </div>
            </Grid>
            <Grid item xs={12} />
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

        <div style={{ marginLeft: 8 }} />

        <Button variant="contained" color="primary" className={classes.button} onClick={this.onBotonSiguienteClick}>
          Siguiente
        </Button>
      </div>
    );
  }
}

let componente = PaginaFoto;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
