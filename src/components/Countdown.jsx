import React, { useEffect, useState, useRef } from 'react';

const inicio = new Date('2025-06-04T08:30:00+02:00').getTime();
const final = new Date('2025-07-03T17:30:00+02:00').getTime();

const ordinales = {
  1: 'Primer', 2: 'Segundo', 3: 'Tercer', 4: 'Cuarto', 5: 'Quinto',
  6: 'Sexto', 7: 'Séptimo', 8: 'Octavo', 9: 'Noveno', 10: 'Décimo',
  11: 'Undécimo', 12: 'Duodécimo', 13: 'Decimotercer', 14: 'Decimocuarto',
  15: 'Decimoquinto', 16: 'Decimosexto', 17: 'Decimoséptimo', 18: 'Decimoctavo',
  19: 'Decimonoveno', 20: 'Vigésimo', 21: 'Vigésimo Primer', 22: 'Vigésimo Segundo',
  23: 'Vigésimo Tercer', 24: 'Vigésimo Cuarto', 25: 'Vigésimo Quinto',
  26: 'Vigésimo Sexto', 27: 'Vigésimo Séptimo', 28: 'Vigésimo Octavo',
  29: 'Vigésimo Noveno'
};

function obtenerOrdinal(numero) {
  if (numero === 30) return 'Final';
  return ordinales[numero] || `Día ${numero}`;
}

function obtenerFase(dia, hora, minutos) {
  const tiempo = hora * 60 + minutos;
  const ordinal = obtenerOrdinal(dia);
  if (ordinal === 'Final') {
    if (tiempo >= 300 && tiempo <= 600) return 'Amanecer del Día Final';
    if (tiempo > 600 && tiempo <= 810) return 'Mañana del Día Final';
    if (tiempo > 810 && tiempo <= 1199) return 'Tarde del Día Final';
    return 'Noche del Día Final';
  } else {
    if (tiempo >= 300 && tiempo <= 600) return `Amanecer del ${ordinal} Día`;
    if (tiempo > 600 && tiempo <= 810) return `Mañana del ${ordinal} Día`;
    if (tiempo > 810 && tiempo <= 1199) return `Tarde del ${ordinal} Día`;
    return `Noche del ${obtenerOrdinal(dia + 1)} Día`;
  }
}

export default function Countdown() {
  const [fase, setFase] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState('');
  const lunaRef = useRef(null);
  const ultimoTemblor = useRef(0);

  useEffect(() => {
    const id = setInterval(actualizarTiempo, 1000);
    actualizarTiempo();
    return () => clearInterval(id);
  }, []);

  function actualizarTiempo() {
    const ahora = new Date();
    const porcentaje = (ahora.getTime() - inicio) / (final - inicio);
    const msDesdeInicio = ahora.getTime() - inicio;
    const dia = Math.floor(msDesdeInicio / (1000 * 60 * 60 * 24)) + 1;

    const body = document.body;
    body.classList.remove('temblor', 'ultimo-dia');
    if (dia >= 28 && dia <= 30) {
      const ahoraSegundos = Date.now();
      if (ahoraSegundos - ultimoTemblor.current > 30000) {
        body.classList.add('temblor');
        setTimeout(() => body.classList.remove('temblor'), 1000);
        ultimoTemblor.current = ahoraSegundos;
      }
    }
    if (dia === 30) body.classList.add('ultimo-dia');

    const hora = ahora.getHours();
    const minutosAhora = ahora.getMinutes();
    setFase(obtenerFase(dia, hora, minutosAhora));

    const diferencia = Math.max(0, final - ahora.getTime());
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    setTiempoRestante(`-Quedan ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')} Horas-`);

    const escala = 1 + porcentaje * 10;
    const desplazamiento = Math.max(0, porcentaje * 100);
    if (lunaRef.current) {
      lunaRef.current.style.transform = `scale(${escala}) translateY(${desplazamiento}px)`;
    }
  }

  return (
    <>
      <div id="mensaje-overlay" style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.6)', padding: '20px 30px', borderRadius: '10px', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 id="fase-dia">{fase}</h1>
        <h2 id="tiempo-restante" style={{ position: 'relative' }}>
          {tiempoRestante}
          <span style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', width: '10px', height: '10px', background: 'blue', borderRadius: '2px' }}></span>
        </h2>
      </div>
      <img src="/Moon.webp" id="luna" alt="Luna descendente" ref={lunaRef} />
      <div id="suelo"></div>
    </>
  );
}
