const styles = theme => {
  return {
    root: {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      height: "100%",
      justifyContent: "center"
    },
    cardContent: {
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },
    content: {
      flex: 1,
      padding: "2rem",
      height: "100%",
      position: "relative"
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
    }

    // root: {
    //   position: "absolute",
    //   left: 0,
    //   top: 0,
    //   right: 0,
    //   bottom: 0,
    //   backgroundColor: "white",
    //   width: "100%",
    //   height: "100%",
    //   display: "flex",
    //   pointerEvents: "none",
    //   opacity: 0,
    //   transition: "all 0.3s",
    //   "&.visible": {
    //     pointerEvents: "auto",
    //     opacity: 1
    //   }
    // }
  };
};
export default styles;
