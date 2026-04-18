import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

// ─── Profession config ───────────────────────────────────────────
// Each profession defines its own color, icon, and which fields to show
const PROFESSIONS = [
  { value:'developer', label:'Developer', icon:'💻', color:'#6c63ff' },
  { value:'designer',  label:'Designer',  icon:'🎨', color:'#ff6584' },
  { value:'teacher',   label:'Teacher',   icon:'📚', color:'#22d3a5' },
  { value:'marketer',  label:'Marketer',  icon:'📊', color:'#f59e0b' },
  { value:'other',     label:'Other',     icon:'✦',  color:'#a0a0c0' },
];

// ─── Dynamic fields per profession ──────────────────────────────
// Each profession shows completely different fields in Step 3
const PROFESSION_FIELDS = {
  developer: [
    { name:'skills',      label:'Skills',       hint:'React, Node.js, MongoDB',          type:'input',    required:true  },
    { name:'github',      label:'GitHub URL',   hint:'github.com/yourusername',           type:'input',    required:false },
    { name:'projects',    label:'Projects',     hint:'Describe your notable projects...', type:'textarea', required:false },
    { name:'experience',  label:'Experience',   hint:'2 years at XYZ as Frontend Dev',   type:'textarea', required:false },
    { name:'linkedin',    label:'LinkedIn',     hint:'linkedin.com/in/yourprofile',       type:'input',    required:false },
    { name:'achievements',label:'Achievements', hint:'Hackathon winner, Dean list',       type:'input',    required:false },
  ],
  designer: [
    { name:'tools',       label:'Design Tools',    hint:'Figma, Adobe XD, Photoshop',     type:'input',    required:true  },
    { name:'portfolio_url',label:'Portfolio URL',  hint:'behance.net/yourprofile',         type:'input',    required:false },
    { name:'specialization',label:'Specialization',hint:'UI/UX, Brand Design, Motion',    type:'input',    required:false },
    { name:'projects',    label:'Work Description',hint:'Describe your design projects...', type:'textarea',required:false },
    { name:'experience',  label:'Work Experience', hint:'2 years at XYZ as UI Designer',  type:'textarea', required:false },
    { name:'linkedin',    label:'LinkedIn',        hint:'linkedin.com/in/yourprofile',     type:'input',    required:false },
    { name:'achievements',label:'Achievements',    hint:'Design awards, recognitions',     type:'input',    required:false },
  ],
  teacher: [
    { name:'subjects',    label:'Subjects Taught', hint:'Mathematics, Physics, Chemistry', type:'input',   required:true  },
    { name:'institution', label:'Institution',     hint:'Your school or university name',  type:'input',   required:true  },
    { name:'teachingLevel',label:'Teaching Level', hint:'School / College / University',   type:'input',   required:false },
    { name:'experience',  label:'Years of Experience', hint:'5 years teaching experience', type:'textarea',required:false },
    { name:'achievements',label:'Achievements',    hint:'Best Teacher award, Publications', type:'input',  required:false },
    { name:'linkedin',    label:'LinkedIn',        hint:'linkedin.com/in/yourprofile',     type:'input',   required:false },
  ],
  marketer: [
    { name:'skills',      label:'Marketing Skills', hint:'SEO, Content Writing, Analytics', type:'input',  required:true  },
    { name:'tools',       label:'Tools Used',       hint:'Google Ads, HubSpot, Mailchimp',  type:'input',  required:false },
    { name:'campaigns',   label:'Campaigns',        hint:'Describe campaigns you managed...', type:'textarea',required:false },
    { name:'experience',  label:'Experience',       hint:'3 years at XYZ as Digital Marketer', type:'textarea',required:false },
    { name:'achievements',label:'Achievements',     hint:'Increased traffic by 200%',       type:'input',  required:false },
    { name:'linkedin',    label:'LinkedIn',         hint:'linkedin.com/in/yourprofile',     type:'input',  required:false },
  ],
  other: [
    { name:'skills',      label:'Skills',       hint:'Your key skills...',               type:'input',    required:true  },
    { name:'experience',  label:'Experience',   hint:'Your work experience...',           type:'textarea', required:false },
    { name:'achievements',label:'Achievements', hint:'Your achievements...',              type:'input',    required:false },
    { name:'linkedin',    label:'LinkedIn',     hint:'linkedin.com/in/yourprofile',       type:'input',    required:false },
  ],
};

