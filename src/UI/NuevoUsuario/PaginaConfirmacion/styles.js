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
      // minHeight: 'fit-content',
      alignItems: "center"
    },
    footer: {
      borderTop: "1px solid rgba(0,0,0,0.1)",
      padding: "16px",
      display: "flex"
    },
    contenedorForm: {
      display: "flex",
      flex: 1,
      height: "100%",
      minHeight: "100%",
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
