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

const temas = [
  { id: 1, title: 'Tema 1', questions: questionsTema1 },
  { id: 2, title: 'Tema 2', questions: questionsTema2 },
  { id: 3, title: 'Tema 3', questions: questionsTema3 },
  { id: 4, title: 'Tema 4', questions: questionsTema4 },
];

export default function App() {
  const [page, setPage] = useState('start');    // 'start' or 'quiz'
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showImmediate, setShowImmediate] = useState(true);

  useEffect(() => {
    if (questions.length) {
      setIdx(0);
      setAnswers(Array(questions.length).fill(null));
    }
  }, [questions]);

  const startQuiz = (temaId) => {
    const tema = temas.find(t => t.id === temaId);
    setQuestions(tema.questions);
    setPage('quiz');
  };

  const startShuffle = () => {
    const all = temas.flatMap(t => t.questions);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    setQuestions(all);
    setPage('quiz');
  };

  // START PAGE
  if (page === 'start') {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {temas.map(t => (
          <Typography
            key={t.id}
            onClick={() => startQuiz(t.id)}
            sx={{
              fontFamily: 'Futura, sans-serif',
              fontSize: '8rem',
              color: 'black',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'color 0.2s ease, transform 0.2s ease',
              '&:hover': {
                color: 'primary.main',
                transform: 'scale(1.1)'
              },
              '&:active': {
                color: 'error.main'
              }
            }}
          >
            {t.title}
          </Typography>
        ))}

        <Fab
          color="error"
          size="large"
          onClick={startShuffle}
          sx={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          <ShuffleIcon sx={{ fontSize: 48 }} />
        </Fab>
      </Box>
    );
  }

  // QUIZ PAGE
  const q = questions[idx];
  const total = questions.length;
  const progress = ((idx + 1) / total) * 100;

  const handleSelect = (i) => {
    setAnswers(a => {
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
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header: back + toggle */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={() => setPage('start')} sx={{ fontFamily: 'Futura, sans-serif' }}>
          Volver al menú
        </Button>
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={showImmediate} onChange={e => setShowImmediate(e.target.checked)} />}
            label="Mostrar respuesta inmediata"
            sx={{ fontFamily: 'Futura, sans-serif' }}
          />
        </FormGroup>
      </Box>

      {/* Question */}
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

      {/* Answers grid */}
      <Box
        sx={{
          flex: '1 1 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
          p: 4
        }}
      >
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
              '&:hover': {
                backgroundColor: 'grey.100',
                transform: 'scale(1.02)'
              },
              '&:active': {
                backgroundColor: 'primary.light',
                color: 'white'
              }
            }}
          >
            {opt}
          </Box>
        ))}
      </Box>

      {/* Immediate feedback */}
      {showImmediate && answers[idx] != null && (
        <Box sx={{ p: 2, textAlign: 'center', fontFamily: 'Futura, sans-serif', fontSize: '1.5rem' }}>
          {answers[idx] === q.correct 
            ? '✔️ ¡Correcto!'
            : `❌ Incorrecto. Respuesta correcta: ${q.options[q.correct]}`}
        </Box>
      )}

      {/* Progress bar */}
      <Box sx={{ height: 8, width: '100%', bgcolor: 'grey.200' }}>
        <Box sx={{ height: '100%', width: `${progress}%`, bgcolor: 'primary.main', transition: 'width 0.2s' }} />
      </Box>

      {/* Next button */}
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