import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate, useSearchParams } from "react-router";
import * as Yup from "yup";
import { cursos } from "../data/cursos.js";
import { apiUrl } from "../api.js";

const esquema = Yup.object({
  nombre: Yup.string()
    .trim()
    .min(3, "Escribe al menos 3 letras")
    .required("El nombre es obligatorio"),
  email: Yup.string()
    .email("Correo no válido")
    .required("El correo es obligatorio"),
  dni: Yup.string()
    .matches(/^\d{8}$/, "El DNI tiene 8 dígitos")
    .required("El DNI es obligatorio"),
  telefono: Yup.string()
    .matches(/^9\d{8}$/, "Celular de 9 dígitos que empiece con 9")
    .required("El celular es obligatorio"),
  curso: Yup.string()
    .oneOf(cursos.map((curso) => curso.id), "Elige un curso válido")
    .required("Elige un curso"),
  turno: Yup.string()
    .oneOf(["Mañana", "Tarde", "Noche"])
    .required("Elige un turno"),
  acepta: Yup.boolean().oneOf([true], "Debes aceptar los términos"),
});

function Matricula() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cursoInicial = searchParams.get("curso") ?? "";
  const [errorEnvio, setErrorEnvio] = useState("");

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">Inscripciones abiertas</p>
        <h1>Formulario de matrícula</h1>
        <p>Completa tus datos para reservar tu lugar en el curso.</p>
      </div>
      <section className="form-panel">
        <Formik
          initialValues={{
            nombre: "",
            email: "",
            dni: "",
            telefono: "",
            curso: cursoInicial,
            turno: "",
            acepta: false,
          }}
          enableReinitialize
          validationSchema={esquema}
          onSubmit={async (valores, { setSubmitting }) => {
            setErrorEnvio("");
            try {
              const respuesta = await fetch(apiUrl("/matriculas.php"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(valores),
              });
              const resultado = await respuesta.json();
              if (!respuesta.ok) {
                throw new Error(resultado.error || "No se pudo guardar la matrícula.");
              }
              navigate("/matricula/exito", {
                state: { ...valores, matriculaId: resultado.id },
              });
            } catch (error) {
              setErrorEnvio(
                error instanceof TypeError
                  ? "No se pudo conectar con el servidor. Verifica que Laragon y Apache estén activos."
                  : error.message,
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="nombre">Nombre completo <span>*</span></label>
                  <Field id="nombre" name="nombre" autoComplete="name" />
                  <ErrorMessage className="field-error" name="nombre" component="span" />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Correo electrónico <span>*</span></label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                  />
                  <ErrorMessage className="field-error" name="email" component="span" />
                </div>
                <div className="form-field">
                  <label htmlFor="dni">DNI <span>*</span></label>
                  <Field
                    id="dni"
                    name="dni"
                    inputMode="numeric"
                    autoComplete="off"
                  />
                  <ErrorMessage className="field-error" name="dni" component="span" />
                </div>
                <div className="form-field">
                  <label htmlFor="telefono">Celular <span>*</span></label>
                  <Field
                    id="telefono"
                    name="telefono"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                  <ErrorMessage className="field-error" name="telefono" component="span" />
                </div>
                <div className="form-field">
                  <label htmlFor="curso">Curso <span>*</span></label>
                  <Field id="curso" name="curso" as="select">
                    <option value="">Selecciona un curso</option>
                    {cursos.map((curso) => (
                      <option key={curso.id} value={curso.id}>
                        {curso.titulo}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage className="field-error" name="curso" component="span" />
                </div>
                <fieldset className="form-field form-fieldset form-field-full">
                  <legend className="field-label">Turno <span>*</span></legend>
                  <div className="radio-row">
                    {["Mañana", "Tarde", "Noche"].map((turno) => (
                      <label className="radio-option" key={turno}>
                        <Field type="radio" name="turno" value={turno} />
                        {turno}
                      </label>
                    ))}
                  </div>
                  <ErrorMessage className="field-error" name="turno" component="span" />
                </fieldset>
                <div className="form-field form-field-full">
                  <label className="checkbox-option">
                    <Field type="checkbox" name="acepta" />
                    Acepto los términos y condiciones <span>*</span>
                  </label>
                  <ErrorMessage className="field-error" name="acepta" component="span" />
                </div>
              </div>
              <div className="form-actions">
                <button className="button" type="submit" disabled={isSubmitting}>
                  Enviar matrícula
                </button>
                <span className="field-hint">Los campos marcados con * son obligatorios.</span>
              </div>
              {errorEnvio && <p className="form-error" role="alert">{errorEnvio}</p>}
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
}

export default Matricula;
