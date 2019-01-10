const styles = theme => {
  return {
    root: {
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "white",
      width: "100%",
      height: "100%",
      display: "flex",
      pointerEvents: "none",
      opacity: 0,
      transition: "all 0.3s",
      "&.visible": {
        pointerEvents: "auto",
        opacity: 1
      }
    }
  };
};
export default styles;
