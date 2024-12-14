import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { initialQuestions } from "./initialQuestions";
import { initialUsers } from "./initialUsers";
import { descriptions } from "./descriptions";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/form" element={<SleepForm />} />
      </Routes>
    </BrowserRouter>
  );
}

function SleepForm() {
  const [actualUser, SetActualUser] = useState(null);
  const [close, setClose] = useState(true);
  const [actualQuestion, setActualQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(false);
  const [diagnostic, setDiagnostic] = useState({ name: "", sum: 0 });

  let diagnosticAux = { name: "", sum: 0 };
  const questions = initialQuestions;
  const desc = descriptions;

  const diseases = [
    { name: "insomnia", sum: 0 },
    { name: "circadian", sum: 0 },
    { name: "apnea", sum: 0 },
    { name: "parasomnia", sum: 0 },
    { name: "narcolepsy", sum: 0 },
  ];

  function handleClose() {
    setClose(!close);
  }

  function handleLogin(id) {
    SetActualUser(id);
  }

  function onLogOut() {
    SetActualUser("");
  }

  function handleSetAnswer(e) {
    setAnswers({ ...answers, [actualQuestion]: Number(e.target.value) });
    setError(false);
  }

  function handleNextQuestion() {
    if (!answers[actualQuestion] && answers[actualQuestion] !== 0)
      setError(true);
    else {
      setActualQuestion((cur) => (cur < questions.length ? cur + 1 : cur));
      setError(false);
    }
  }

  function handlePreviousQuestion() {
    setActualQuestion((cur) => (cur > 0 ? cur - 1 : cur));
    setError(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    handleSum();
    diseases.map((disease) =>
      disease.sum > diagnosticAux.sum ? (diagnosticAux = disease) : disease
    );
    console.log(diseases);

    setDiagnostic(diagnosticAux);
    if (diagnosticAux.sum < 8) {
      diagnosticAux.name = "healthy";
    }

    handleClose();
  }

  function handleSum() {
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].disorder === "Insomnio") {
        diseases[0].sum += answers[i];
      }

      if (questions[i].disorder === "Trastorno del Ritmo Circadiano") {
        diseases[1].sum += answers[i];
      }

      if (questions[i].disorder === "Apnea del Sueño") {
        diseases[2].sum += answers[i];
      }

      if (questions[i].disorder === "Parasomnias") {
        diseases[3].sum += answers[i];
      }

      if (questions[i].disorder === "Narcolepsia") {
        diseases[4].sum += answers[i];
      }
    }
  }

  return (
    <div className="app">
      <Header
        onLogin={handleLogin}
        actualUser={actualUser}
        onLogOut={onLogOut}
      />
      <Form
        onClose={handleClose}
        onNextQuestion={handleNextQuestion}
        onPreviousQuestion={handlePreviousQuestion}
        actualQuestion={actualQuestion}
        onSubmit={handleSubmit}
        onSetAnswer={handleSetAnswer}
        onSum={handleSum}
        answers={answers}
        questions={questions}
        error={error}
      />
      <AboutUs />
      <Footer />
      {!close && (
        <Results
          onClose={handleClose}
          diagnostic={diagnostic}
          descriptions={desc}
        />
      )}
    </div>
  );
}

function AboutUs() {
  return (
    <div className="about-us">
      {/* <Button>Acerca de nosotros</Button>
      <Button>Servicios</Button>
      <Button>Testimonios</Button> */}
    </div>
  );
}

function Header({ onLogin, actualUser, onLogOut }) {
  return (
    <header className="header">
      <img className="icon" src="./icon.png" alt="delta icon" />
      <div className="titles">
        <h1>Transtornos del sueño</h1>
        <h2>Bienvenido</h2>
      </div>
      {!actualUser ? (
        <Login onLogin={onLogin} />
      ) : (
        <div className="login">
          <p>{`Hola, ${actualUser.name}!`}</p>

          <Button onClick={onLogOut}>Cerrar sesion</Button>
        </div>
      )}
    </header>
  );
}

function Login({ onLogin }) {
  const users = initialUsers;
  const [inputUser, setInputUser] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!inputUser) return;

    users.map((user) => user.id === inputUser && onLogin(user));
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <p>Ingresar</p>
      <input
        type="text"
        placeholder="Matricula"
        value={inputUser}
        onChange={(e) => setInputUser(e.target.value)}
      />
    </form>
  );
}

