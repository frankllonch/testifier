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
import bgStart from './background.png';

const temas = [
  { id: 1, title: 'Tema 1', questions: questionsTema1 },
  { id: 2, title: 'Tema 2', questions: questionsTema2 },
  { id: 3, title: 'Tema 3', questions: questionsTema3 },
  { id: 4, title: 'Tema 4', questions: questionsTema4 },
];

export default function App() {
  const [page, setPage] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showImmediate, setShowImmediate] = useState(true);
  const [examMode, setExamMode] = useState(false);

  useEffect(() => {
    if (questions.length) {
      setIdx(0);
      setAnswers(Array(questions.length).fill(null));
    }
  }, [questions]);

  const startQuiz = (temaId) => {
    const tema = temas.find((t) => t.id === temaId);
    setExamMode(false);
    setQuestions(tema.questions);
    setPage('quiz');
  };

  const startShuffle = () => {
    const all = temas.flatMap((t) => t.questions);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    setExamMode(false);
    setQuestions(all);
    setPage('quiz');
  };

  const startExam = () => {
    setExamMode(true);
    setQuestions(questionsExam);
    setPage('quiz');
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
          backgroundRepeat: 'no-repeat',
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
            bgcolor: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(4px)',
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
              fontSize: '8rem',
              color: 'black',
              cursor: 'pointer',
              userSelect: 'none',
              position: 'relative',
              zIndex: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.4)',
              transition: 'color 0.2s ease, transform 0.2s ease',
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
            fontSize: '8rem',
            color: 'black',
            cursor: 'pointer',
            userSelect: 'none',
            position: 'relative',
            zIndex: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.4)',
            transition: 'color 0.2s ease, transform 0.2s ease',
            '&:hover': { color: 'primary.main', transform: 'scale(1.1)' },
            '&:active': { color: 'error.main' }
          }}
        >
          Examen
        </Typography>

        <Fab
          color="error"
          size="large"
          onClick={startShuffle}
          sx={{ position: 'absolute', top: '5%', transform: 'translateY(-50%)', zIndex: 2 }}
        >
          <ShuffleIcon sx={{ fontSize: 48 }} />
        </Fab>
      </Box>
    );
  }

  const q = questions[idx];
  const total = questions.length;
  const progress = ((idx + 1) / total) * 100;

  const handleSelect = (i) => {
    setAnswers((a) => {
      const copy = [...a];
      copy[idx] = i;
      return copy;
    });
  };

  const next = () => {
    if (idx < total - 1) {
      setIdx(idx + 1);
    } else {
      const score = answers.filter((v, i) => v === questions[i].correct).length;
      alert(`Resultados: ${score} de ${total}`);
      setPage('start');
    }
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={() => setPage('start')} sx={{ fontFamily: 'Futura, sans-serif' }}>
          Volver al menú
        </Button>
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={showImmediate} onChange={(e) => setShowImmediate(e.target.checked)} />}
            label="Mostrar respuesta inmediata"
            sx={{ fontFamily: 'Futura, sans-serif' }}
          />
        </FormGroup>
      </Box>

      <Box
        sx={{
          flex: '0 0 50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          fontFamily: 'Futura, sans-serif',
          fontSize: '4rem',
          transition: 'color 0.2s',
          '&:hover': { color: 'primary.main' }
        }}
      >
        {`Pregunta ${idx + 1}: ${q.question}`}
      </Box>

      <Box sx={{ flex: '1 1 auto', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2, p: 4 }}>
        {q.options.map((opt, i) => (
          <Box
            key={i}
            onClick={() => handleSelect(i)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 1,
              borderColor: answers[idx] === i ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 2,
              fontFamily: 'Futura, sans-serif',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: 1,
              '&:hover': { backgroundColor: 'grey.100', transform: 'scale(1.02)' },
              '&:active': { backgroundColor: 'primary.light', color: 'white' }
            }}
          >
            {opt}
          </Box>
        ))}
      </Box>

      {answers[idx] != null && (
        <Box sx={{ p: 2, fontFamily: 'Futura, sans-serif', fontSize: '1.5rem' }}>
          {showImmediate && (answers[idx] === q.correct ? '✔️ ¡Correcto!' : `❌ Incorrecto. Correcta: ${q.options[q.correct]}`)}
          {examMode && (
            <Typography sx={{ mt: 1, fontFamily: 'Futura, sans-serif' }}>{q.explanation}</Typography>
          )}
        </Box>
      )}

      <Box sx={{ height: 8, width: '100%', bgcolor: 'grey.200' }}>
        <Box sx={{ height: '100%', width: `${progress}%`, bgcolor: 'primary.main', transition: 'width 0.2s' }} />
      </Box>

      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={next}
          sx={{ fontFamily: 'Futura, sans-serif', fontSize: '1.25rem', px: 4 }}
        >
          {idx < total - 1 ? 'Siguiente' : 'Finalizar'}
        </Button>
      </Box>
    </Box>
  );
}
