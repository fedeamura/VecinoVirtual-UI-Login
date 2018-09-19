import _ from "lodash";

const KEY_INFO_PUBLICA = "UIYAUISYNQNNWSDSS";

let baseURL =
  "https://servicios2.cordoba.gov.ar/WSVecinoVirtual_Bridge/v1/Usuario";
baseURL = "http://localhost:7294/v1/Usuario";

const baseURL_v2 =  "http://localhost:7294/v2/Usuario"

const metodos = {
  getInfoPublica: username => {
    let url = baseURL + "/InfoPublica";

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
    let url = baseURL + "/IniciarSesion";

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
    const url =
      baseURL +
      "/GenerarCuil?dni=" +
      comando.dni +
      "&sexoMasculino=" +
      comando.sexoMasculino;

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
  validarUsuarioActivado: (username, password) => {
    let url = baseURL + "/ActivacionCuenta/Validar";

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
  iniciarActivacion: comando => {
    const url = baseURL + "/ActivacionCuenta/Iniciar";
    comando.urlServidor = "http://localhost:3000/ProcesarActivacionUsuario";

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
    const url = baseURL_v2 + "/ActivacionCuenta/Procesar?codigo=" + codigo;
console.log(url);
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
      const url = baseURL + "/RecuperacionCuenta/Iniciar";
      const urlServidor = "http://localhost:3000/ProcesarRecuperarPassword";
      comando.urlServidor = urlServidor;

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
      const url = baseURL + "/RecuperacionCuenta/Procesar";

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
    const url = baseURL + "/RecuperacionCuenta/Datos?codigo=" + codigo;

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
  }
};

export default metodos;
