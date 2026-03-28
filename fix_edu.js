const fs = require('fs');
let content = fs.readFileSync('src/pages/EducationGuidance.tsx', 'utf8');

const startMarker = '            <TabsContent value="scholarships">';
const si = content.indexOf(startMarker);
const afterStart = content.substring(si + startMarker.length);
const endIdx = afterStart.indexOf('</TabsContent>');
const ei = si + startMarker.length + endIdx + '</TabsContent>'.length;

const before = content.substring(0, si);
const after = content.substring(ei);

// Exact same Card format as college/school cards
const newSection = `            <TabsContent value="scholarships">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map(s => (
                  <div
                    key={s.id}
                    className="group hover:shadow-xl transition-all duration-300 flex flex-col rounded-2xl overflow-hidden bg-white"
                    style={{ border: '1px solid #e5e7eb' }}
                  >
                    {/* ── TOP HEADER BAND (same format as college/school) ── */}
                    <div style={{ background: 'linear-gradient(135deg, #240046 0%, #7B2D8B 55%, #9D4EDD 100%)', padding: '14px 16px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Label */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <Award style={{ width: 13, height: 13, color: '#e879f9', flexShrink: 0 }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#e879f9', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                              {s.type || 'Scholarship'}
                            </span>
                          </div>
                          {/* Title — yellow like college name */}
                          <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fde047', lineHeight: 1.3, margin: 0 }}>
                            {s.title}
                          </h4>
                          {/* Provider — like college location */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.72)' }}>{s.provider}</span>
                          </div>
                        </div>
                        {/* Deadline pill — like rating pill */}
                        {s.deadline && (
                          <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.18)', borderRadius: 99, padding: '5px 10px', textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.65)' }}>Deadline</span>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#fca5a5' }}>{s.deadline}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── BODY — same padding as college card ── */}
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>

                      {/* Amount card — same style as Fees card in college */}
                      <div style={{ background: 'linear-gradient(135deg, #7B2D8B 0%, #9D4EDD 100%)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Scholarship Amount</p>
                          <p style={{ fontSize: 20, fontWeight: 900, color: '#fde047', margin: '2px 0 0' }}>{s.amount}</p>
                        </div>
                        <Award style={{ width: 28, height: 28, color: 'rgba(255,255,255,0.25)' }} />
                      </div>

                      {/* Category chip — like department chips */}
                      {s.category && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, background: '#f3e8ff', color: '#7e22ce', borderRadius: 99, padding: '3px 10px', border: '1px solid #e9d5ff' }}>
                            {s.category}
                          </span>
                          {s.eligibility && (
                            <span style={{ fontSize: 11, fontWeight: 600, background: '#faf5ff', color: '#9333ea', borderRadius: 99, padding: '3px 10px', border: '1px solid #e9d5ff' }}>
                              {s.eligibility}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Spacer */}
                      <div style={{ flex: 1 }} />

                      {/* Apply Button — same style as Apply Now in college */}
                      <a
                        href={s.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '100%', padding: '9px 0', borderRadius: 12,
                          fontSize: 13, fontWeight: 700, color: '#fff',
                          background: 'linear-gradient(135deg, #7B2D8B, #9D4EDD)',
                          textDecoration: 'none', boxShadow: '0 2px 8px rgba(157,78,221,0.4)',
                          boxSizing: 'border-box'
                        }}
                      >
                        Apply Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>`;

fs.writeFileSync('src/pages/EducationGuidance.tsx', before + newSection + after);
console.log('DONE! Scholarship cards now match college/school format exactly!');
