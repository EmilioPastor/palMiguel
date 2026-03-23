import { useState, useEffect } from "react";

const SEED_DATE = "2026-03-23";

const INITIAL_DATA = [
  { muscleGroup: "ESPALDA", exercise: "Jalón", weight: 70, reps: 8 },
  { muscleGroup: "ESPALDA", exercise: "Remo", weight: 55, reps: 10 },
  { muscleGroup: "ESPALDA", exercise: "Deltoides trasero", weight: 40, reps: 10 },
  { muscleGroup: "ESPALDA", exercise: "Pull over", weight: 25, reps: 8 },
  { muscleGroup: "BÍCEPS", exercise: "Máquina predicadora", weight: 27.5, reps: 10 },
  { muscleGroup: "BÍCEPS", exercise: "Sentado vertical", weight: 42.5, reps: 12 },
  { muscleGroup: "BÍCEPS", exercise: "Martillo", weight: 20, reps: 10 },
  { muscleGroup: "PECHO", exercise: "Press plano sentado", weight: 35, reps: 10 },
  { muscleGroup: "PECHO", exercise: "Press banca inclinado", weight: 24, reps: 9 },
  { muscleGroup: "PECHO", exercise: "Aperturas", weight: 50, reps: 10 },
  { muscleGroup: "PIERNAS", exercise: "Aductor", weight: 110, reps: 12 },
  { muscleGroup: "PIERNAS", exercise: "Abductor", weight: 95, reps: 12 },
  { muscleGroup: "PIERNAS", exercise: "Extensión", weight: 92.5, reps: 10 },
  { muscleGroup: "PIERNAS", exercise: "Curl Femoral", weight: 87.5, reps: 10 },
  { muscleGroup: "PIERNAS", exercise: "Jaca", weight: 40, reps: 10 },
  { muscleGroup: "PIERNAS", exercise: "Prensa", weight: 160, reps: 11 },
  { muscleGroup: "HOMBRO", exercise: "Elevaciones laterales", weight: 8, reps: 14 },
  { muscleGroup: "HOMBRO", exercise: "Elevación frontal polea", weight: 15, reps: 12 },
  { muscleGroup: "HOMBRO", exercise: "Press Militar", weight: 20, reps: 10 },
  { muscleGroup: "TRÍCEPS", exercise: "Extensión", weight: 27.5, reps: 12 },
  { muscleGroup: "TRÍCEPS", exercise: "Ninja", weight: 17.5, reps: 10 },
  { muscleGroup: "TRÍCEPS", exercise: "Extensión máquina", weight: 47.5, reps: 11 },
];

const MUSCLE_GROUPS = ["ESPALDA", "BÍCEPS", "PECHO", "PIERNAS", "HOMBRO", "TRÍCEPS"];
const MUSCLE_EMOJIS = { ESPALDA: "🏋️", BÍCEPS: "💪", PECHO: "🫀", PIERNAS: "🦵", HOMBRO: "🎯", TRÍCEPS: "⚡" };
const MUSCLE_COLORS = { ESPALDA: "#f97316", BÍCEPS: "#ef4444", PECHO: "#3b82f6", PIERNAS: "#10b981", HOMBRO: "#8b5cf6", TRÍCEPS: "#f59e0b" };

const EXERCISE_LIBRARY = INITIAL_DATA.reduce((acc, d) => {
  if (!acc[d.muscleGroup]) acc[d.muscleGroup] = [];
  if (!acc[d.muscleGroup].includes(d.exercise)) acc[d.muscleGroup].push(d.exercise);
  return acc;
}, {});

