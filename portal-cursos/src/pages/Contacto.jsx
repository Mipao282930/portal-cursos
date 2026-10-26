import { useState } from "react";

const valoresIniciales = { nombre: "", correo: "", mensaje: "" };

function validar(valores) {
  const errores = {};

  if (valores.nombre.trim().length < 3) {
    errores.nombre = "Escribe tu nombre (al menos 3 caracteres).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.correo)) {
    errores.correo = "Escribe un correo válido.";
  }
  if (valores.mensaje.trim().length < 10) {
    errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
  }

  return errores;
}

function Contacto() {
  const [valores, setValores] = useState(valoresIniciales);
  const [tocados, setTocados] = useState({});
  const [enviado, setEnviado] = useState(false);
  const errores = validar(valores);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setValores((actuales) => ({ ...actuales, [name]: value }));
    setEnviado(false);
  };

  const manejarBlur = (evento) => {
    setTocados((actuales) => ({ ...actuales, [evento.target.name]: true }));
  };

  const manejarEnvio = (evento) => {
    evento.preventDefault();
    setTocados({ nombre: true, correo: true, mensaje: true });
    if (Object.keys(errores).length) return;
    setEnviado(true);
    setValores(valoresIniciales);
    setTocados({});
  };

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">Estamos para ayudarte</p>
        <h1>Contáctanos</h1>
        <p>Déjanos tu consulta y nuestro equipo se comunicará contigo.</p>
      </div>
      <section className="form-panel">
        <form onSubmit={manejarEnvio} noValidate>
          <div className="form-grid">
            <div className="form-field form-field-full">
              <label htmlFor="nombre-contacto">Nombre completo</label>
              <input
                id="nombre-contacto"
                name="nombre"
                value={valores.nombre}
                onChange={manejarCambio}
                onBlur={manejarBlur}
                autoComplete="name"
                aria-invalid={Boolean(tocados.nombre && errores.nombre)}
              />
              {tocados.nombre && errores.nombre && (
                <span className="field-error">{errores.nombre}</span>
              )}
            </div>
            <div className="form-field form-field-full">
              <label htmlFor="correo-contacto">Correo electrónico</label>
              <input
                id="correo-contacto"
                name="correo"
                type="email"
                value={valores.correo}
                onChange={manejarCambio}
                onBlur={manejarBlur}
                autoComplete="email"
                aria-invalid={Boolean(tocados.correo && errores.correo)}
              />
              {tocados.correo && errores.correo && (
                <span className="field-error">{errores.correo}</span>
              )}
            </div>
            <div className="form-field form-field-full">
              <label htmlFor="mensaje-contacto">Mensaje</label>
              <textarea
                id="mensaje-contacto"
                name="mensaje"
                value={valores.mensaje}
                onChange={manejarCambio}
                onBlur={manejarBlur}
                maxLength={500}
                aria-invalid={Boolean(tocados.mensaje && errores.mensaje)}
              />
              <span className="field-hint">{valores.mensaje.length}/500 caracteres</span>
              {tocados.mensaje && errores.mensaje && (
                <span className="field-error">{errores.mensaje}</span>
              )}
            </div>
          </div>
          <div className="form-actions">
            <button className="button" type="submit">
              Enviar consulta
            </button>
            {enviado && (
              <span role="status" className="field-hint">
                ¡Gracias! Tu consulta fue enviada correctamente.
              </span>
            )}
          </div>
        </form>
      </section>
    </>
  );
}

export default Contacto;
