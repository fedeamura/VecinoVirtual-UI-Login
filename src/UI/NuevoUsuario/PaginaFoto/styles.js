const styles = theme => {
  return {
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      height: "100%",
      overflowX: "hidden"
    },
    content: {
      flex: 1,
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing.unit * 4,
        paddingRight: theme.spacing.unit * 4
      }
    },
    encabezado: {
      minHeight: "fit-content",
      display: "flex",
      alignItems: "center"
    },
    footer: {
      borderTop: "1px solid rgba(0,0,0,0.1)",
      display: "flex",
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing.unit * 4,
        paddingRight: theme.spacing.unit * 4
      }
    },
    dropZone: {
      cursor: "pointer",
      width: 250,
      border: "dotted 1px rgba(0,0,0,0.2)",
      transition: "all 0.3s",
      height: 250,
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      borderRadius: "1rem",
      padding: "1rem",
      position: "relative",
      flexDirection: "column",
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.025) !important"
      },
      "& > div": {
        left: 0,
        position: "relative",
        top: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "all 0.3s"
      },
      "& .img": {
        width: "100px",
        height: "100px",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }
    },
    contenedorForm: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    },
    foto: {
      width: "10rem",
      marginBottom: "1rem",
      height: "10rem",
      opacity: 1,
      transition: "all 0.3s",
      "&.procesando": {
        opacity: 0
      }
    },
    contenedorSlider: {
      display: "flex",
      width: "250px",
      marginTop: theme.spacing.unit * 2,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row"
    },
    slider: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2
    }
  };
};
export default styles;
