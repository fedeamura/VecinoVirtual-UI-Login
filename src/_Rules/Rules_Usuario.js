import _ from "lodash";
const KEY_INFO_PUBLICA = "UIYAUISYNQNNWSDSS";

const metodos = {
  registrar: comando => {
    comando.urlServidor = window.location.origin + window.Config.BASE_URL + "/#/ProcesarActivacionUsuario";

    const url = window.Config.BASE_URL_WS + "/v3/Usuario";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  registrarConQR: comando => {
    comando.urlServidor = window.location.origin + window.Config.BASE_URL + "/#/ProcesarActivacionUsuario";

    const url = window.Config.BASE_URL_WS + "/v3/Usuario/QR";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  registrarConDatosQR: comando => {
    comando.urlServidor = window.location.origin + window.Config.BASE_URL + "/#/ProcesarActivacionUsuario";

    const url = window.Config.BASE_URL_WS + "/v3/Usuario/DatosQR";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  getInfoPublica: username => {
    let url = window.Config.BASE_URL_WS + "/v1/Usuario/InfoPublica";

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          key: KEY_INFO_PUBLICA
        })
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  acceder: (username, password) => {
    let url = window.Config.BASE_URL_WS + "/v1/Usuario/IniciarSesion";

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  generarCuil: comando => {
    const url = window.Config.BASE_URL_WS + "/v1/Usuario/GenerarCuil?dni=" + comando.dni + "&sexoMasculino=" + comando.sexoMasculino;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  validarRenaper: comando => {
    const url = window.Config.BASE_URL_WS + "/v2/Usuario/ValidarRenaper";

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  validarUsername: username => {
    const url = window.Config.BASE_URL_WS + "/v1/Usuario/ExisteUsername?username=" + username;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  //Usuario activado
  validarUsuarioActivadoByUsername: username => {
    let url = window.Config.BASE_URL_WS + "/v2/Usuario/ActivacionCuenta/Validar/Username?username=" + username;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  validarUsuarioActivadoByUserPass: (username, password) => {
    let url = window.Config.BASE_URL_WS + "/v1/Usuario/ActivacionCuenta/Validar";

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username, password: password })
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  iniciarActivacion: comando => {
    const url = window.Config.BASE_URL_WS + "/v2/Usuario/ActivacionCuenta";
    comando.urlServidor = window.location.origin + window.Config.BASE_URL + "/#/ProcesarActivacionUsuario";

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  iniciarActivacionByNumeroTramite: comando => {
    const url = window.Config.BASE_URL_WS + "/v3/Usuario/ActivacionCuenta/NumeroTramite";
    comando.urlServidor = window.location.origin + window.Config.BASE_URL + "/#/ProcesarActivacionUsuario";

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  procesarActivacionUsuario: codigo => {
    const url = window.Config.BASE_URL_WS + "/v2/Usuario/ActivacionCuenta/Procesar?codigo=" + codigo;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  //Recuperacion cuenta
  iniciarRecuperarPassword: comando => {
    return new Promise((resolve, reject) => {
      const url = window.Config.BASE_URL_WS + "/v1/Usuario/RecuperacionCuenta/Iniciar";
      comando.urlServidor = window.location.origin + window.Config.BASE_URL + "/#/ProcesarRecuperarPassword";

      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  procesarRecuperarPassword: comando => {
    return new Promise((resolve, reject) => {
      const url = window.Config.BASE_URL_WS + "/v1/Usuario/RecuperacionCuenta/Procesar";

      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  getRecuperacionCuenta: codigo => {
    const url = window.Config.BASE_URL_WS + "/v1/Usuario/RecuperacionCuenta/Datos?codigo=" + codigo;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  //Usuario reciente
  guardarUsuarioReciente: infoGlobal => {
    infoGlobal.fecha = new Date();

    let usuarios = metodos.getUsuariosRecientes();

    usuarios = _.filter(usuarios, user => {
      return user.username !== infoGlobal.username;
    });
    usuarios.unshift(infoGlobal);
    usuarios.slice(0, 5);
    localStorage.setItem("usuariosRecientes", JSON.stringify(usuarios));
  },
  getUsuariosRecientes: () => {
    let usuarios = localStorage.getItem("usuariosRecientes");
    if (usuarios === undefined || usuarios === "undefined") {
      usuarios = [];
    } else {
      usuarios = JSON.parse(usuarios);
    }

    return usuarios;
  },
  borrarUsuarioReciente: username => {
    let usuarios = localStorage.getItem("usuariosRecientes");
    if (usuarios === undefined || usuarios === "undefined") {
      usuarios = [];
    } else {
      usuarios = JSON.parse(usuarios);
    }

    usuarios = _.filter(usuarios, item => {
      return item.username !== username;
    });
    localStorage.setItem("usuariosRecientes", JSON.stringify(usuarios));
  },
  iniciarNuevoUsuarioQR: data => {
    const url = window.Config.BASE_URL_WS + "/v2/Usuario/QR/IniciarNuevoUsuario";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: data })
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  iniciarNuevoUsuarioByDataQR: data => {
    const url = window.Config.BASE_URL_WS + "/v2/Usuario/DatosQR/IniciarNuevoUsuario";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  contacto: data =>{
    const url = window.Config.BASE_URL_WS + "/v2/Usuario/Contacto";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  }
};

export default metodos;
