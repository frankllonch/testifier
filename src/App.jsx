import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Fab,
  Button,
  Switch,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';

import questionsTema1 from './questionsTema1.json';
import questionsTema2 from './questionsTema2.json';
import questionsTema3 from './questionsTema3.json';
import questionsTema4 from './questionsTema4.json';
import questionsExam from './questionsExam.json';
import questionsCode from './questionsCode.json'; // nueva sección code
import bgStart from './background.png';

const temas = [
  { id: 1, title: 'Tema 1', questions: questionsTema1 },
  { id: 2, title: 'Tema 2', questions: questionsTema2 },
  { id: 3, title: 'Tema 3', questions: questionsTema3 },
  { id: 4, title: 'Tema 4', questions: questionsTema4 }
];

export default function App() {
  const [page, setPage] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showImmediate, setShowImmediate] = useState(true);

  useEffect(() => {
    if (!questions.length) return;

    // --- Shuffle question order ---
    const questionsCopy = [...questions];
    for (let i = questionsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
    }

    // --- Shuffle options for each question ---
    const sq = questionsCopy.map((q) => {
      const order = q.options.map((_, i) => i);
      for (let k = order.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [order[k], order[j]] = [order[j], order[k]];
      }
      const newOptions = order.map((i) => q.options[i]);
      const newCorrect = order.findIndex((i) => i === q.correct);
      return { question: q.question, options: newOptions, correct: newCorrect, explanation: q.explanation };
    });

    setShuffledQuestions(sq);
    setIdx(0);
    setAnswers(Array(sq.length).fill(null));
  }, [questions]);

  const startQuiz = (temaId) => {
    const tema = temas.find((t) => t.id === temaId);
    setQuestions(tema.questions);
    setPage('quiz');
  };
  const startShuffle = () => {
    const all = temas.flatMap((t) => t.questions);
    setQuestions(all);
    setPage('quiz');
  };
  const startExam = () => {
    setQuestions(questionsExam);
    setPage('quiz');
  };
  const startCode = () => {
    setQuestions(questionsCode);
    setPage('quiz');
  };

  const finishQuiz = () => {
    const total = shuffledQuestions.length;
    const score = answers.filter((v, i) => v === shuffledQuestions[i].correct).length;
    alert(`Resultados: ${score} de ${total}`);
    setPage('start');
  };

  if (page === 'start') {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${bgStart})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(235,235,235,1)',
            backdropFilter: 'blur(3px)',
            zIndex: 1
          }
        }}
      >
        {temas.map((t) => (
          <Typography
            key={t.id}
            onClick={() => startQuiz(t.id)}
            sx={{
              fontFamily: 'Futura, sans-serif',
              fontSize: '6rem',
              color: 'black',
              cursor: 'pointer',
              userSelect: 'none',
              position: 'relative',
              zIndex: 2,
              textShadow: '0 9px 15px rgba(0,0,0,1)',
              transition: '0.2s',
              '&:hover': { color: 'primary.main', transform: 'scale(1.1)' },
              '&:active': { color: 'error.main' }
            }}
          >
            {t.title}
          </Typography>
        ))}
        <Typography
          onClick={startExam}
          sx={{
            fontFamily: 'Futura, sans-serif',
            fontSize: '6rem',
            color: 'black',
            cursor: 'pointer',
            userSelect: 'none',
            position: 'relative',
            zIndex: 2,
            textShadow: '0 9px 15px rgba(0,0,0,1)',
            transition: '0.2s',
            '&:hover': { color: 'primary.main', transform: 'scale(1.1)' },
            '&:active': { color: 'error.main' }
          }}
        >
          Examen
        </Typography>
        <Typography
          onClick={startCode}
          sx={{
            fontFamily: 'Futura, sans-serif',
            fontSize: '9rem',
            color: 'black',
            cursor: 'pointer',
            userSelect: 'none',
            position: 'relative',
            zIndex: 2,
            textShadow: '0 9px 15px rgba(0,0,0,1)',
            transition: '0.2s',
            '&:hover': { color: 'primary.main', transform: 'scale(1.1)' },
            '&:active': { color: 'error.main' }
          }}
        >
          Code
        </Typography>
        <Fab color="primary.dark" size="large" onClick={startShuffle} sx={{ position: 'relative', top: -15, zIndex: 2 }}>
          <ShuffleIcon sx={{ fontSize: 48 }} />
        </Fab>
      </Box>
    );
  }

  const total = shuffledQuestions.length;
  const q = shuffledQuestions[idx] || { options: [], question: '' };
  const progress = ((idx + 1) / total) * 100;

  const handleSelect = (i) => {
    if (answers[idx] != null) return;
    setAnswers((a) => { const c = [...a]; c[idx] = i; return c; });
  };
  const goPrev = () => { if (idx > 0) setIdx(idx - 1); };
  const goNext = () => { if (idx < total - 1) setIdx(idx + 1); };

  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: 'rgba(235,235,235,1)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={() => setPage('start')} color="primary" sx={{ fontFamily: 'Futura, sans-serif' }}>
          Volver al menú
        </Button>
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={showImmediate} onChange={(e) => setShowImmediate(e.target.checked)} color="primary" />}
            label="Mostrar respuesta inmediata"
            sx={{ fontFamily: 'Futura, sans-serif' }}
          />
        </FormGroup>
      </Box>
      <Box
        sx={{
          position: 'relative',
          flex: '0 0 20vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 8,
          fontFamily: 'Futura, sans-serif',
          fontSize: '4rem',
          transition: 'color 0.2s',
          '&:hover': { color: 'white' }
        }}
      >
        {`Pregunta ${idx + 1}: ${q.question}`}
        <Box onClick={goPrev} sx={{ position: 'absolute', left: 16, fontSize: '3rem', cursor: idx > 0 ? 'pointer' : 'default', color: idx > 0 ? 'black' : 'grey.400' }}>&#x25C0;</Box>
        <Box onClick={goNext} sx={{ position: 'absolute', right: 16, fontSize: '3rem', cursor: idx < total - 1 ? 'pointer' : 'default', color: idx < total - 1 ? 'black' : 'grey.400' }}>&#x25B6;</Box>
      </Box>
      <Box sx={{ flex: '1 1 auto', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 0.4, p: 0 }}>
        {q.options.map((opt, i) => (
          <Box
            key={i}
            onClick={() => handleSelect(i)}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 3,
              borderColor: answers[idx] == null
                ? 'rgba(235,235,235,1)'
                : i === q.correct
                  ? 'yellow'
                  : i === answers[idx]
                    ? 'black'
                    : 'rgba(235,235,235,1)',
              borderRadius: 1, p: 1, fontFamily: 'Futura, sans-serif', fontSize: '4rem',
              cursor: answers[idx] == null ? 'pointer' : 'default', pointerEvents: answers[idx] != null ? 'none' : 'auto',
              transition: '0.4s', boxShadow: 2,
              '&:hover': { backgroundColor: 'rgba(235,235,235,1)', transform: 'scale(1.01)', color: 'primary.main' },
              '&:active': { backgroundColor: 'primary', color: 'rgba(235,235,235,1)' }
            }}
          >
            {opt}
          </Box>
        ))}
      </Box>
      {answers[idx] != null && showImmediate && (
        <Box sx={{ p: 4, fontFamily: 'Futura, sans-serif', fontSize: '1.75rem' }}>
          {answers[idx] === q.correct
            ? '✔️ ¡No tan tonto!'
            : `❌ Tonto. Aprende: ${q.options[q.correct]}`}<Typography sx={{ mt: 2, fontFamily: 'Futura, sans-serif', fontSize: '2rem' }}>{q.explanation}</Typography>
        </Box>
      )}
      <Box sx={{ height: 15, width: '100%', bgcolor: 'primary.main' }}>
        <Box sx={{ height: '100%', width: `${progress}%`, bgcolor: 'yellow', transition: 'width 0.2s' }} />
      </Box>
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(235,235,235,1)' }}>
        <Button variant="contained" onClick={idx < total - 1 ? goNext : finishQuiz} sx={{ bgcolor: 'rgba(235,235,235,1)', '&:hover': { bgcolor: 'rgba(215,215,215,1)', color: 'primary.main' }, fontFamily: 'Futura, sans-serif', fontSize: '2rem', color: 'black', px: 3 }}>
          {idx < total - 1 ? 'Siguiente' : 'Finalizar'}
        </Button>
      </Box>
    </Box>
  );
}