// ─── Templates config ────────────────────────────────────────────
const TEMPLATES = [
  {
    value: 'modern',
    label: 'Modern',
    desc: 'Card layout with avatar, accent bar and skill chips',
    preview: (color) => (
      <svg viewBox="0 0 180 100" width="100%" height="100%">
        <rect width="180" height="100" fill="#13131a" rx="6"/>
        <rect x="0" y="0" width="180" height="3" fill={color}/>
        <circle cx="28" cy="32" r="18" fill={color} opacity=".25"/>
        <text x="28" y="36" textAnchor="middle" fill="#f0f0ff"
          fontSize="11" fontWeight="bold">KS</text>
        <rect x="55" y="20" width="90" height="7" rx="3" fill="#f0f0ff" opacity=".7"/>
        <rect x="55" y="32" width="60" height="5" rx="2" fill={color} opacity=".8"/>
        <rect x="10" y="62" width="160" height="2" rx="1" fill="#2a2a3d"/>
        <rect x="10" y="72" width="48" height="10" rx="5" fill={color} opacity=".2"/>
        <rect x="64" y="72" width="48" height="10" rx="5" fill={color} opacity=".2"/>
        <rect x="118" y="72" width="48" height="10" rx="5" fill={color} opacity=".2"/>
      </svg>
    ),
  },
  {
    value: 'minimal',
    label: 'Minimal',
    desc: 'Clean text-only layout, large name, no cards',
    preview: (color) => (
      <svg viewBox="0 0 180 100" width="100%" height="100%">
        <rect width="180" height="100" fill="#0a0a0f" rx="6"/>
        <text x="14" y="30" fill="#f0f0ff" fontSize="15" fontWeight="bold">Kavya Sri</text>
        <rect x="14" y="36" width="44" height="2" rx="1" fill={color}/>
        <text x="14" y="52" fill="#7a7a9a" fontSize="9">Full Stack Developer</text>
        <rect x="14" y="62" width="150" height="2" rx="1" fill="#2a2a3d"/>
        <rect x="14" y="70" width="110" height="2" rx="1" fill="#2a2a3d"/>
        <rect x="14" y="78" width="80" height="2" rx="1" fill="#2a2a3d"/>
        <rect x="14" y="86" width="130" height="2" rx="1" fill="#2a2a3d"/>
      </svg>
    ),
  },
  {
    value: 'creative',
    label: 'Creative',
    desc: 'Bold sidebar with gradient name and colored chips',
    preview: (color) => (
      <svg viewBox="0 0 180 100" width="100%" height="100%">
        <rect width="180" height="100" fill="#0d0820" rx="6"/>
        <rect x="0" y="0" width="60" height="100" fill={color} opacity=".1" rx="6"/>
        <rect x="0" y="0" width="3" height="100" fill={color}/>
        <text x="30" y="36" textAnchor="middle" fill={color}
          fontSize="9" fontWeight="bold">KAVYA</text>
        <text x="30" y="48" textAnchor="middle" fill={color}
          fontSize="9" fontWeight="bold">SRI</text>
        <text x="30" y="68" textAnchor="middle" fill="#ff6584" fontSize="7">Developer</text>
        <rect x="72" y="18" width="95" height="5" rx="2" fill="#f0f0ff" opacity=".6"/>
        <rect x="72" y="28" width="70" height="3" rx="1" fill="#7a7a9a"/>
        <rect x="72" y="36" width="80" height="3" rx="1" fill="#7a7a9a"/>
        <rect x="72" y="50" width="28" height="8" rx="4" fill="#ff6584" opacity=".3"/>
        <rect x="106" y="50" width="28" height="8" rx="4" fill={color} opacity=".3"/>
        <rect x="140" y="50" width="28" height="8" rx="4" fill="#22d3a5" opacity=".3"/>
      </svg>
    ),
  },
];

