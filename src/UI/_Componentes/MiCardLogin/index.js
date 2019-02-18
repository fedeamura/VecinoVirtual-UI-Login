import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Compontentes
import LinearProgress from "@material-ui/core/LinearProgress";
import { Typography } from "@material-ui/core";

//Mis componentes
import MiCard from "@Componentes/MiCard";

class MiCardLogin extends React.PureComponent {
  render() {
    const { classes } = this.props;

    let headerVisible = !"headerVisible" in this.props || this.props.headerVisible != false;

    return (
      <MiCard
        padding={false}
        styleCardContent={this.props.styleCardContent}
        styleRoot={this.props.styleRoot}
        rootClassName={classNames(classes.cardRoot, this.props.rootClassName, this.props.visible && "visible")}
        className={classNames(classes.cardContent)}
        footer={this.renderFooter()}
      >
        <LinearProgress className={classNames(classes.progress, this.props.cargando && "visible")} style={this.props.styleCargando} />

        {headerVisible == true && (
          <div className={classes.header}>
            <div className={classes.imagenLogoMuni} />
            <div className={classes.imagenLogoMuniOnline} />

            {/* <div className={classes.contenedorTextosSistema}>
              <Typography variant="headline" noWrap style={{ fontWeight: 200 }}>
                {this.props.titulo}
              </Typography>
              {this.props.subtitulo !== undefined && (
                <Typography variant="title" noWrap>
                  {this.props.subtitulo}
                </Typography>
              )}
            </div> */}
          </div>
        )}

        {this.renderContent()}

        <div className={classNames(classes.overlayCargando, this.props.cargando && "visible")} />
      </MiCard>
    );
  }

  renderContent() {
    const { classes } = this.props;

    return <div className={classes.root}>{this.props.children}</div>;
  }

  renderFooter() {
    const { classes } = this.props;

    return (
      <div className={classes.footerInfo}>
        {/* <div className="logo" /> */}
        <Typography variant="body1" className="link">
          Sobre Muni Online
        </Typography>
        <div className="separador" />
        <Typography variant="body1" className="link">
          Contacto
        </Typography>
        <div className="separador" />
        <Typography variant="body1" className="link">
          Términos y condiciones de uso
        </Typography>
      </div>
    );
  }
}

let componente = MiCardLogin;
componente = withStyles(styles)(componente);
export default componente;
