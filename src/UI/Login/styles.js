const styles = theme => {
  return {
    root: {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      height: "100%",
      justifyContent: "center"
    },
    contentSwapper: {
      height: "100%",
      flex: 1,
      display: "flex",
      "& > span": { width: "100%" }
    },
    contentSwapperContent: {
      height: "100%",
      width: "100%",
      flex: 1
    },
    content: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      position: "relative"
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
    paginaExtra: {
      position: "absolute",
      backgroundColor: "white",
      height: "100%",
      width: "100%",
      display: "flex",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "all"
      }
    }
  };
};
export default styles;
