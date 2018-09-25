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
      flexDirection: "column"
    },
    encabezado: {
      display: "flex",
      alignItems: "center"
    },
    footer: {
      borderTop: "1px solid rgba(0,0,0,0.1)",
      padding: "16px",
      display: "flex"
    },
    contenedorError: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.05)",
      minHeight: 0,
      maxHeight: 0,
      height: "100%",
      padding: 0,
      paddingLeft: "2rem",
      paddingRigth: "2rem",
      overflow: "hidden",
      "& > div": {
        width: "100%",
        minHeight: "3rem",
        display: "flex",
        alignItems: "center"
      },
      "& > div > .material-icons": {
        marginRight: "0.5rem"
      },
      "& > div > .texto": {
        flex: 1
      },
      opacity: 0,
      transition: "min-height 0.3s 0.3s, max-height 0.3s 0.3s, opacity 0.3s",
      "&.visible": {
        transition: "min-height 0.3s, max-height 0.3s, opacity 0.3s 0.3s",
        minHeight: "3rem",
        maxHeight: "3rem",
        opacity: 1
      }
    },
    contenedorForm: {
      marginTop: "2rem",
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
    }
  };
};
export default styles;
