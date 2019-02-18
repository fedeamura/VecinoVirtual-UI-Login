let escudoMuniTextoVerde = require("../../../_Resources/imagenes/escudo_muni_texto_verde.png");
let escudoMuniOnlineAnchoVerde = require("../../../_Resources/imagenes/escudo_muni_online_verde_ancho.png");

const styles = theme => {
  return {
    progress: {
      opacity: 1,
      zIndex: "1",
      height: "8px",
      minHeight: "8px",
      /* position: fixed; */
      left: 0,
      right: 0,
      top: "0px",
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
      height: "100%",
      justifyContent: "center"
    },
    cardRoot: {
      marginLeft: "0rem",
      marginRight: "0rem",
      maxWidth: "600px",
      alignSelf: "center",
      width: "calc(100%)",
      height: "100%",
      maxHeight: "100%",
      opacity: 0,
      transform: "translateY(100px)",
      transition: "all 0.3s",
      "& > div": {
        borderRadius: "0 !important"
      },
      [theme.breakpoints.up("sm")]: {
        marginLeft: "2rem",
        marginRight: "2rem",
        width: "calc(100% - 4rem)",
        maxHeight: "550px",
        "& > div": {
          borderRadius: "16px !important"
        }
      },
      ["@media (max-height:650px)"]: {
        marginLeft: "0rem",
        marginRight: "0rem",
        maxWidth: "initial",
        alignSelf: "center",
        width: "calc(100%)",
        height: "100%",
        maxHeight: "100%",
        "& > div": {
          borderRadius: "0px !important"
        }
      },
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
      maxHeight: "100%",
      "& > div": {
        display: "flex",
        flexDirection: "column",
        flex: 1
      }
    },
    header: {
      paddingBottom: "0",
      paddingBottom: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit,
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing.unit * 3,
        paddingRight: theme.spacing.unit * 3
      },
      // ["@media (max-height:650px)"]: {
      //   // eslint-disable-line no-useless-computed-key
      //   paddingLeft: theme.spacing.unit * 3,
      //   paddingRight: theme.spacing.unit * 3
      // },

      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      minHeight: "fit-content"
    },
    contenedorTextosSistema: {
      marginLeft: "16px"
    },
    imagenLogoMuni: {
flex:1,
      marginLeft: "9px",
      height: "48px",
      backgroundSize: "contain",
      backgroundImage: `url(${escudoMuniTextoVerde})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left center"
    },
    imagenLogoMuniOnline: {
      width:200,
      marginLeft: "9px",
      height: "28px",
      backgroundSize: "contain",
      backgroundImage: `url(${escudoMuniOnlineAnchoVerde})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left center"
    },
    content: {
      flex: 1,
      display: "flex",
      flexDirection: "column"
    },
    mainContent: {
      flex: 1,
      overflow: "auto"
    },
    footer: {
      borderTop: "1px solid rgba(0,0,0,0.1)",
      padding: "16px",
      display: "flex"
    },
    footerInfo: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing.unit,
      "& .logo": {
        width: 120,
        height: 36,
        filter: "grayscale(100%)",
        marginRight: 8,
        // backgroundColor: "red",
        backgroundImage: `url(${escudoMuniTextoVerde})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      },
      "& .link": {
        textDecoration: "underline",
        cursor: "pointer",
        color: "rgba(0,0,0,0.6)"
        // "&:not(:last-child)": {
        //   marginRight: theme.spacing.unit
        // }
      },
      "& .separador": {
        width: 8,
        marginLeft: 8,
        marginRight: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: "rgba(0,0,0,0.2)"
      }
    }
  };
};
export default styles;