// ─── Main Component ──────────────────────────────────────────────
export default function CreatePortfolio() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState({ text:'', type:'' });

  // All form data in one state object
  const [form, setForm] = useState({
    profession:    '',
    template:      'modern',
    fullName:      '',
    username:      '',
    tagline:       '',
    about:         '',
    email:         '',
    phone:         '',
    // Profession-specific fields
    skills:        '',
    github:        '',
    projects:      '',
    experience:    '',
    linkedin:      '',
    achievements:  '',
    tools:         '',
    portfolio_url: '',
    specialization:'',
    subjects:      '',
    institution:   '',
    teachingLevel: '',
    campaigns:     '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Get the profession color for styling
  const profColor = PROFESSIONS.find(p => p.value === form.profession)?.color || '#6c63ff';

  // Get dynamic fields for selected profession
  const dynamicFields = PROFESSION_FIELDS[form.profession] || [];

  // ── Submit to backend ──────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        // Convert comma-separated strings to arrays
        skills:       form.skills?.split(',').map(s => s.trim()).filter(Boolean)       || [],
        achievements: form.achievements?.split(',').map(a => a.trim()).filter(Boolean) || [],
        tools:        form.tools?.split(',').map(t => t.trim()).filter(Boolean)        || [],
        subjects:     form.subjects?.split(',').map(s => s.trim()).filter(Boolean)     || [],
      };
      await API.post('/portfolio/create', payload);
      setMsg({ text:'✅ Portfolio created! Go to My Portfolios to submit for approval.', type:'success' });
      setTimeout(() => navigate('/my-portfolios'), 2000);
    } catch (err) {
      setMsg({ text:'❌ ' + (err.response?.data?.message || 'Error creating portfolio'), type:'error' });
    } finally { setLoading(false); }
  };

  const goNext = () => {
    if (step === 1 && !form.profession) {
      return setMsg({ text:'⚠ Please select a profession first', type:'error' });
    }
    if (step === 3 && !form.fullName.trim()) {
      return setMsg({ text:'⚠ Full name is required', type:'error' });
    }
    setMsg({ text:'', type:'' });
    setStep(s => s + 1);
  };

  return (
    <div style={s.page}>

      {/* Page title */}
      <div style={s.header}>
        <h1 style={s.title}>Create Portfolio</h1>
        <p style={s.sub}>Build your professional digital portfolio</p>
      </div>

      {/* Step progress bar */}
      <div style={s.steps}>
        {['Profession', 'Template', 'Details', 'Preview'].map((label, i) => (
          <div key={label} style={s.stepWrap}>
            <div style={{
              ...s.stepDot,
              ...(step > i+1 ? s.stepDone : {}),
              ...(step === i+1 ? { ...s.stepActive, borderColor: profColor, color: profColor,
                                   background:`${profColor}18` } : {}),
            }}>
              {step > i+1 ? '✓' : i+1}
            </div>
            <span style={{ ...s.stepLabel,
              color: step >= i+1 ? '#f0f0ff' : '#4a4a6a' }}>
              {label}
            </span>
            {i < 3 && (
              <div style={{ ...s.stepLine,
                background: step > i+1 ? profColor : '#2a2a3d' }} />
            )}
          </div>
        ))}
      </div>

      {/* Alert message */}
      {msg.text && (
        <div style={{ ...s.alert, ...(msg.type==='success' ? s.alertSuccess : s.alertError) }}>
          {msg.text}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STEP 1 — Choose Profession
      ══════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div style={s.card} className="fade-up">
          <h2 style={s.cardTitle}>What is your profession?</h2>
          <p style={s.cardSub}>
            This determines which fields appear in your portfolio form
          </p>

          <div style={s.profGrid}>
            {PROFESSIONS.map(p => (
              <div
                key={p.value}
                style={{
                  ...s.profCard,
                  ...(form.profession === p.value ? {
                    borderColor: p.color,
                    background:  `${p.color}14`,
                    transform:   'translateY(-3px)',
                    boxShadow:   `0 8px 24px ${p.color}22`,
                  } : {}),
                }}
                onClick={() => set('profession', p.value)}
              >
                <div style={s.profIcon}>{p.icon}</div>
                <div style={{
                  ...s.profLabel,
                  color: form.profession === p.value ? p.color : '#f0f0ff',
                }}>
                  {p.label}
                </div>
                {form.profession === p.value && (
                  <div style={{ ...s.profCheck, background: p.color }}>✓</div>
                )}
              </div>
            ))}
          </div>

          {/* Show which fields will appear */}
          {form.profession && (
            <div style={s.fieldPreview}>
              <p style={s.fieldPreviewTitle}>
                Fields for{' '}
                <span style={{ color: profColor }}>
                  {PROFESSIONS.find(p => p.value === form.profession)?.label}
                </span>:
              </p>
              <div style={s.fieldChips}>
                {dynamicFields.map(f => (
                  <span key={f.name} style={{
                    ...s.fieldChip,
                    background: `${profColor}14`,
                    border:     `1px solid ${profColor}30`,
                    color:       profColor,
                  }}>
                    {f.label}
                    {f.required && <span style={{ color:'#ef4444', marginLeft:2 }}>*</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            style={{ ...s.nextBtn, opacity: form.profession ? 1 : 0.4,
                     background:`linear-gradient(135deg,${profColor},${profColor}bb)` }}
            onClick={goNext}
          >
            Next: Choose Template →
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STEP 2 — Choose Template
      ══════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div style={s.card} className="fade-up">
          <h2 style={s.cardTitle}>Choose a template</h2>
          <p style={s.cardSub}>
            Each template shows your{' '}
            <span style={{ color: profColor }}>
              {PROFESSIONS.find(p => p.value === form.profession)?.label}
            </span>{' '}
            portfolio in a different visual style
          </p>

          <div style={s.templateGrid}>
            {TEMPLATES.map(t => (
              <div
                key={t.value}
                style={{
                  ...s.templateCard,
                  ...(form.template === t.value ? {
                    borderColor: profColor,
                    borderWidth: 2,
                    background: `${profColor}08`,
                    transform: 'translateY(-2px)',
                  } : {}),
                }}
                onClick={() => set('template', t.value)}
              >
                {/* Live preview using profession color */}
                <div style={s.templatePreview}>
                  {t.preview(profColor)}
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ ...s.templateName,
                    color: form.template === t.value ? profColor : '#f0f0ff' }}>
                    {t.label}
                  </div>
                  {form.template === t.value && (
                    <div style={{ ...s.templateCheck, background: profColor }}>✓</div>
                  )}
                </div>
                <div style={s.templateDesc}>{t.desc}</div>
              </div>
            ))}
          </div>

          <div style={s.btnRow}>
            <button style={s.backBtn} onClick={() => setStep(1)}>← Back</button>
            <button style={{ ...s.nextBtn,
              background:`linear-gradient(135deg,${profColor},${profColor}bb)` }}
              onClick={goNext}>
              Next: Fill Details →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STEP 3 — Fill Details (dynamic based on profession)
      ══════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div style={s.card} className="fade-up">
          <h2 style={s.cardTitle}>Your details</h2>
          <p style={s.cardSub}>
            Filling in{' '}
            <span style={{ color: profColor }}>
              {PROFESSIONS.find(p => p.value === form.profession)?.label}
            </span>{' '}
            fields · {form.template} template
          </p>

          {/* Basic info — same for all professions */}
          <div style={s.section}>
            <div style={{ ...s.sectionLabel, color: profColor }}>
              Basic Information
            </div>
            <div style={s.grid2}>
              <div>
                <label style={s.label}>Full Name <span style={s.req}>*</span></label>
                <input style={s.input} placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={e => set('fullName', e.target.value)} required/>
              </div>
              <div>
                <label style={s.label}>
                  Username{' '}
                  <span style={{ color:'#4a4a6a', fontWeight:400 }}>
                    (share link: /portfolio/username)
                  </span>
                </label>
                <input style={s.input} placeholder="e.g. kavya-sri"
                  value={form.username}
                  onChange={e => set('username',
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'')
                  )}/>
              </div>
            </div>

            <label style={s.label}>Tagline</label>
            <input style={s.input}
              placeholder={
                form.profession === 'developer' ? 'Full Stack Developer | Open Source Contributor' :
                form.profession === 'designer'  ? 'UI/UX Designer | Creating Beautiful Experiences' :
                form.profession === 'teacher'   ? 'Passionate Educator | 5+ Years Experience' :
                form.profession === 'marketer'  ? 'Digital Marketer | Growth Specialist' :
                'Your professional tagline'
              }
              value={form.tagline}
              onChange={e => set('tagline', e.target.value)}/>

            <label style={s.label}>About</label>
            <textarea style={{ ...s.input, height:90, resize:'vertical' }}
              placeholder={
                form.profession === 'developer' ? 'I am a passionate developer who loves building scalable web apps...' :
                form.profession === 'designer'  ? 'I am a creative designer focused on crafting intuitive user experiences...' :
                form.profession === 'teacher'   ? 'I am a dedicated educator committed to inspiring students...' :
                form.profession === 'marketer'  ? 'I am a results-driven marketer specializing in digital growth...' :
                'Write a short bio about yourself...'
              }
              value={form.about}
              onChange={e => set('about', e.target.value)}/>

            <div style={s.grid2}>
              <div>
                <label style={s.label}>Email</label>
                <input style={s.input} type="email" placeholder="your@email.com"
                  value={form.email} onChange={e => set('email', e.target.value)}/>
              </div>
              <div>
                <label style={s.label}>Phone</label>
                <input style={s.input} placeholder="Your phone number"
                  value={form.phone} onChange={e => set('phone', e.target.value)}/>
              </div>
            </div>
          </div>

          {/* Dynamic fields — different per profession */}
          <div style={s.section}>
            <div style={{ ...s.sectionLabel, color: profColor }}>
              {PROFESSIONS.find(p => p.value === form.profession)?.icon}{' '}
              {PROFESSIONS.find(p => p.value === form.profession)?.label} Details
            </div>

            {dynamicFields.map(field => (
              <div key={field.name}>
                <label style={s.label}>
                  {field.label}
                  {field.required && <span style={s.req}> *</span>}
                  {/* Show hint that arrays are comma-separated */}
                  {(field.name === 'skills' || field.name === 'tools' ||
                    field.name === 'subjects' || field.name === 'achievements') && (
                    <span style={s.hint}> (comma separated)</span>
                  )}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    style={{ ...s.input, height:80, resize:'vertical' }}
                    placeholder={field.hint}
                    value={form[field.name] || ''}
                    onChange={e => set(field.name, e.target.value)}
                  />
                ) : (
                  <input
                    style={s.input}
                    placeholder={field.hint}
                    value={form[field.name] || ''}
                    onChange={e => set(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={s.btnRow}>
            <button style={s.backBtn} onClick={() => setStep(2)}>← Back</button>
            <button style={{ ...s.nextBtn,
              background:`linear-gradient(135deg,${profColor},${profColor}bb)` }}
              onClick={goNext}>
              Preview →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STEP 4 — Preview & Create
      ══════════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div style={s.card} className="fade-up">
          <h2 style={s.cardTitle}>Preview & Create</h2>
          <p style={s.cardSub}>Review your portfolio before saving</p>

          <div style={{ ...s.preview, borderColor:`${profColor}30` }}>
            {/* Preview header */}
            <div style={{ ...s.previewHeader,
              borderBottom:`1px solid ${profColor}20` }}>
              <div style={s.previewAvatar}>
                {form.fullName?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <div style={s.previewName}>{form.fullName || 'Your Name'}</div>
                <div style={{ ...s.previewTagline, color: profColor }}>
                  {form.tagline || 'Your Tagline'}
                </div>
                <div style={s.previewBadges}>
                  <span style={{ ...s.previewBadge,
                    background:`${profColor}15`, color:profColor,
                    border:`1px solid ${profColor}30` }}>
                    {PROFESSIONS.find(p=>p.value===form.profession)?.icon}{' '}
                    {form.profession}
                  </span>
                  <span style={{ ...s.previewBadge,
                    background:'rgba(108,99,255,0.1)', color:'#6c63ff',
                    border:'1px solid rgba(108,99,255,0.2)' }}>
                    {form.template} template
                  </span>
                  {form.username && (
                    <span style={{ ...s.previewBadge,
                      background:'rgba(34,211,165,0.1)', color:'#22d3a5',
                      border:'1px solid rgba(34,211,165,0.2)' }}>
                      🔗 /portfolio/{form.username}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* About preview */}
            {form.about && (
              <p style={s.previewAbout}>{form.about}</p>
            )}

            {/* Dynamic field preview */}
            <div style={s.previewFields}>
              {dynamicFields.map(field => {
                const val = form[field.name];
                if (!val) return null;
                return (
                  <div key={field.name} style={s.previewFieldRow}>
                    <span style={{ ...s.previewFieldLabel, color: profColor }}>
                      {field.label}:
                    </span>
                    <span style={s.previewFieldVal}>
                      {field.name === 'skills' || field.name === 'tools' ||
                       field.name === 'subjects' || field.name === 'achievements'
                        // Show as chips for array fields
                        ? val.split(',').map(v => v.trim()).filter(Boolean).map(v => (
                            <span key={v} style={{ ...s.chip,
                              background:`${profColor}14`,
                              border:`1px solid ${profColor}25`,
                              color: profColor }}>
                              {v}
                            </span>
                          ))
                        : val
                      }
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={s.btnRow}>
            <button style={s.backBtn} onClick={() => setStep(3)}>← Back</button>
            <button
              style={{ ...s.nextBtn,
                background:'linear-gradient(135deg,#22d3a5,#059669)',
                opacity: loading ? 0.7 : 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Creating...' : '✓ Create Portfolio'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const s = {
  page: { padding:40, maxWidth:860 },
  header: { marginBottom:28 },
  title: { fontFamily:'Syne,sans-serif', fontSize:32, fontWeight:800, color:'#f0f0ff' },
  sub:   { color:'#7a7a9a', fontSize:15, marginTop:4 },

  steps: { display:'flex', alignItems:'center', marginBottom:32 },
  stepWrap:  { display:'flex', alignItems:'center', gap:8 },
  stepDot:   { width:32, height:32, borderRadius:'50%', background:'#1c1c27',
               border:'2px solid #2a2a3d', color:'#4a4a6a',
               display:'flex', alignItems:'center', justifyContent:'center',
               fontSize:13, fontWeight:600, flexShrink:0 },
  stepActive: {},
  stepDone:   { borderColor:'#22d3a5', color:'#22d3a5', background:'rgba(34,211,165,0.1)' },
  stepLabel:  { fontSize:13, fontWeight:500, whiteSpace:'nowrap' },
  stepLine:   { width:36, height:2, borderRadius:1, margin:'0 4px', flexShrink:0 },

  alert: { padding:'12px 16px', borderRadius:10, fontSize:13, marginBottom:20 },
  alertSuccess: { background:'rgba(34,211,165,0.1)', border:'1px solid rgba(34,211,165,0.25)', color:'#22d3a5' },
  alertError:   { background:'rgba(239,68,68,0.1)',  border:'1px solid rgba(239,68,68,0.25)',  color:'#ef4444' },

  card: { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:20, padding:32 },
  cardTitle: { fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700, color:'#f0f0ff', marginBottom:6 },
  cardSub:   { color:'#7a7a9a', fontSize:14, marginBottom:28 },

  // Profession cards
  profGrid: { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:24 },
  profCard: { background:'#1c1c27', border:'1px solid #2a2a3d', borderRadius:14,
              padding:'20px 12px', textAlign:'center', cursor:'pointer',
              transition:'all .22s', position:'relative' },
  profIcon:  { fontSize:28, marginBottom:8 },
  profLabel: { fontSize:13, fontWeight:600 },
  profCheck: { position:'absolute', top:8, right:8, width:18, height:18,
               borderRadius:'50%', color:'#fff', fontSize:10,
               display:'flex', alignItems:'center', justifyContent:'center' },

  // Field preview chips
  fieldPreview: { background:'#0a0a0f', border:'1px solid #2a2a3d',
                  borderRadius:12, padding:16, marginBottom:24 },
  fieldPreviewTitle: { fontSize:13, color:'#7a7a9a', marginBottom:10 },
  fieldChips: { display:'flex', flexWrap:'wrap', gap:8 },
  fieldChip:  { padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:500 },

  // Template cards
  templateGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 },
  templateCard: { background:'#1c1c27', border:'1px solid #2a2a3d', borderRadius:14,
                  padding:14, cursor:'pointer', transition:'all .22s',
                  position:'relative' },
  templatePreview: { height:100, marginBottom:12, borderRadius:8, overflow:'hidden' },
  templateName:   { fontSize:15, fontWeight:600, marginBottom:4 },
  templateDesc:   { fontSize:12, color:'#7a7a9a', lineHeight:1.5 },
  templateCheck:  { position:'absolute', top:10, right:10, width:20, height:20,
                    borderRadius:'50%', color:'#fff', fontSize:11,
                    display:'flex', alignItems:'center', justifyContent:'center' },

  // Form
  section:      { marginBottom:24, paddingBottom:24, borderBottom:'1px solid #2a2a3d' },
  sectionLabel: { fontSize:11, fontWeight:700, letterSpacing:'1.5px',
                  textTransform:'uppercase', marginBottom:16 },
  grid2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:4 },
  label:  { display:'block', fontSize:12, color:'#7a7a9a', marginBottom:6, fontWeight:500 },
  req:    { color:'#ef4444' },
  hint:   { color:'#4a4a6a', fontWeight:400 },
  input:  { width:'100%', padding:'11px 14px', background:'#1c1c27',
            border:'1px solid #2a2a3d', borderRadius:10, color:'#f0f0ff',
            fontSize:14, outline:'none', marginBottom:16,
            boxSizing:'border-box', fontFamily:'DM Sans,sans-serif',
            transition:'border-color .2s' },

  btnRow:  { display:'flex', gap:12, marginTop:8 },
  nextBtn: { padding:'12px 28px', color:'#fff', border:'none',
             borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' },
  backBtn: { padding:'12px 20px', background:'transparent', border:'1px solid #2a2a3d',
             color:'#7a7a9a', borderRadius:10, fontSize:14, cursor:'pointer' },

  // Preview
  preview: { background:'#0a0a0f', border:'1px solid',
             borderRadius:16, padding:24, marginBottom:24 },
  previewHeader: { display:'flex', alignItems:'center', gap:16,
                   paddingBottom:16, marginBottom:16 },
  previewAvatar: { width:56, height:56, borderRadius:14, flexShrink:0,
                   background:'linear-gradient(135deg,#6c63ff,#ff6584)',
                   display:'flex', alignItems:'center', justifyContent:'center',
                   fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#fff' },
  previewName:    { fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800,
                    color:'#f0f0ff', marginBottom:4 },
  previewTagline: { fontSize:14, marginBottom:10 },
  previewBadges:  { display:'flex', flexWrap:'wrap', gap:8 },
  previewBadge:   { padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:500 },
  previewAbout:   { color:'#a0a0c0', fontSize:14, lineHeight:1.7, marginBottom:16 },

  previewFields:   { display:'flex', flexDirection:'column', gap:10 },
  previewFieldRow: { display:'flex', alignItems:'flex-start', gap:10 },
  previewFieldLabel:{ fontSize:12, fontWeight:600, minWidth:120, paddingTop:3 },
  previewFieldVal:  { fontSize:13, color:'#a0a0c0', display:'flex', flexWrap:'wrap', gap:6 },
  chip: { padding:'3px 10px', borderRadius:20, fontSize:12 },
};