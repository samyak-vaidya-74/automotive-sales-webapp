import React from 'react';

const AiInsight = ({ analysis }) => {
    if (!analysis) return null;

    // Helper to parse the AI string into sections
    const parseAnalysis = (text) => {
        const sections = { pros: [], cons: [], verdict: '' };

        // Split by major headers (PROS:, CONS:, VERDICT:)
        const lines = text.split('\n');
        let currentSection = '';

        lines.forEach(line => {
            const cleanLine = line.replace(/^[*-]\s*/, '').trim(); // Remove bullets like * or -
            if (!cleanLine) return;

            if (line.toUpperCase().includes('PROS:')) currentSection = 'pros';
            else if (line.toUpperCase().includes('CONS:')) currentSection = 'cons';
            else if (line.toUpperCase().includes('VERDICT:')) currentSection = 'verdict';
            else {
                if (currentSection === 'pros') sections.pros.push(cleanLine);
                else if (currentSection === 'cons') sections.cons.push(cleanLine);
                else if (currentSection === 'verdict') sections.verdict = cleanLine;
            }
        });

        return sections;
    };

    const data = parseAnalysis(analysis);

    return (
        <div className="card border-0 shadow-sm overflow-hidden mb-4">
            <div className="card-header bg-dark text-white d-flex align-items-center py-3">
                <i className="bi bi-stars me-2 text-warning"></i>
                <h5 className="mb-0 small fw-bold text-uppercase tracking-wider">Gemini AI Market Analysis</h5>
            </div>
            <div className="card-body bg-white p-4">
                <div className="row">
                    {/* PROS SECTION */}
                    <div className="col-md-6 mb-4 mb-md-0">
                        <h6 className="fw-bold text-success mb-3 small text-uppercase">
                            <i className="bi bi-plus-circle-fill me-2"></i>Key Advantages
                        </h6>
                        <ul className="list-group list-group-flush small">
                            {data.pros.map((pro, i) => (
                                <li key={i} className="list-group-item border-0 px-0 py-1 bg-transparent">
                                    <i className="bi bi-check2 text-success me-2 fw-bold"></i>{pro}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONS SECTION */}
                    <div className="col-md-6">
                        <h6 className="fw-bold text-danger mb-3 small text-uppercase">
                            <i className="bi bi-dash-circle-fill me-2"></i>Considerations
                        </h6>
                        <ul className="list-group list-group-flush small">
                            {data.cons.map((con, i) => (
                                <li key={i} className="list-group-item border-0 px-0 py-1 bg-transparent">
                                    <i className="bi bi-x-lg text-danger me-2 fw-bold" style={{ fontSize: '0.7rem' }}></i>{con}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* VERDICT SECTION */}
                {data.verdict && (
                    <div className="mt-4 pt-3 border-top">
                        <div className="p-3 bg-light rounded-3 border-start border-primary border-4">
                            <h6 className="fw-bold small mb-1 text-primary text-uppercase">Expert Verdict</h6>
                            <p className="mb-0 text-dark small fst-italic">{data.verdict}</p>
                        </div>
                    </div>
                )}

                <div className="text-center mt-3">
                    <small className="text-muted" style={{ fontSize: '0.65rem' }}>
                        *Analysis generated in real-time based on current market trends and vehicle data.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default AiInsight;
