import green from "@material-ui/core/colors/green";
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
    contenedorInfoRenaper: {
      alignItems: 'center',
      borderRadius: theme.spacing.unit,
      padding: theme.spacing.unit,
      overflow: "hidden",
      backgroundColor: green["500"],
      display: "flex",
      "& .texto": {
        color: "white"
      },
      "& .material-icons": {
        color: "white",
        marginRight: "0.5rem"
      }
    },
    contenedorInfoUsername: {
      alignItems: 'center',
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
    }
  };
};
export default styles;
