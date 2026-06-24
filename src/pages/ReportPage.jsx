import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Printer, ArrowLeft, RefreshCw, Compass, Edit3, List } from 'lucide-react';
import NumerologyReport from '../components/report/NumerologyReport';
import { EditProvider } from '../components/report/EditContext';
import EditorPanel from '../components/report/editor/EditorPanel';
import EditorSheet from '../components/report/editor/EditorSheet';
import DraftListCard from '../components/report/editor/DraftListCard';
import PinLockScreen from '../components/PinLockScreen';
import { REPORT_TRANSLATIONS } from '../utils/reportConstants';
import {
  createEmptyDraft,
  getAllDrafts,
  getDraft,
  deleteDraft as deleteStoreDraft,
  duplicateDraft as duplicateStoreDraft,
  saveDraft,
} from '../utils/draftStore';

function getInitialReportInputs() {
  const fallback = {
    name: '',
    dob: '',
    gender: 'Male',
    language: 'English',
    brand: 'mentor'
  };

  if (typeof window === 'undefined') return fallback;

  const hashQuery = window.location.hash.includes('?')
    ? window.location.hash.split('?').slice(1).join('?')
    : '';
  const rawQuery = hashQuery || window.location.search.replace(/^\?/, '');
  const params = new URLSearchParams(rawQuery);
  const language = params.get('language') || fallback.language;
  const gender = params.get('gender') || fallback.gender;
  const brand = params.get('brand') || fallback.brand;

  return {
    name: params.get('name') || fallback.name,
    dob: params.get('dob') || fallback.dob,
    gender: ['Male', 'Female'].includes(gender) ? gender : fallback.gender,
    language: REPORT_TRANSLATIONS[language] ? language : fallback.language,
    brand: ['mentor', 'numero'].includes(brand) ? brand : fallback.brand
  };
}

