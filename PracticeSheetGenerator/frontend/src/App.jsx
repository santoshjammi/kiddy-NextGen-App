import { useState } from 'react';
import axios from 'axios';
import { Sparkles, BookOpen, User, Settings, CheckCircle } from 'lucide-react';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    subject: "English",
    grade_level: "Grade 3",
    curriculum: "Cambridge Primary English",
    topic: "Pronouns",
    total_questions: 3,
    difficulty_level: "Intermediate",
    theme_context: "A journey across the desert to find a hidden oasis",
    question_types: "multiple_choice, fill_in_the_blank"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'total_questions' ? parseInt(value) || 0 : value
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const resp = await axios.post('http://127.0.0.1:8005/api/generate', formData);
      setResult(resp.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate practice sheet. Check if backend is running and your API key is correct.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '40px' }} className="fade-in">
        <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Agentic AI Practice Sheets
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Generate highly engaging, curriculum-aligned tests instantly with our Multi-Agent Team. Hosted in the cloud and stored securely in Firestore.
        </p>
      </header>

      {!result ? (
        <div className="glass-panel fade-in" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-secondary)' }}><BookOpen size={16} /> Subject</label>
              <input name="subject" value={formData.subject} onChange={handleChange} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-secondary)' }}><User size={16} /> Grade Level</label>
              <input name="grade_level" value={formData.grade_level} onChange={handleChange} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-secondary)' }}><Settings size={16} /> Curriculum</label>
              <input name="curriculum" value={formData.curriculum} onChange={handleChange} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-secondary)' }}><CheckCircle size={16} /> Topic</label>
              <input name="topic" value={formData.topic} onChange={handleChange} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Questions Count</label>
              <input type="number" name="total_questions" value={formData.total_questions} onChange={handleChange} min={1} max={50} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Difficulty</label>
              <select name="difficulty_level" value={formData.difficulty_level} onChange={handleChange}>
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Theme Context <span style={{fontSize: '0.8rem', opacity: 0.7}}>(Gamify it!)</span></label>
              <input name="theme_context" value={formData.theme_context} onChange={handleChange} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Question Types</label>
              <input name="question_types" value={formData.question_types} onChange={handleChange} />
            </div>

          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <button className="primary" onClick={handleGenerate} disabled={loading} style={{ width: '100%', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {loading ? <div className="spinner"></div> : <Sparkles />}
              {loading ? 'Crew AI Agents Generating...' : 'Generate New Adventure'}
            </button>
          </div>
        </div>
      ) : (
        <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 5px 0' }}>Mission Unlocked: {result.paper_metadata.theme_context}</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                {result.paper_metadata.subject} • {result.paper_metadata.grade_level} • {result.paper_metadata.topic}
              </p>
            </div>
            <button onClick={() => setResult(null)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
              Create Another
            </button>
          </div>

          {result.questions.map((q, idx) => (
            <div key={q.question_id || idx} className="glass-panel" style={{ padding: '30px', marginBottom: '20px', animation: `fadeIn 0.5s ease-in-out ${idx * 0.1}s forwards`, opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ background: 'var(--accent-purple)', padding: '10px 15px', borderRadius: '12px', fontWeight: 'bold' }}>
                  Q{q.question_id || (idx + 1)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0, fontSize: '1.3rem', lineHeight: '1.5' }}>{q.question_text}</h3>
                  
                  {q.options && q.options.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
                      {q.options.map((opt, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: '25px', padding: '20px', background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid var(--accent-blue)', borderRadius: '0 8px 8px 0' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: 'var(--accent-blue)' }}>Correct Answer: {q.correct_answer}</p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.6' }}>{q.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default App;
