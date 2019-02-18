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
import { Button, Grid, ButtonBase, Typography, Icon } from "@material-ui/core";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return {};
};

class PaginaModo extends React.Component {
  static defaultProps = {
    onBotonVolverClick: () => {},
    onReady: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  onBotonDniClick = () => {
    this.props.onReady("dni");
  };

  onBotonManualClick = () => {
    this.props.onReady("manual");
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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <Grid container spacing={16}>
            <Grid item xs={12} />

            <Grid item xs={12}>
              <div className={classes.contenedorInfo}>
                <Icon>info_outline</Icon>
                <Typography variant="body1" className="texto">
                  Seleccione la forma en la que desea crear su usuario
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} />

            <Grid item xs={12}>
              <div className={classes.contenedorBotones}>
                <Button variant="outlined" onClick={this.onBotonManualClick} className={"boton"}>
                  <div>
                    <Typography variant="body2" className="titulo">
                      Manualmente
                    </Typography>
                    <Typography className="detalle">Ingrese manualmente sus datos personales</Typography>
                  </div>
                </Button>
                <Button variant="outlined" onClick={this.onBotonDniClick} className={"boton"}>
                  <div>
                    <Typography variant="body2" className="titulo">
                      Automáticamente
                    </Typography>
                    <Typography className="detalle">Use una foto del último ejemplar de su DNI para validar su identidad</Typography>
                  </div>
                </Button>
              </div>
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
          {this.props.desdeQR != true && (
            <Button variant="text" color="primary" className={classes.button} onClick={this.props.onBotonVolverClick}>
              Volver
            </Button>
          )}
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
