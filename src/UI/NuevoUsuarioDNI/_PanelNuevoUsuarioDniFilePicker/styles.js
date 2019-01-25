const styles = theme => {
  return {
    root: {
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "white",
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      flexDirection: "column",
      alignItems: "center",
      transition: "opacity 0.5s",
      pointerEvents: "none",
      opacity: 0,
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    },
    contenedor: {
      maxWidth: "100%",
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
      overflow: "hidden",
      /* position: relative; */
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      flexDirection: "column",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "& .hint": {
        paddingLeft: 16,
        paddingRight: 16,
        textAlign: "center"
      },
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    },
    "@keyframes fadeAnimation": {
      from: { opacity: 0.7 },
      to: { opacity: 1 }
    },
    hint: {
      animationDuration: "0.7s",
      animationName: "fadeAnimation",
      animationIterationCount: "infinite",
      animationDirection: "alternate",
      backgroundColor: "rgba(0,0,0,0.3)",
      padding: 4,
      paddingLeft: 8,
      paddingRight: 8,
      borderRadius: 4,
      pointerEvents: "none",
      position: "absolute",
      top: 72,
      color: "white"
    },
    fabCortar: {
      position: "absolute",
      bottom: 16
    },
    botonVolver: {
      position: "absolute",
      top: 16,
      left: 16
    },
    botonCerrar: {
      position: "absolute",
      top: 16,
      right: 16
    },
    contenedorSliderRotate: {
      position: "absolute",
      bottom: 16,
      width: 300,
      borderRadius: 16,
      padding: 16,
      height: 20,
      backgroundColor: "white",
      alignItems: "center",
      display: "flex",
      boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);"
    },
    contenedorSliderZoom: {
      position: "absolute",
      bottom: 60,
      width: 300,
      borderRadius: 16,
      padding: 16,
      height: 20,
      backgroundColor: "white",
      alignItems: "center",
      display: "flex",
      boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);"
    },
    slider: {
      flex: 1,
      marginLeft: 8,
      marginRight: 8
    },
    hideView: {
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    },
    contenedorCargando: {
      zIndex: 10,
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: "white"
    }
  };
};
export default styles;
