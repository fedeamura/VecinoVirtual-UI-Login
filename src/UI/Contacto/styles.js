import grey from "@material-ui/core/colors/grey";

const styles = theme => {
  return {
    root: {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      height: "100%",
      justifyContent: "center"
    },
    cardRoot: {
      maxHeight: "100%",
      [theme.breakpoints.up("sm")]: {
        maxHeight: "670px"
      },
      maxWidth: "900px",
      alignSelf: "center",
      height: "100%",
      opacity: 0,
      transform: "translateY(100px)",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        transform: "translateY(0)"
      }
    },
    content: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      "& .main": {
        flex: 1,
        overflow:'auto',
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        [theme.breakpoints.up("sm")]: {
          paddingLeft: theme.spacing.unit * 4,
          paddingRight: theme.spacing.unit * 4
        }
      },
      "& .footer": {
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
      }
    },
    encabezado: {
      minHeight: "fit-content",
      display: "flex",
      alignItems: "center"
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
    }
  };
};
export default styles;
