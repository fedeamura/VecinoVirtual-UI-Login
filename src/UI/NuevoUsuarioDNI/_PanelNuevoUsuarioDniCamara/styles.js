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
    contenedorCamaraInfo: {
      backgroundColor: "rgba(0,0,0,0.8)",
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      flexDirection: "column",
      alignItems: "center",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    },
    contenedorPanelFoto: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    },
    camaraEncuadre: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      border: "4px solid white",
      borderRadius: 16,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    },
    camara: {
      backgroundImage: "url(https://www.elintransigente.com/u/fotografias/fotosnoticias/2018/8/7/467495.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    camaraEncuadreTop: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 36,
      backgroundColor: "rgba(0,0,0,0.4)",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    },
    camaraEncuadreLeft: {
      position: "absolute",
      left: 0,
      width: 0,
      top: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    },
    camaraEncuadreRight: {
      position: "absolute",
      right: 0,
      width: 0,
      top: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    },
    camaraEncuadreBottom: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    },
    botonCamara: {
      position: "absolute",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
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
    tomandoFoto: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "white",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    },
    hideView: {
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1
      }
    }
  };
};
export default styles;
