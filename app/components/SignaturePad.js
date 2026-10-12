'use client';
import { useEffect, useRef } from 'react';

export default function SignaturePad() {
  const canvasRef = useRef(null);
  const state = useRef({ drawing: false, last: null });

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');

    function size() {
      const saved = c.width ? c.toDataURL() : null;
      const r = c.getBoundingClientRect();
      const d = window.devicePixelRatio || 1;
      c.width = Math.max(1, r.width * d);
      c.height = Math.max(1, r.height * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = getComputedStyle(document.body).color;
      if (saved) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height);
        img.src = saved;
      }
    }
    size();
    window.addEventListener('resize', size);
    const before = () => (ctx.strokeStyle = '#000');
    window.addEventListener('beforeprint', before);
    return () => {
      window.removeEventListener('resize', size);
      window.removeEventListener('beforeprint', before);
    };
  }, []);

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const down = (e) => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    state.current.drawing = true;
    state.current.last = pos(e);
    c.setPointerCapture(e.pointerId);
    ctx.beginPath();
    ctx.arc(state.current.last.x, state.current.last.y, 1, 0, 6.3);
    ctx.stroke();
  };

  const move = (e) => {
    if (!state.current.drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const p = pos(e);
    const { last } = state.current;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    state.current.last = p;
  };

  const up = () => (state.current.drawing = false);

  const clear = () => {
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    c.getContext('2d').clearRect(0, 0, r.width, r.height);
  };

  return (
    <>
      <div className="sig">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          aria-label="Signature pad"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        />
        <button type="button" className="ghost" onClick={clear}>
          Clear
        </button>
      </div>
      <div className="sigline">Signature over printed name</div>
    </>
  );
}
