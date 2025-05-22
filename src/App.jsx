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
  const [page, setPage] = useState('start');           // 'start' or 'quiz'
  const [questions, setQuestions] = useState([]);      // raw questions array
  const [shuffledQuestions, setShuffledQuestions] = useState([]); // with options shuffled
  const [idx, setIdx] = useState(0);                   // current question index
  const [answers, setAnswers] = useState([]);          // user answers
  const [showImmediate, setShowImmediate] = useState(true);
  const [examMode, setExamMode] = useState(false);

  // Whenever questions change, shuffle options for each question
  useEffect(() => {
    if (!questions.length) return;
    const sq = questions.map((q) => {
      const order = q.options.map((_, i) => i);
      // Shuffle order
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      // Build new options array
      const newOptions = order.map((i) => q.options[i]);
      // Find new index of correct answer
      const newCorrect = order.findIndex((i) => i === q.correct);
      return {
        question: q.question,
        options: newOptions,
        correct: newCorrect,
        explanation: q.explanation
      };
    });
    setShuffledQuestions(sq);
    setIdx(0);
    setAnswers(Array(sq.length).fill(null));
  }, [questions]);

  // Start a tema quiz
  const startQuiz = (temaId) => {
    const tema = temas.find((t) => t.id === temaId);
    setExamMode(false);
    setQuestions(tema.questions);
    setPage('quiz');
  };

  // Shuffle mode: mix all temas
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

  // Exam mode: use custom 30 questions
  const startExam = () => {
    setExamMode(true);
    setQuestions(questionsExam);
    setPage('quiz');
  };

  // START PAGE
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

  // QUIZ PAGE
  const total = shuffledQuestions.length;
  const q = shuffledQuestions[idx] || { options: [], question: '' };
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
      const score = answers.filter((v, i) => v === shuffledQuestions[i].correct).length;
      alert(`Resultados: ${score} de ${total}`);
      setPage('start');
    }
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
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
      <Box sx={{ flex: '1 1 auto', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2, p: 4 }}>
        {q.options.map((opt, i) => (
          <Box
            key={i}
            onClick={() => handleSelect(i)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 5,
              borderColor: answers[idx] === i ? 'primary.main' : 'grey.100',
              borderRadius: 2,
              p: 2,
              fontFamily: 'Futura, sans-serif',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: 10,
              '&:hover': { backgroundColor: 'grey.100', transform: 'scale(1.02)' },
              '&:active': { backgroundColor: 'primary.light', color: 'white' }
            }}
          >
            {opt}
          </Box>
        ))}
      </Box>

      {/* Immediate feedback & explanation */}
      {answers[idx] != null && showImmediate && (
        <Box sx={{ p: 2, fontFamily: 'Futura, sans-serif', fontSize: '1.5rem' }}>
          {answers[idx] === q.correct
            ? '✔️ ¡Correcto!'
            : `❌ Incorrecto. Correcta: ${q.options[q.correct]}`}
          {q.explanation && (
            <Typography sx={{ mt: 1, fontFamily: 'Futura, sans-serif' }}>
              {q.explanation}
            </Typography>
          )}
        </Box>
      )}

      {/* Progress bar */}
      <Box sx={{ height: 20, width: '100%', bgcolor: 'grey.200' }}>
        <Box sx={{ height: '100%', width: `${progress}%`, bgcolor: 'secondary.main', transition: 'width 0.2s' }} />
      </Box>

      {/* Next button */}
      <Box sx={{ p: 2, textAlign: 'center' ,bgcolor: ''}}>
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