export default function ReportPage() {
  const initialInputs = getInitialReportInputs();
  const [inputs, setInputs] = useState(initialInputs);
  const [showReport, setShowReport] = useState(Boolean(initialInputs.name && initialInputs.dob));
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('operator_authenticated') === 'true';
  });

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDraft, setCurrentDraft] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [showDrafts, setShowDrafts] = useState(false);

  // Mobile PDF scale ref — keeps the A4-width report fitting on narrow viewports
  const docWrapperRef = useRef(null);

  useEffect(() => {
    const REPORT_WIDTH = 794; // px — fixed A4 design width
    const updateScale = () => {
      if (!docWrapperRef.current) return;
      const available = docWrapperRef.current.offsetWidth;
      if (available < REPORT_WIDTH) {
        const scale = available / REPORT_WIDTH;
        docWrapperRef.current.style.setProperty('--report-mobile-scale', scale);
        // Collapse the bottom whitespace that results from scaling
        const sheet = docWrapperRef.current.querySelector('.report-document-sheet');
        if (sheet) {
          const scaledHeight = sheet.scrollHeight * scale;
          docWrapperRef.current.style.minHeight = scaledHeight + 'px';
        }
      } else {
        docWrapperRef.current.style.removeProperty('--report-mobile-scale');
        docWrapperRef.current.style.minHeight = '';
      }
    };

    const ro = new ResizeObserver(updateScale);
    if (docWrapperRef.current) ro.observe(docWrapperRef.current);
    updateScale();
    return () => ro.disconnect();
  }, [showReport, isEditMode]);

  // Load drafts list on mount
  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const all = await getAllDrafts();
      setDrafts(all);
    } catch (err) {
      console.error('Failed to load drafts:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputs.name || !inputs.dob) {
      alert("Please enter Name and Date of Birth!");
      return;
    }
    setIsEditMode(false);
    setCurrentDraft(null);
    setShowReport(true);
  };

  const handleReset = () => {
    setShowReport(false);
    setIsEditMode(false);
    setCurrentDraft(null);
  };

  const handlePrint = () => {
    // Clear mobile scale layout so print uses full-size A4 content
    if (docWrapperRef.current) {
      docWrapperRef.current.style.removeProperty('--report-mobile-scale');
      docWrapperRef.current.style.minHeight = '';
    }
    window.print();
  };

  // ─── Edit Mode ─────────────────────────────────────────────────

  const handleEnterEditMode = async () => {
    if (currentDraft) {
      // Already have a draft, just toggle edit
      setIsEditMode(true);
      return;
    }
    // Create new draft from current inputs
    try {
      const draft = await createEmptyDraft({
        name: inputs.name,
        dob: inputs.dob,
        gender: inputs.gender,
        language: inputs.language,
        brand: inputs.brand || 'mentor',
      });
      setCurrentDraft(draft);
      setIsEditMode(true);
      await loadDrafts();
    } catch (err) {
      console.error('Failed to create draft:', err);
    }
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
  };

  const handleDraftChange = useCallback((updatedDraft) => {
    setCurrentDraft(updatedDraft);
    // Also update the base inputs if they changed
    if (updatedDraft?.baseInputs) {
      setInputs(updatedDraft.baseInputs);
    }
    loadDrafts();
  }, []);

  const handleClientFieldChange = useCallback(async (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (currentDraft) {
      const updated = {
        ...currentDraft,
        baseInputs: { ...currentDraft.baseInputs, [field]: value }
      };
      setCurrentDraft(updated);
      try {
        await saveDraft(updated);
        await loadDrafts();
      } catch (err) {
        console.error('Failed to save client field change:', err);
      }
    }
  }, [currentDraft]);

  const handleResetAll = useCallback(async () => {
    if (!currentDraft) return;
    if (!confirm('Reset ALL edits to generated values? This cannot be undone.')) return;
    const updated = {
      ...currentDraft,
      overrides: {},
      hiddenSections: [],
      notesBySection: {},
      images: {},
    };
    setCurrentDraft(updated);
    try {
      await saveDraft(updated);
      await loadDrafts();
    } catch (err) {
      console.error('Failed to reset draft:', err);
    }
  }, [currentDraft]);

  const handleDuplicateDraft = useCallback(async () => {
    if (!currentDraft) return;
    try {
      const newDraft = await duplicateStoreDraft(currentDraft.id);
      setCurrentDraft(newDraft);
      setInputs(newDraft.baseInputs);
      await loadDrafts();
    } catch (err) {
      console.error('Failed to duplicate draft:', err);
    }
  }, [currentDraft]);

  const handleDeleteDraft = useCallback(async (draftId) => {
    const id = draftId || currentDraft?.id;
    if (!id) return;
    if (!confirm('Delete this draft permanently?')) return;
    try {
      await deleteStoreDraft(id);
      if (currentDraft?.id === id) {
        setCurrentDraft(null);
        setIsEditMode(false);
        setShowReport(false);
      }
      await loadDrafts();
    } catch (err) {
      console.error('Failed to delete draft:', err);
    }
  }, [currentDraft]);

  const handleOpenDraft = useCallback(async (draftId) => {
    try {
      const draft = await getDraft(draftId);
      if (draft) {
        setCurrentDraft(draft);
        setInputs(draft.baseInputs);
        setShowReport(true);
        setIsEditMode(true);
      }
    } catch (err) {
      console.error('Failed to open draft:', err);
    }
  }, []);

  const handleDuplicateFromList = useCallback(async (draftId) => {
    try {
      await duplicateStoreDraft(draftId);
      await loadDrafts();
    } catch (err) {
      console.error('Failed to duplicate draft:', err);
    }
  }, []);

  const t = REPORT_TRANSLATIONS[inputs.language] || REPORT_TRANSLATIONS.English;

  // ─── Render ────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return <PinLockScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`report-page-container ${isEditMode ? 'edit-mode-active' : ''}`}>
      {/* Top Banner - hidden during printing */}
      <div className="report-header-banner hide-on-print">
        <div className="banner-nav">
          <a href="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Public Website</span>
          </a>
          <div className="banner-center-nav">
            <a href="#/report" className="nav-tab-link active">
              Report Generator
            </a>
            <a href="#/invoice" className="nav-tab-link">
              Invoice Generator
            </a>
          </div>
          <div className="banner-title-group">
            <Sparkles size={18} className="icon-gold" />
            <h2>Operator Portal</h2>
          </div>
        </div>
      </div>

      <div className="report-main-content">
        {!showReport ? (
          /* OPERATOR INPUT FORM */
          <div className="operator-form-card animation-fade-in hide-on-print">
            <div className="form-header-intro">
              <Compass className="animate-spin-slow text-gold" size={36} />
              <h2>Operator Report Generator</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="operator-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="name">Client Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={inputs.name}
                    onChange={handleChange}
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={inputs.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="gender">Gender (for Kua Calculation)</label>
                  <select
                    id="gender"
                    name="gender"
                    value={inputs.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="language">Report Language</label>
                  <select
                    id="language"
                    name="language"
                    value={inputs.language}
                    onChange={handleChange}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="brand">Report Brand / Logo</label>
                  <select
                    id="brand"
                    name="brand"
                    value={inputs.brand || 'mentor'}
                    onChange={handleChange}
                  >
                    <option value="mentor">Mentor Universe (logo.png)</option>
                    <option value="numero">Numero Divine (numero-divine.jpeg)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-generate-report">
                <span>Generate Detailed Report</span>
                <Sparkles size={16} />
              </button>
            </form>

            {/* Draft List Section */}
            {drafts.length > 0 && (
              <div className="drafts-section">
                <button
                  className="drafts-toggle-btn"
                  onClick={() => setShowDrafts(!showDrafts)}
                >
                  <List size={16} />
                  <span>Saved Drafts ({drafts.length})</span>
                  <span className={`drafts-chevron ${showDrafts ? 'open' : ''}`}>▾</span>
                </button>
                
                {showDrafts && (
                  <div className="drafts-list animation-fade-in">
                    {drafts.map(d => (
                      <DraftListCard
                        key={d.id}
                        draft={d}
                        onOpen={handleOpenDraft}
                        onDelete={handleDeleteDraft}
                        onDuplicate={handleDuplicateFromList}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* REPORT VIEW & CONTROLS */
          <div className={`report-preview-layout animation-fade-in ${isEditMode ? 'with-editor' : ''}`}>
            <EditProvider
              draft={currentDraft}
              isEditMode={isEditMode}
              onDraftChange={handleDraftChange}
              brand={inputs.brand || 'mentor'}
            >
              {/* Control Panel - hidden during printing */}
              <div className="report-control-panel hide-on-print">
                <div className="control-meta">
                  <h3>Report Ready: <span className="text-gold">{inputs.name}</span></h3>
                  <p>
                    {isEditMode 
                      ? 'Edit mode active. Click any text to edit, use the panel to manage sections.'
                      : 'Verify the sections below, then click Print to save as PDF or print on paper.'
                    }
                  </p>
                </div>
                <div className="control-actions">
                  <button onClick={handlePrint} className="btn btn-primary print-action-btn">
                    <Printer size={16} />
                    <span>{t.printReport}</span>
                  </button>
                  {!isEditMode ? (
                    <button onClick={handleEnterEditMode} className="btn btn-secondary edit-mode-btn">
                      <Edit3 size={16} />
                      <span>Edit Report</span>
                    </button>
                  ) : (
                    <button onClick={handleExitEditMode} className="btn btn-secondary">
                      <span>Exit Edit</span>
                    </button>
                  )}
                  <button onClick={handleReset} className="btn btn-secondary">
                    <RefreshCw size={16} />
                    <span>New Report</span>
                  </button>
                </div>
              </div>

              {/* Main content area: report + optional editor */}
              <div className="report-content-area">
                {/* Report Document — wrapped for mobile scaling */}
                <div className="report-document-wrapper" ref={docWrapperRef}>
                  <div className="report-document-sheet">
                    <NumerologyReport
                      name={inputs.name}
                      dob={inputs.dob}
                      gender={inputs.gender}
                      lang={inputs.language}
                      brand={inputs.brand || 'mentor'}
                    />
                  </div>
                </div>

                {/* Desktop Editor Panel — only in edit mode */}
                {isEditMode && (
                  <EditorPanel
                    clientInputs={inputs}
                    onClientChange={handleClientFieldChange}
                    onResetAll={handleResetAll}
                    onDuplicate={handleDuplicateDraft}
                    onDelete={() => handleDeleteDraft()}
                    onBack={handleExitEditMode}
                  />
                )}
              </div>

              {/* Mobile Editor Sheet — only in edit mode */}
              {isEditMode && (
                <EditorSheet
                  clientInputs={inputs}
                  onClientChange={handleClientFieldChange}
                  onResetAll={handleResetAll}
                  onDuplicate={handleDuplicateDraft}
                  onDelete={() => handleDeleteDraft()}
                  onBack={handleExitEditMode}
                />
              )}
            </EditProvider>
          </div>
        )}
      </div>
    </div>
  );
}
