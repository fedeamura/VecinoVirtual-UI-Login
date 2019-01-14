const styles = theme => {
  return {
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      height: "100%"
    },
    contentSwapper: {
      height: "100%",
      flex: 1,
      display: "flex",
      "& > span": { display: "flex", flex: 1, height: "100%" },
      "& > span > div": { display: "flex", flex: 1, height: "100%" }
    },

    pagina: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column"
    },
    content: {
      paddingBottom: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit * 2,
      flex: 1,
      overflow: "auto",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing.unit * 4,
        paddingRight: theme.spacing.unit * 4
      }
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
    icono: {
      fontSize: "104px"
    },
    texto: {
      marginTop: "16px",
      maxWidth: "400px",
      textAlign: "center"
    }
  };
};
export default styles;
