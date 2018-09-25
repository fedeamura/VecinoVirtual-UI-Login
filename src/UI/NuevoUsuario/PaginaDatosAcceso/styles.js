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
    contenedorInfoUsername: {
      display: "flex",
      "& .material-icons": {
        marginRight: "0.5rem"
      }
    }
  };
};
export default styles;
