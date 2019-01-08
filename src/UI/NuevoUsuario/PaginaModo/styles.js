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
    boton: {
      maxWidth:'250px',
      minHeight:'200px',
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      padding: 16,
      borderRadius: 8,
      transition:'all 0.3s',
      border: '1px solid rgba(0,0,0,0.1)',
      cursor:'pointer',
      '& *':{
        cursor:'pointer',
      },
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.05)"
      },
      "& .titulo": {
        textAlign: "center"
      },
      "& .descripcion": {
        textAlign: "center"
      }
    }
  };
};
export default styles;
