const styles = theme => {
  return {
    progress: {
      opacity: 0,
      transition: "opacity 0.3s",
      "&.visible": {
        opacity: 1
      }
    },
    overlayCargando: {
      backgroundColor: "rgba(255,255,255,0.6)",
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      borderRadius: "16px",
      pointerEvents: "none",
      transition: "opacity 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "auto"
      }
    },
    root: {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      height: "100vh",
      justifyContent: "center"
    },
    cardRoot: {
      maxHeight: "550px",
      maxWidth: "600px",
      alignSelf: "center",
      width: "100%",
      height: "100%",
      opacity: 0,
      transform: "translateY(100px)",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        transform: "translateY(0)"
      }
    },
    cardContent: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      "& > div": {
        display: "flex",
        flexDirection: "column",
        flex: 1
      }
    },
    contenedorPaginas: {
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },
    contentSwapper: {
      height: "100%",
      flex: 1,
      display: "flex",
      "& > span": { width: "100%" }
    },
    pagina: {
      position: "absolute",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    header: {
      paddingBottom: "0",
      display: "flex",
      alignItems: "center"
    },
    contenedorTextosSistema: {
      marginLeft: "16px"
    },
    imagenLogoMuni: {
      width: "64px",
      height: "64px",
      backgroundImage:
        "url(https://servicios2.cordoba.gov.ar/VecinoVirtualUtils_Internet/Resources/Imagenes/escudo_verde.png)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center"
    },
    content: {
      padding: "16px"
    },
    botonRecuperarCUIL: {
      cursor: "pointer",
      textDecoration: "underline",
      color: theme.palette.primary.main
    },
    footer: {
      borderTop: "1px solid rgba(0,0,0,0.1)",
      padding: "16px",
      display: "flex"
    },
    contenedorError: {
      flex: 1,
      overflow: "auto",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    iconoError: {
      fontSize: "104px"
    },
    textoError: {
      marginTop: "16px",
      maxWidth: "400px",
      textAlign: "center"
    }
  };
};
export default styles;