function Form({
  onSubmit,
  actualQuestion,
  onPreviousQuestion,
  onNextQuestion,
  onSetAnswer,
  answers,
  questions,
  onSum,
  error,
}) {
  return (
    <>
      <form className="entire-form" onSubmit={onSubmit}>
        {questions.map((question) => (
          <Question
            question={question}
            key={question.question}
            actualQuestion={actualQuestion}
            onSetAnswer={onSetAnswer}
            answers={answers}
            onSum={onSum}
            error={error}
          />
        ))}
        <div className="select-buttons">
          <Button onClick={onPreviousQuestion} type="button">
            Anterior
          </Button>
          <p>{`Pregunta ${actualQuestion + 1} de ${questions.length}`}</p>
          {actualQuestion < questions.length - 1 ? (
            <Button onClick={onNextQuestion} type="button">
              Siguiente
            </Button>
          ) : (
            <input type="submit" value="Ver resultados" />
          )}
        </div>

        {error && <p className="error">¡Eligue una respuesta por favor!</p>}
      </form>
    </>
  );
}

function Button({ children, type, onClick }) {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  );
}

function Question({ question, actualQuestion, onSetAnswer, answers, onSum }) {
  return (
    <>
      {actualQuestion === question.num && (
        <>
          <p className="question-text">{question.question}</p>
          <div className="options">
            <ul>
              <li>
                {question.options.map((option, i) => (
                  <Option
                    num={question.num}
                    option={option}
                    key={option}
                    i={i}
                    onSetAnswer={onSetAnswer}
                    answers={answers}
                    actualQuestion={actualQuestion}
                    onSum={onSum}
                  />
                ))}
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function Option({ num, option, i, onSetAnswer, answers, actualQuestion }) {
  return (
    <div className="option">
      <label className="custom-label-option">
        <input
          type="radio"
          name={num}
          value={i}
          onChange={onSetAnswer}
          id={i}
          checked={answers[actualQuestion] === i}
        />
        {i === 0 && <span className="option-label">A</span>}
        {i === 1 && <span className="option-label">B</span>}
        {i === 2 && <span className="option-label">C</span>}
        {i === 3 && <span className="option-label">D</span>}
        <label className="q-label" htmlFor={i}>
          {option}
        </label>
      </label>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <div className="slogan">
        <p>
          Tu fuente confiable para mejorar el bienestar y el sueño saludable.
        </p>
      </div>
      <div className="contact">
        <p>
          Contáctanos: <br />
          Correo electrónico: dreamlab@gmail.com <br />
          Teléfono: +52 223-115-4387
        </p>
      </div>
      <div className="copyright">
        <span>© 2024 DreamLab - Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}

function Results({ onClose, diagnostic, descriptions }) {
  return (
    <div className="results">
      <div className="close">
        <Button type="button" onClick={onClose}>
          X
        </Button>
      </div>
      <div className="results-text">
        <h2 className="diagnostic">
          {diagnostic.name === "insomnia" && "Usted tiene Insomnio"}
          {diagnostic.name === "circadian" &&
            "Usted tiene Transtorno del ritmo circadiano"}
          {diagnostic.name === "apnea" && "Usted tiene Apnea del sueño"}
          {diagnostic.name === "parasomnia" && "Usted tiene Parasomnia"}
          {diagnostic.name === "narcolepsy" && "Usted tiene Narcolepsia"}
          {diagnostic.name === "healthy" && "Usted está durmiendo bien"}
        </h2>
        <p className="description">
          {diagnostic.name === "insomnia" && `${descriptions[0]}`}
          {diagnostic.name === "circadian" && `${descriptions[1]}`}
          {diagnostic.name === "apnea" && `${descriptions[2]}`}
          {diagnostic.name === "parasomnia" && `${descriptions[3]}`}
          {diagnostic.name === "narcolepsy" && `${descriptions[4]}`}
          {diagnostic.name === "healthy" && `${descriptions[5]}`}
        </p>
      </div>
      <div className="results-buttons">
        <Button onClick={() => (window.location.href = "/")}>
          Volver al inicio
        </Button>
        <Button onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  );
}

function HomeHeader() {
  return (
    <div className="home-header">
      <div className="home-titles">
        <h2>Perfil de la compañia</h2>
        <h1>DreamLab</h1>
        <h2 className="slogan">Descubre el secreto de un buen descanso</h2>
      </div>
      <div className="home-logo">
        <img src="\icon.png" alt="dreamlab-icon" />
      </div>
    </div>
  );
}

function HomeContent() {
  return (
    <>
      <div className="home-content">
        <div className="home-content-text">
          <div className="home-mision">
            <h3>Misión</h3>
            <p>
              En DreamLab, ayudamos a las personas a identificar y comprender
              sus patrones de sueño para mejorar su descanso y calidad de vida.
              Nuestro objetivo es ofrecer herramientas innovadoras y accesibles
              que permitan a nuestros usuarios conciliar el sueño de manera
              efectiva y saludable, en un entorno seguro y confiable.
            </p>
          </div>
          <div className="home-vision">
            <h3>Visión</h3>
            <p>
              Convertirnos en la plataforma líder para la detección y
              optimización de problemas de sueño, especialmente entre los
              jóvenes. Nos esforzamos por ser reconocidos por nuestro compromiso
              con el bienestar, la innovación y la tecnología, promoviendo un
              mundo donde el descanso adecuado sea parte esencial de la vida de
              cada persona.
            </p>
          </div>
          <div className="button-formulario">
            <Button onClick={() => (window.location.href = "/form")}>
              Realizar test
            </Button>
          </div>
        </div>
        <div className="home-image">
          <img src="\images\ang.jpg" alt="reloj" />
        </div>
      </div>
    </>
  );
}
function Homepage() {
  return (
    <>
      <div className="home">
        <div className="circle"></div>
        <HomeHeader />
        <HomeContent />
        <Valores />
      </div>
      <ValoresFooter />
    </>
  );
}

function Valores() {
  return (
    <div className="valores-home">
      <ValoresContent />
    </div>
  );
}

function ValoresContent() {
  return (
    <div className="valores-container">
      <div className="wrap">
        <div className="valores-text">
          <div className="line"></div>
          <h2>Valores</h2>
          <div className="line"></div>
        </div>
        <div className="valores">
          <ValoresIcons src="\icons\inovacion.png" alt="innovation">
            Innovación
          </ValoresIcons>
          <ValoresIcons src="\icons\compromiso.png" alt="compromiso">
            Compromiso con la salud
          </ValoresIcons>
          <ValoresIcons src="\icons\accesibilidad.png" alt="accesibilidad">
            Accesibilidad
          </ValoresIcons>
          <ValoresIcons src="\icons\eficiencia.png" alt="eficiecia">
            Eficiencia
          </ValoresIcons>
          <ValoresIcons src="\icons\transparencia.png" alt="transparencia">
            Transparencia
          </ValoresIcons>
          <ValoresIcons src="\icons\empatia.png" alt="empatia">
            Empatia
          </ValoresIcons>
        </div>
      </div>
      <div className="valores-foot-text">
        <p>
          DreamLab es una herramienta de apoyo en el camino hacia un sueño
          reparador, acompañamos a nuestros usuarios desde el inicio de su
          búsqueda por mejorar su descanso.
        </p>
      </div>
    </div>
  );
}

function ValoresIcons({ src, alt, children }) {
  return (
    <div className="valores-icon">
      <img src={src} alt={alt} />
      <p className="valores-icon-text">{children}</p>
    </div>
  );
}

function ValoresFooterIcon({ children, src, alt }) {
  return (
    <div className="valores-footer-icon">
      <img src={src} alt={alt} />
      <p>{children}</p>
    </div>
  );
}

function ValoresFooter() {
  return (
    <div className="valores-footer">
      <h4>Contact</h4>
      <div className="valores-wrap">
        <ValoresFooterIcon src="\icons\phone.png">
          +52 223-115-4387
        </ValoresFooterIcon>
        <ValoresFooterIcon src="\icons\web.png">
          www.dreamlab.com
        </ValoresFooterIcon>
        <ValoresFooterIcon src="\icons\mail.png">
          DreamLab@gmail.com
        </ValoresFooterIcon>
        <ValoresFooterIcon src="\icons\user.png">@DreamLab11</ValoresFooterIcon>
      </div>
    </div>
  );
}