const formatDate = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "2-digit" });
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#070707;--s1:#101010;--s2:#161616;--s3:#1c1c1c;
    --acc:#f97316;--acc2:#fb923c;--red:#ef4444;--green:#22c55e;--blue:#3b82f6;
    --txt:#f0f0f0;--muted:#555;--border:#222;
  }
  body{background:var(--bg);color:var(--txt);font-family:'Barlow',sans-serif;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px}

  .app{min-height:100vh;background:var(--bg)}

  /* HEADER */
  .hdr{
    background:rgba(7,7,7,0.95);
    border-bottom:1px solid var(--border);
    padding:18px 20px 0;
    position:sticky;top:0;z-index:200;
    backdrop-filter:blur(24px);
  }
  .hdr-top{display:flex;align-items:center;gap:14px;margin-bottom:18px}
  .avatar{
    width:46px;height:46px;flex-shrink:0;
    background:linear-gradient(135deg,#f97316,#dc2626);
    border-radius:12px;display:flex;align-items:center;justify-content:center;
    font-family:'Bebas Neue';font-size:20px;color:#fff;letter-spacing:1px;
    box-shadow:0 4px 20px rgba(249,115,22,0.35);
  }
  .hdr-name{font-family:'Bebas Neue';font-size:26px;letter-spacing:2px;line-height:1}
  .hdr-sub{font-size:11px;color:var(--muted);font-weight:600;letter-spacing:1.5px;text-transform:uppercase;margin-top:2px}
  .hdr-sub span{color:var(--acc)}

  .tabs{display:flex;overflow-x:auto;scrollbar-width:none}
  .tabs::-webkit-scrollbar{display:none}
  .tab{
    padding:11px 18px;font-family:'Barlow Condensed';font-size:13px;font-weight:700;
    letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);
    cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;
    white-space:nowrap;background:none;border-left:none;border-right:none;border-top:none;
  }
  .tab:hover{color:var(--txt)}
  .tab.on{color:var(--acc);border-bottom-color:var(--acc)}

  /* CONTENT */
  .content{padding:20px;max-width:780px;margin:0 auto}

  /* HERO BANNER */
  .banner{
    background:linear-gradient(135deg,#130800,#1a0f00,#0d0d0d);
    border:1px solid rgba(249,115,22,0.2);
    border-radius:18px;padding:22px 24px;margin-bottom:22px;
    position:relative;overflow:hidden;
  }
  .banner::after{
    content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse at 90% 50%,rgba(249,115,22,0.08),transparent 60%);
    pointer-events:none;
  }
  .banner-title{font-family:'Bebas Neue';font-size:26px;letter-spacing:3px;color:var(--acc);line-height:1}
  .banner-sub{font-size:13px;color:#7a4a1a;margin-top:5px;font-weight:500}
  .banner-emoji{position:absolute;right:20px;top:50%;transform:translateY(-50%);font-size:48px;opacity:0.25}

  /* STAT GRID */
  .sgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px}
  .sc{
    background:var(--s2);border:1px solid var(--border);border-radius:14px;
    padding:18px;position:relative;overflow:hidden;cursor:default;
  }
  .sc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--acc),transparent)}
  .sc-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;font-weight:700;margin-bottom:8px}
  .sc-val{font-family:'Bebas Neue';font-size:34px;color:var(--acc);letter-spacing:1px;line-height:1}
  .sc-unit{font-family:'Barlow';font-size:12px;color:var(--muted);margin-top:2px}

  /* SECTION TITLES */
  .stitle{
    font-family:'Bebas Neue';font-size:16px;letter-spacing:3px;color:var(--muted);
    margin-bottom:14px;display:flex;align-items:center;gap:10px;
  }
  .stitle::after{content:'';flex:1;height:1px;background:var(--border)}

  /* MUSCLE CHIPS */
  .mchips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
  .mchip{
    padding:8px 14px;border-radius:8px;font-family:'Barlow Condensed';
    font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;
    cursor:pointer;border:1px solid var(--border);background:var(--s2);color:var(--muted);
    transition:all .2s;
  }
  .mchip:hover{border-color:#333;color:var(--txt)}
  .mchip.on{color:#fff;border-color:transparent}

  /* EXERCISE ROWS */
  .exrow{
    background:var(--s2);border:1px solid var(--border);border-radius:12px;
    padding:14px 18px;margin-bottom:8px;display:flex;
    align-items:center;justify-content:space-between;
    transition:border-color .2s;border-left:3px solid transparent;
  }
  .exrow:hover{border-color:#2a2a2a}
  .ex-name{font-weight:600;font-size:14px;margin-bottom:3px}
  .ex-date{font-size:11px;color:var(--muted)}

  .badges{display:flex;gap:7px;align-items:center;flex-wrap:wrap}
  .bw{background:rgba(249,115,22,0.12);color:var(--acc);padding:5px 11px;border-radius:7px;font-family:'Barlow Condensed';font-weight:700;font-size:14px}
  .br{background:rgba(255,255,255,0.04);color:#888;padding:5px 11px;border-radius:7px;font-family:'Barlow Condensed';font-weight:700;font-size:14px}
  .bvol{color:#444;font-size:11px;font-family:'Barlow Condensed';font-weight:600}

  .pr-badge{
    background:linear-gradient(135deg,#f97316,#dc2626);color:#fff;
    padding:2px 7px;border-radius:4px;font-size:10px;
    font-family:'Barlow Condensed';font-weight:700;letter-spacing:1px;
  }

  /* BUTTONS */
  .btn{
    padding:11px 22px;border-radius:9px;font-family:'Barlow Condensed';
    font-weight:700;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;
    cursor:pointer;border:none;transition:all .2s;
  }
  .btn-p{background:var(--acc);color:#fff}
  .btn-p:hover{background:var(--acc2);transform:translateY(-1px);box-shadow:0 4px 20px rgba(249,115,22,.3)}
  .btn-g{background:transparent;color:var(--muted);border:1px solid var(--border)}
  .btn-g:hover{color:var(--txt);border-color:#333}
  .btn-full{width:100%;margin-bottom:22px;margin-top:4px}

  /* FORM */
  .fmodal{background:var(--s2);border:1px solid var(--border);border-radius:18px;padding:22px;margin-bottom:22px}
  .frow{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
  .fgrp{display:flex;flex-direction:column;gap:5px}
  .flabel{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1.2px;font-weight:700}
  .finput{
    background:var(--s3);border:1px solid var(--border);border-radius:8px;
    padding:10px 13px;color:var(--txt);font-family:'Barlow';font-size:14px;
    outline:none;transition:border-color .2s;width:100%;
  }
  .finput:focus{border-color:var(--acc)}
  .finput option{background:var(--s3)}
  .fbtns{display:flex;gap:9px;justify-content:flex-end;margin-top:14px}

  /* CHART */
  .chart-box{background:var(--s2);border:1px solid var(--border);border-radius:14px;padding:22px;margin-bottom:18px}
  .chart-lbl{font-size:11px;color:var(--muted);font-family:'Barlow Condensed';letter-spacing:1.5px;font-weight:700;text-transform:uppercase;margin-bottom:14px}

  /* PROGRESS SELECT */
  .psel-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:22px}
  .psel-btn{
    padding:10px 13px;background:var(--s2);border:1px solid var(--border);
    border-radius:8px;color:var(--muted);font-family:'Barlow';font-size:13px;
    cursor:pointer;text-align:left;transition:all .2s;
  }
  .psel-btn:hover,.psel-btn.on{border-color:var(--acc);color:var(--txt);background:rgba(249,115,22,0.07)}

  /* HISTORY */
  .hdate-grp{margin-bottom:22px}
  .hdate-lbl{
    font-family:'Bebas Neue';font-size:15px;letter-spacing:2px;color:var(--muted);
    margin-bottom:10px;display:flex;align-items:center;gap:10px;
  }
  .hdate-lbl::after{content:'';flex:1;height:1px;background:var(--border)}

  /* EMPTY */
  .empty{text-align:center;padding:52px 20px;color:var(--muted)}
  .empty-ico{font-size:52px;margin-bottom:14px}
  .empty-ttl{font-family:'Bebas Neue';font-size:22px;letter-spacing:2px;margin-bottom:6px;color:#333}

  /* FAB */
  .fab{
    position:fixed;bottom:26px;right:26px;width:54px;height:54px;
    background:var(--acc);border-radius:14px;border:none;color:#fff;font-size:26px;
    cursor:pointer;box-shadow:0 8px 32px rgba(249,115,22,.45);
    transition:all .2s;display:flex;align-items:center;justify-content:center;z-index:100;
  }
  .fab:hover{transform:scale(1.1) rotate(8deg)}

  /* MUSCLE SECTION TITLE */
  .mg-label{
    font-family:'Barlow Condensed';font-weight:800;font-size:13px;
    letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;
    display:flex;align-items:center;gap:8px;
  }

  /* STATS ROW */
  .stats3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}

  .tag-inicio{
    background:rgba(249,115,22,0.1);color:var(--acc);padding:1px 7px;border-radius:4px;
    font-size:11px;font-family:'Barlow Condensed';font-weight:700;letter-spacing:1px;
  }
`;

export default function MiguelGymTracker() {
  const [tab, setTab] = useState("dashboard");
  const [workouts, setWorkouts] = useState([]);
  const [bodyWeights, setBW] = useState([]);
  const [selMuscle, setSelMuscle] = useState("ESPALDA");
  const [showAdd, setShowAdd] = useState(false);
  const [showBWForm, setShowBWForm] = useState(false);
  const [selProgress, setSelProgress] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({ muscleGroup: "ESPALDA", exercise: "", weight: "", reps: "", date: today });
  const [bwForm, setBWForm] = useState({ weight: "", date: today });

  useEffect(() => {
    (async () => {
      try {
        const initd = await window.storage.get("migue-v2-init");
        if (!initd) {
          const seed = INITIAL_DATA.map((d, i) => ({ id: `seed-${i}`, date: SEED_DATE, ...d }));
          await window.storage.set("migue-v2-workouts", JSON.stringify(seed));
          await window.storage.set("migue-v2-init", "1");
          setWorkouts(seed);
        } else {
          const wr = await window.storage.get("migue-v2-workouts");
          if (wr) setWorkouts(JSON.parse(wr.value));
        }
        const bwr = await window.storage.get("migue-v2-bw");
        if (bwr) setBW(JSON.parse(bwr.value));
      } catch {
        const seed = INITIAL_DATA.map((d, i) => ({ id: `seed-${i}`, date: SEED_DATE, ...d }));
        setWorkouts(seed);
        try {
          await window.storage.set("migue-v2-workouts", JSON.stringify(seed));
          await window.storage.set("migue-v2-init", "1");
        } catch {}
      }
    })();
  }, []);

  const saveWorkouts = async (list) => {
    setWorkouts(list);
    try { await window.storage.set("migue-v2-workouts", JSON.stringify(list)); } catch {}
  };

  const addWorkout = () => {
    if (!form.exercise || !form.weight || !form.reps) return;
    saveWorkouts([...workouts, { id: Date.now().toString(), date: form.date, muscleGroup: form.muscleGroup, exercise: form.exercise, weight: parseFloat(form.weight), reps: parseInt(form.reps) }]);
    setShowAdd(false);
    setForm({ muscleGroup: "ESPALDA", exercise: "", weight: "", reps: "", date: today });
  };

  const addBW = async () => {
    if (!bwForm.weight) return;
    const newBW = [...bodyWeights, { id: Date.now().toString(), date: bwForm.date, weight: parseFloat(bwForm.weight) }];
    setBW(newBW);
    try { await window.storage.set("migue-v2-bw", JSON.stringify(newBW)); } catch {}
    setShowBWForm(false);
    setBWForm({ weight: "", date: today });
  };

  const getPR = (ex) => {
    const recs = workouts.filter(w => w.exercise === ex);
    if (!recs.length) return null;
    return recs.reduce((m, w) => w.weight > m.weight ? w : m);
  };

  const getLatest = () => {
    const map = {};
    workouts.forEach(w => { if (!map[w.exercise] || w.date > map[w.exercise].date) map[w.exercise] = w; });
    return Object.values(map);
  };

  const getProgress = (ex) =>
    workouts.filter(w => w.exercise === ex)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(w => ({ date: w.date.slice(5), weight: w.weight, reps: w.reps, volume: w.weight * w.reps }));

  const totalVol = workouts.reduce((s, w) => s + w.weight * w.reps, 0);
  const sessions = [...new Set(workouts.map(w => w.date))].length;
  const latestBW = bodyWeights.length ? bodyWeights.sort((a, b) => b.date.localeCompare(a.date))[0] : null;
  const allExercises = [...new Set(workouts.map(w => w.exercise))].sort();
  const muscleExercises = [...new Set(workouts.filter(w => w.muscleGroup === selMuscle).map(w => w.exercise))];
  const byDate = workouts.reduce((acc, w) => { (acc[w.date] = acc[w.date] || []).push(w); return acc; }, {});
  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));
  const latestRecs = getLatest();
  const progressData = selProgress ? getProgress(selProgress) : [];

  return (
    <div className="app">
      <style>{CSS}</style>

      {/* HEADER */}
      <div className="hdr">
        <div className="hdr-top">
          <div className="avatar">MG</div>
          <div>
            <div className="hdr-name">MIGUEL GYM</div>
            <div className="hdr-sub">🔥 <span>Beast Mode</span> · Tracker Personal</div>
          </div>
        </div>
        <div className="tabs">
          {["dashboard", "ejercicios", "progreso", "historial"].map(t => (
            <button key={t} className={`tab ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>
              {t === "dashboard" ? "📊 " : t === "ejercicios" ? "💪 " : t === "progreso" ? "📈 " : "📅 "}{t}
            </button>
          ))}
        </div>
      </div>

      <div className="content">

        {/* ─────────── DASHBOARD ─────────── */}
        {tab === "dashboard" && <>
          <div className="banner" style={{ marginTop: 6 }}>
            <div className="banner-emoji">🔥</div>
            <div className="banner-title">¡VAMOS MIGUE! 💪</div>
            <div className="banner-sub">Cada rep cuenta · Cada kilo suma · Sigue machacando</div>
          </div>

          <div className="sgrid">
            <div className="sc">
              <div className="sc-label">Ejercicios totales</div>
              <div className="sc-val">{workouts.length}</div>
            </div>
            <div className="sc">
              <div className="sc-label">Días entrenados</div>
              <div className="sc-val">{sessions}</div>
            </div>
            <div className="sc">
              <div className="sc-label">Volumen total</div>
              <div className="sc-val" style={{ fontSize: 28 }}>{(totalVol / 1000).toFixed(1)}k</div>
              <div className="sc-unit">kg totales movidos</div>
            </div>
            <div className="sc" onClick={() => setShowBWForm(true)} style={{ cursor: "pointer" }}>
              <div className="sc-label">Mi peso</div>
              <div className="sc-val">{latestBW ? latestBW.weight : "—"}</div>
              <div className="sc-unit">{latestBW ? "kg · " + formatDate(latestBW.date) : "Toca para añadir"}</div>
            </div>
          </div>

          {showBWForm && (
            <div className="fmodal">
              <div className="stitle">REGISTRAR PESO</div>
              <div className="frow">
                <div className="fgrp">
                  <label className="flabel">Peso (kg)</label>
                  <input className="finput" type="number" step="0.1" placeholder="75.5"
                    value={bwForm.weight} onChange={e => setBWForm({ ...bwForm, weight: e.target.value })} />
                </div>
                <div className="fgrp">
                  <label className="flabel">Fecha</label>
                  <input className="finput" type="date" value={bwForm.date} onChange={e => setBWForm({ ...bwForm, date: e.target.value })} />
                </div>
              </div>
              <div className="fbtns">
                <button className="btn btn-g" onClick={() => setShowBWForm(false)}>Cancelar</button>
                <button className="btn btn-p" onClick={addBW}>Guardar</button>
              </div>
            </div>
          )}

          {bodyWeights.length > 1 && (
            <>
              <div className="stitle">EVOLUCIÓN DE PESO CORPORAL</div>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={[...bodyWeights].sort((a, b) => a.date.localeCompare(b.date)).map(w => ({ ...w, date: w.date.slice(5) }))}>
                    <defs>
                      <linearGradient id="bwg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                    <XAxis dataKey="date" tick={{ fill: "#444", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#444", fontSize: 10 }} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 8 }} labelStyle={{ color: "#888" }} itemStyle={{ color: "#f97316" }} />
                    <Area type="monotone" dataKey="weight" stroke="#f97316" fill="url(#bwg)" strokeWidth={2} dot={{ fill: "#f97316", r: 3 }} name="Peso (kg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          <div className="stitle">ÚLTIMO REGISTRO POR GRUPO MUSCULAR</div>
          {MUSCLE_GROUPS.map(mg => {
            const recs = latestRecs.filter(w => w.muscleGroup === mg);
            if (!recs.length) return null;
            return (
              <div key={mg} style={{ marginBottom: 20 }}>
                <div className="mg-label" style={{ color: MUSCLE_COLORS[mg] }}>
                  {MUSCLE_EMOJIS[mg]} {mg}
                </div>
                {recs.map(w => {
                  const pr = getPR(w.exercise);
                  const isPR = pr && pr.id === w.id;
                  return (
                    <div className="exrow" key={w.id} style={{ borderLeftColor: MUSCLE_COLORS[mg] }}>
                      <div>
                        <div className="ex-name">{w.exercise}</div>
                        <div className="ex-date">{formatDate(w.date)}</div>
                      </div>
                      <div className="badges">
                        {isPR && <span className="pr-badge">🏆 PR</span>}
                        <span className="bw">{w.weight} kg</span>
                        <span className="br">{w.reps} reps</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div style={{ height: 20 }} />
        </>}

        {/* ─────────── EJERCICIOS ─────────── */}
        {tab === "ejercicios" && <>
          {showAdd ? (
            <div className="fmodal" style={{ marginTop: 6 }}>
              <div className="stitle" style={{ marginBottom: 18 }}>AÑADIR REGISTRO</div>
              <div className="fgrp" style={{ marginBottom: 10 }}>
                <label className="flabel">Grupo muscular</label>
                <select className="finput" value={form.muscleGroup}
                  onChange={e => setForm({ ...form, muscleGroup: e.target.value, exercise: "" })}>
                  {MUSCLE_GROUPS.map(mg => <option key={mg}>{mg}</option>)}
                </select>
              </div>
              <div className="fgrp" style={{ marginBottom: 10 }}>
                <label className="flabel">Ejercicio</label>
                <input className="finput" placeholder="Nombre del ejercicio" value={form.exercise}
                  list="exlist"
                  onChange={e => setForm({ ...form, exercise: e.target.value })} />
                <datalist id="exlist">
                  {(EXERCISE_LIBRARY[form.muscleGroup] || []).map(ex => <option key={ex} value={ex} />)}
                </datalist>
              </div>
              <div className="frow">
                <div className="fgrp">
                  <label className="flabel">Peso (kg)</label>
                  <input className="finput" type="number" step="0.5" placeholder="70" value={form.weight}
                    onChange={e => setForm({ ...form, weight: e.target.value })} />
                </div>
                <div className="fgrp">
                  <label className="flabel">Repeticiones</label>
                  <input className="finput" type="number" placeholder="10" value={form.reps}
                    onChange={e => setForm({ ...form, reps: e.target.value })} />
                </div>
              </div>
              <div className="fgrp" style={{ marginTop: 10 }}>
                <label className="flabel">Fecha</label>
                <input className="finput" type="date" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="fbtns">
                <button className="btn btn-g" onClick={() => setShowAdd(false)}>Cancelar</button>
                <button className="btn btn-p" onClick={addWorkout}>💾 Guardar</button>
              </div>
            </div>
          ) : (
            <button className="btn btn-p btn-full" onClick={() => setShowAdd(true)}>+ Añadir nuevo registro</button>
          )}

          <div className="mchips">
            {MUSCLE_GROUPS.map(mg => (
              <button key={mg} className={`mchip ${selMuscle === mg ? "on" : ""}`}
                style={selMuscle === mg ? { background: MUSCLE_COLORS[mg] } : {}}
                onClick={() => setSelMuscle(mg)}>
                {MUSCLE_EMOJIS[mg]} {mg}
              </button>
            ))}
          </div>

          {muscleExercises.length === 0 ? (
            <div className="empty">
              <div className="empty-ico">🏋️</div>
              <div className="empty-ttl">Sin registros</div>
              <div>Añade tu primer ejercicio de {selMuscle}</div>
            </div>
          ) : muscleExercises.map(ex => {
            const recs = workouts.filter(w => w.exercise === ex && w.muscleGroup === selMuscle).sort((a, b) => b.date.localeCompare(a.date));
            const pr = getPR(ex);
            return (
              <div key={ex} style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>{ex}</span>
                  {pr && <span className="pr-badge">🏆 PR: {pr.weight}kg</span>}
                  <span style={{ color: "#333", fontSize: 12, fontFamily: "'Barlow Condensed'" }}>{recs.length} entradas</span>
                </div>
                {recs.slice(0, 4).map((w, i) => (
                  <div className="exrow" key={w.id} style={{ borderLeftColor: MUSCLE_COLORS[selMuscle], opacity: i === 0 ? 1 : 0.65 }}>
                    <div className="ex-date" style={{ fontSize: 13, color: i === 0 ? "#aaa" : "#555" }}>{formatDate(w.date)}{i === 0 && <span style={{ color: MUSCLE_COLORS[selMuscle], marginLeft: 6, fontSize: 10 }}>ÚLTIMO</span>}</div>
                    <div className="badges">
                      <span className="bw">{w.weight} kg</span>
                      <span className="br">{w.reps} reps</span>
                      <span className="bvol">VOL {w.weight * w.reps}</span>
                    </div>
                  </div>
                ))}
                {recs.length > 4 && <div style={{ fontSize: 11, color: "#333", marginTop: 4, marginLeft: 4 }}>+{recs.length - 4} registros anteriores</div>}
              </div>
            );
          })}
          <div style={{ height: 20 }} />
        </>}

        {/* ─────────── PROGRESO ─────────── */}
        {tab === "progreso" && <>
          <div style={{ marginTop: 6 }}>
            <div className="stitle">ELIGE EJERCICIO</div>
            <div className="psel-grid">
              {allExercises.map(ex => (
                <button key={ex} className={`psel-btn ${selProgress === ex ? "on" : ""}`} onClick={() => setSelProgress(ex)}>
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {selProgress && progressData.length > 0 && <>
            <div className="stitle">{selProgress}</div>
            {progressData.length === 1 ? (
              <div className="chart-box" style={{ textAlign: "center", padding: "36px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>📊</div>
                <div style={{ fontFamily: "'Barlow Condensed'", letterSpacing: 2, color: "#888" }}>
                  PRIMER REGISTRO: {progressData[0].weight} kg × {progressData[0].reps} reps
                </div>
                <div style={{ fontSize: 12, color: "#444", marginTop: 8 }}>Añade más registros para ver la evolución</div>
              </div>
            ) : <>
              <div className="chart-box">
                <div className="chart-lbl">Peso levantado (kg)</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                    <XAxis dataKey="date" tick={{ fill: "#444", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#444", fontSize: 10 }} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 8 }} itemStyle={{ color: "#f97316" }} />
                    <Area type="monotone" dataKey="weight" stroke="#f97316" fill="url(#wg)" strokeWidth={2} dot={{ fill: "#f97316", r: 4 }} name="Peso (kg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-box">
                <div className="chart-lbl">Volumen (kg × reps)</div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                    <XAxis dataKey="date" tick={{ fill: "#444", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#444", fontSize: 10 }} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 8 }} itemStyle={{ color: "#3b82f6" }} />
                    <Area type="monotone" dataKey="volume" stroke="#3b82f6" fill="url(#vg)" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} name="Volumen" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="stats3">
                {[
                  { label: "Inicio", val: progressData[0].weight + " kg", col: "#f97316" },
                  { label: "Actual", val: progressData[progressData.length - 1].weight + " kg", col: "#f97316" },
                  {
                    label: "Progreso",
                    val: (progressData[progressData.length - 1].weight - progressData[0].weight >= 0 ? "+" : "") + (progressData[progressData.length - 1].weight - progressData[0].weight) + " kg",
                    col: progressData[progressData.length - 1].weight - progressData[0].weight >= 0 ? "#22c55e" : "#ef4444"
                  }
                ].map(s => (
                  <div className="sc" key={s.label}>
                    <div className="sc-label">{s.label}</div>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 26, color: s.col, letterSpacing: 1 }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </>}
          </>}

          {!selProgress && (
            <div className="empty">
              <div className="empty-ico">📈</div>
              <div className="empty-ttl">Selecciona un ejercicio</div>
              <div style={{ fontSize: 13 }}>para ver tu evolución en el tiempo</div>
            </div>
          )}
          <div style={{ height: 20 }} />
        </>}

        {/* ─────────── HISTORIAL ─────────── */}
        {tab === "historial" && <>
          <div style={{ marginTop: 6 }}>
            {sortedDates.map(date => (
              <div className="hdate-grp" key={date}>
                <div className="hdate-lbl">
                  {formatDate(date)}
                  {date === SEED_DATE && <span className="tag-inicio">INICIO</span>}
                </div>
                {byDate[date].map(w => {
                  const pr = getPR(w.exercise);
                  const isPR = pr && pr.id === w.id;
                  return (
                    <div className="exrow" key={w.id} style={{ borderLeftColor: MUSCLE_COLORS[w.muscleGroup] }}>
                      <div>
                        <div className="ex-name">{w.exercise}</div>
                        <div className="ex-date">{formatDate(w.date)}</div>
                      </div>
                      <div className="badges">
                        {isPR && <span className="pr-badge">🏆 PR</span>}
                        <span className="bw">{w.weight} kg</span>
                        <span className="br">{w.reps} reps</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ height: 20 }} />
        </>}
      </div>

      {tab !== "ejercicios" && (
        <button className="fab" onClick={() => { setTab("ejercicios"); setShowAdd(true); }} title="Añadir registro">+</button>
      )}
    </div>
  );
}
