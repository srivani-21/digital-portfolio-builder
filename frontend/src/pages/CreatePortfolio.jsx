import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const PROFESSIONS = [
  { value:'developer', label:'💻 Developer',  color:'#6c63ff' },
  { value:'designer',  label:'🎨 Designer',   color:'#ff6584' },
  { value:'teacher',   label:'📚 Teacher',    color:'#22d3a5' },
  { value:'marketer',  label:'📊 Marketer',   color:'#f59e0b' },
  { value:'other',     label:'✦ Other',       color:'#a0a0c0' },
];

const TEMPLATES = [
  { value:'modern',   label:'Modern',   desc:'Clean & professional' },
  { value:'minimal',  label:'Minimal',  desc:'Simple & focused'     },
  { value:'creative', label:'Creative', desc:'Bold & expressive'    },
];

const PROFESSION_FIELDS = {
  developer: ['skills','projects','github','linkedin','experience'],
  designer:  ['skills','portfolio_url','linkedin','tools','experience'],
  teacher:   ['subjects','institution','achievements','linkedin','experience'],
  marketer:  ['skills','achievements','linkedin','campaigns','experience'],
  other:     ['skills','achievements','linkedin','experience'],
};

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [msg, setMsg]         = useState({ text:'', type:'' });
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({
    profession: '', template: 'modern', fullName: '', tagline: '',
    about: '', email: '', phone: '', linkedin: '', github: '',
    skills: '', experience: '', projects: '', achievements: '',
    tools: '', subjects: '', institution: '', portfolio_url: '', campaigns: '',
    username: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills:       form.skills.split(',').map(s => s.trim()).filter(Boolean),
        achievements: form.achievements.split(',').map(a => a.trim()).filter(Boolean),
      };
      await API.post('/portfolio/create', payload);
      setMsg({ text:'✅ Portfolio created! Submit it for approval from My Portfolios.', type:'success' });
      setTimeout(() => navigate('/my-portfolios'), 2000);
    } catch (err) {
      setMsg({ text:'❌ ' + (err.response?.data?.message || 'Error'), type:'error' });
    } finally { setLoading(false); }
  };

  const fields = PROFESSION_FIELDS[form.profession] || PROFESSION_FIELDS.other;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Create Portfolio</h1>
        <p style={s.sub}>Build your professional digital portfolio in minutes</p>
      </div>

      {/* Step indicators */}
      <div style={s.steps}>
        {['Profession','Template','Details','Preview'].map((label, i) => (
          <div key={label} style={s.stepWrap}>
            <div style={{ ...s.stepDot, ...(step > i+1 ? s.stepDone : step === i+1 ? s.stepActive : {}) }}>
              {step > i+1 ? '✓' : i+1}
            </div>
            <span style={{ ...s.stepLabel, color: step >= i+1 ? '#f0f0ff' : '#4a4a6a' }}>{label}</span>
            {i < 3 && <div style={{ ...s.stepLine, background: step > i+1 ? '#6c63ff' : '#2a2a3d' }} />}
          </div>
        ))}
      </div>

      {msg.text && (
        <div style={{ ...s.alert, ...(msg.type==='success' ? s.alertSuccess : s.alertError) }}>
          {msg.text}
        </div>
      )}

      {/* STEP 1: Choose Profession */}
      {step === 1 && (
        <div style={s.stepCard} className="fade-up">
          <h2 style={s.stepTitle}>What's your profession?</h2>
          <p style={s.stepSub}>We'll customise the form fields for you</p>
          <div style={s.profGrid}>
            {PROFESSIONS.map(p => (
              <div key={p.value} style={{
                ...s.profCard,
                ...(form.profession === p.value ? { borderColor: p.color, background:`rgba(108,99,255,0.08)` } : {})
              }} onClick={() => set('profession', p.value)}>
                <div style={{ fontSize:28, marginBottom:8 }}>{p.label.split(' ')[0]}</div>
                <div style={{ color: form.profession===p.value ? p.color : '#f0f0ff', fontWeight:600 }}>
                  {p.label.split(' ').slice(1).join(' ')}
                </div>
              </div>
            ))}
          </div>
          <button style={{ ...s.nextBtn, opacity: form.profession ? 1 : 0.4 }}
            onClick={() => form.profession && setStep(2)}>
            Next: Choose Template →
          </button>
        </div>
      )}

      {/* STEP 2: Choose Template */}
      {step === 2 && (
        <div style={s.stepCard} className="fade-up">
          <h2 style={s.stepTitle}>Choose a template</h2>
          <p style={s.stepSub}>Pick a visual style for your portfolio</p>
          <div style={s.templateGrid}>
            {TEMPLATES.map(t => (
              <div key={t.value} style={{
                ...s.templateCard,
                ...(form.template === t.value ? s.templateActive : {})
              }} onClick={() => set('template', t.value)}>
                <div style={s.templatePreview}>
                  {t.value === 'modern'   && <ModernPreview />}
                  {t.value === 'minimal'  && <MinimalPreview />}
                  {t.value === 'creative' && <CreativePreview />}
                </div>
                <div style={s.templateName}>{t.label}</div>
                <div style={s.templateDesc}>{t.desc}</div>
              </div>
            ))}
          </div>
          <div style={s.btnRow}>
            <button style={s.backBtn} onClick={() => setStep(1)}>← Back</button>
            <button style={s.nextBtn} onClick={() => setStep(3)}>Next: Fill Details →</button>
          </div>
        </div>
      )}

      {/* STEP 3: Fill Details */}
      {step === 3 && (
        <div style={s.stepCard} className="fade-up">
          <h2 style={s.stepTitle}>Your details</h2>
          <p style={s.stepSub}>Fill in your professional information</p>

          <div style={s.formSection}>
            <div style={s.sectionLabel}>Basic Info</div>
            <div style={s.grid2}>
              <div>
                <label style={s.label}>Full Name *</label>
                <input style={s.input} placeholder="Enter your full name"
                  value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
              </div>
              <div>
                <label style={s.label}>Username (for share link) *</label>
                <input style={s.input} placeholder="e.g. john-doe"
                  value={form.username} onChange={e => set('username', e.target.value.toLowerCase().replace(/\s/g,'-'))} />
              </div>
            </div>
            <label style={s.label}>Tagline</label>
            <input style={s.input} placeholder="e.g. Full Stack Developer | Open Source Contributor"
              value={form.tagline} onChange={e => set('tagline', e.target.value)} />
            <label style={s.label}>About</label>
            <textarea style={{...s.input, height:100, resize:'vertical'}}
              placeholder="Write a short bio about yourself..."
              value={form.about} onChange={e => set('about', e.target.value)} />
          </div>

          <div style={s.formSection}>
            <div style={s.sectionLabel}>Contact</div>
            <div style={s.grid2}>
              <div>
                <label style={s.label}>Email</label>
                <input style={s.input} type="email" placeholder="your@email.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label style={s.label}>Phone</label>
                <input style={s.input} placeholder="Your phone number"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
          </div>

          <div style={s.formSection}>
            <div style={s.sectionLabel}>Professional Info</div>
            {fields.includes('skills') && <>
              <label style={s.label}>Skills <span style={s.hint}>(comma separated)</span></label>
              <input style={s.input} placeholder="React, Node.js, MongoDB"
                value={form.skills} onChange={e => set('skills', e.target.value)} />
            </>}
            {fields.includes('github') && <>
              <label style={s.label}>GitHub</label>
              <input style={s.input} placeholder="github.com/yourusername"
                value={form.github} onChange={e => set('github', e.target.value)} />
            </>}
            {fields.includes('linkedin') && <>
              <label style={s.label}>LinkedIn</label>
              <input style={s.input} placeholder="linkedin.com/in/yourprofile"
                value={form.linkedin} onChange={e => set('linkedin', e.target.value)} />
            </>}
            {fields.includes('experience') && <>
              <label style={s.label}>Experience</label>
              <textarea style={{...s.input, height:80, resize:'vertical'}}
                placeholder="e.g. 2 years at XYZ as Frontend Developer"
                value={form.experience} onChange={e => set('experience', e.target.value)} />
            </>}
            {fields.includes('projects') && <>
              <label style={s.label}>Projects</label>
              <textarea style={{...s.input, height:80, resize:'vertical'}}
                placeholder="List your notable projects..."
                value={form.projects} onChange={e => set('projects', e.target.value)} />
            </>}
            {fields.includes('achievements') && <>
              <label style={s.label}>Achievements <span style={s.hint}>(comma separated)</span></label>
              <input style={s.input} placeholder="Hackathon Winner 2024, Dean's List"
                value={form.achievements} onChange={e => set('achievements', e.target.value)} />
            </>}
            {fields.includes('subjects') && <>
              <label style={s.label}>Subjects Taught</label>
              <input style={s.input} placeholder="Mathematics, Physics, Computer Science"
                value={form.subjects} onChange={e => set('subjects', e.target.value)} />
            </>}
            {fields.includes('institution') && <>
              <label style={s.label}>Institution</label>
              <input style={s.input} placeholder="Your school or university"
                value={form.institution} onChange={e => set('institution', e.target.value)} />
            </>}
          </div>

          <div style={s.btnRow}>
            <button style={s.backBtn} onClick={() => setStep(2)}>← Back</button>
            <button style={s.nextBtn}
              onClick={() => { if (form.fullName) setStep(4); else setMsg({ text:'⚠ Full name is required', type:'error' }); }}>
              Preview →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Preview */}
      {step === 4 && (
        <div style={s.stepCard} className="fade-up">
          <h2 style={s.stepTitle}>Preview & Create</h2>
          <p style={s.stepSub}>Review your portfolio before saving</p>

          <div style={s.preview}>
            <div style={s.previewHeader}>
              <div style={s.previewName}>{form.fullName || 'Your Name'}</div>
              <div style={s.previewTag}>{form.tagline || 'Your Tagline'}</div>
              <div style={s.previewBadge}>{form.profession} · {form.template} template</div>
            </div>
            {form.about && <p style={s.previewAbout}>{form.about}</p>}
            {form.skills && (
              <div style={s.previewSkills}>
                {form.skills.split(',').map(sk => (
                  <span key={sk} style={s.previewSkill}>{sk.trim()}</span>
                ))}
              </div>
            )}
            {form.username && (
              <div style={s.previewLink}>🔗 Share link: /portfolio/{form.username}</div>
            )}
          </div>

          <div style={s.btnRow}>
            <button style={s.backBtn} onClick={() => setStep(3)}>← Back</button>
            <button style={{ ...s.nextBtn, background:'linear-gradient(135deg,#22d3a5,#059669)' }}
              onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : '✓ Create Portfolio'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Mini template preview components
const ModernPreview = () => (
  <div style={{ padding:12, background:'#1c1c27', borderRadius:8, height:'100%' }}>
    <div style={{ height:8, background:'#6c63ff', borderRadius:4, marginBottom:8, width:'60%' }}/>
    <div style={{ height:5, background:'#2a2a3d', borderRadius:3, marginBottom:5, width:'80%' }}/>
    <div style={{ height:5, background:'#2a2a3d', borderRadius:3, marginBottom:8, width:'50%' }}/>
    <div style={{ display:'flex', gap:4 }}>
      {[1,2,3].map(i => <div key={i} style={{ height:16, background:'rgba(108,99,255,0.3)', borderRadius:4, flex:1 }}/>)}
    </div>
  </div>
);

const MinimalPreview = () => (
  <div style={{ padding:12, background:'#0a0a0f', borderRadius:8, height:'100%', border:'1px solid #2a2a3d' }}>
    <div style={{ height:6, background:'#f0f0ff', borderRadius:3, marginBottom:10, width:'40%' }}/>
    <div style={{ height:4, background:'#2a2a3d', borderRadius:2, marginBottom:4, width:'90%' }}/>
    <div style={{ height:4, background:'#2a2a3d', borderRadius:2, marginBottom:4, width:'70%' }}/>
    <div style={{ height:4, background:'#2a2a3d', borderRadius:2, width:'50%' }}/>
  </div>
);

const CreativePreview = () => (
  <div style={{ padding:12, background:'linear-gradient(135deg,#1a0a2e,#0a1628)', borderRadius:8, height:'100%' }}>
    <div style={{ height:8, background:'linear-gradient(90deg,#6c63ff,#ff6584)', borderRadius:4, marginBottom:8 }}/>
    <div style={{ height:5, background:'rgba(255,101,132,0.4)', borderRadius:3, marginBottom:5, width:'70%' }}/>
    <div style={{ height:5, background:'rgba(108,99,255,0.4)', borderRadius:3, width:'50%' }}/>
  </div>
);

const s = {
  page: { padding:40, maxWidth:900 },
  header: { marginBottom:32 },
  title: { fontFamily:'Syne,sans-serif', fontSize:32, fontWeight:800, color:'#f0f0ff' },
  sub:   { color:'#7a7a9a', fontSize:15, marginTop:4 },

  steps: { display:'flex', alignItems:'center', marginBottom:36, gap:0 },
  stepWrap:  { display:'flex', alignItems:'center', gap:8 },
  stepDot:   { width:32, height:32, borderRadius:'50%', background:'#1c1c27',
               border:'2px solid #2a2a3d', color:'#4a4a6a', display:'flex',
               alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:600 },
  stepActive: { borderColor:'#6c63ff', color:'#6c63ff', background:'rgba(108,99,255,0.1)' },
  stepDone:   { borderColor:'#22d3a5', color:'#22d3a5', background:'rgba(34,211,165,0.1)' },
  stepLabel:  { fontSize:13, fontWeight:500, whiteSpace:'nowrap' },
  stepLine:   { width:40, height:2, borderRadius:1, margin:'0 4px' },

  alert: { padding:'12px 16px', borderRadius:10, fontSize:13, marginBottom:20 },
  alertSuccess: { background:'rgba(34,211,165,0.1)', border:'1px solid rgba(34,211,165,0.25)', color:'#22d3a5' },
  alertError:   { background:'rgba(239,68,68,0.1)',  border:'1px solid rgba(239,68,68,0.25)',  color:'#ef4444' },

  stepCard:  { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:20, padding:36 },
  stepTitle: { fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700, color:'#f0f0ff', marginBottom:6 },
  stepSub:   { color:'#7a7a9a', fontSize:14, marginBottom:28 },

  profGrid: { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:28 },
  profCard: { background:'#1c1c27', border:'1px solid #2a2a3d', borderRadius:12,
              padding:'20px 12px', textAlign:'center', cursor:'pointer',
              transition:'all .2s', fontSize:13 },

  templateGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:28 },
  templateCard: { background:'#1c1c27', border:'2px solid #2a2a3d', borderRadius:16,
                  padding:16, cursor:'pointer', transition:'all .2s' },
  templateActive: { borderColor:'#6c63ff', background:'rgba(108,99,255,0.05)' },
  templatePreview: { height:100, marginBottom:12, borderRadius:8, overflow:'hidden' },
  templateName: { color:'#f0f0ff', fontWeight:600, fontSize:15, marginBottom:4 },
  templateDesc: { color:'#7a7a9a', fontSize:12 },

  formSection: { marginBottom:24, paddingBottom:24, borderBottom:'1px solid #2a2a3d' },
  sectionLabel: { fontSize:11, fontWeight:700, color:'#6c63ff', letterSpacing:'1.5px',
                  textTransform:'uppercase', marginBottom:16 },
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:4 },
  label: { display:'block', fontSize:12, color:'#7a7a9a', marginBottom:6,
           fontWeight:500, letterSpacing:'0.3px' },
  hint:  { color:'#4a4a6a', fontWeight:400 },
  input: { width:'100%', padding:'11px 14px', background:'#1c1c27',
           border:'1px solid #2a2a3d', borderRadius:10, color:'#f0f0ff',
           fontSize:14, outline:'none', marginBottom:16,
           boxSizing:'border-box', fontFamily:'DM Sans,sans-serif' },

  btnRow:  { display:'flex', gap:12, marginTop:8 },
  nextBtn: { padding:'12px 28px', background:'linear-gradient(135deg,#6c63ff,#8b5cf6)',
             color:'#fff', border:'none', borderRadius:10, fontSize:14,
             fontWeight:600, cursor:'pointer' },
  backBtn: { padding:'12px 20px', background:'transparent', border:'1px solid #2a2a3d',
             color:'#7a7a9a', borderRadius:10, fontSize:14, cursor:'pointer' },

  preview: { background:'#0a0a0f', border:'1px solid #2a2a3d', borderRadius:16,
             padding:28, marginBottom:24 },
  previewHeader: { marginBottom:16 },
  previewName:   { fontFamily:'Syne,sans-serif', fontSize:24, fontWeight:800, color:'#f0f0ff', marginBottom:4 },
  previewTag:    { color:'#6c63ff', fontSize:14, marginBottom:8 },
  previewBadge:  { display:'inline-block', padding:'3px 12px', background:'rgba(108,99,255,0.12)',
                   border:'1px solid rgba(108,99,255,0.25)', borderRadius:20, fontSize:12, color:'#6c63ff' },
  previewAbout:  { color:'#a0a0c0', fontSize:14, lineHeight:1.7, marginBottom:16 },
  previewSkills: { display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 },
  previewSkill:  { padding:'4px 12px', borderRadius:20, background:'rgba(108,99,255,0.12)',
                   border:'1px solid rgba(108,99,255,0.2)', color:'#6c63ff', fontSize:12 },
  previewLink:   { color:'#22d3a5', fontSize:13, marginTop:8 },
};