import grey from "@material-ui/core/colors/grey";

const styles = theme => {
  return {
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      height: "100%"
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
    contenedorInfo: {
      alignItems: "center",
      borderRadius: theme.spacing.unit,
      padding: theme.spacing.unit,
      overflow: "hidden",
      backgroundColor: grey["200"],
      display: "flex",
      "& .texto": {
        color: "black"
      },
      "& .material-icons": {
        color: "black",
        marginRight: "0.5rem"
      }
    },

    contenedorBotones: {
      display: "flex",
      justifyContent: "center",
      alignItems:'center',
      flexDirection: "column",
      [theme.breakpoints.up("sm")]: {
        flexDirection: "row"
      },
      "& .boton": {
        flex: 1,
        margin: theme.spacing.unit * 2,
        maxWidth: "200px",
        minHeight: "200px",
        backgroundColor: "rgba(0,0,0,0.025)",
        transition: "all 0.3s",
        borderRadius: theme.spacing.unit * 4,
        "& .titulo": {},
        "& .detalle": {
          textTransform: "initial"
        },
        "&:hover": {
          backgroundColor: "white",
          boxShadow: "0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -7px rgba(0,0,0,0.2)"
        }
      }
    }
  };
};
export default styles;
