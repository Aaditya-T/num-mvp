import React from 'react';
import { calculatePersonalYear, calculatePersonalMonth, calculatePersonalDay } from '../../../utils/reportCalculations';
import { PERSONAL_YEAR_TEMPLATES } from '../../../utils/reportConstants';
import EditableText from '../editables/EditableText';

// Dynamic year keywords per personal year number (all 3 languages)
const YEAR_KEYWORDS = {
  English: {
    1: 'New Beginnings & Independence',
    2: 'Patience, Partnerships & Diplomacy',
    3: 'Creativity, Expression & Learning',
    4: 'Hard Work, Discipline & Foundation',
    5: 'Change, Freedom & Expansion',
    6: 'Family, Harmony & Responsibility',
    7: 'Reflection, Spirituality & Analysis',
    8: 'Ambition, Wealth & Achievement',
    9: 'Completion, Release & Transition'
  },
  Hindi: {
    1: 'नई शुरुआत और स्वतंत्रता',
    2: 'धैर्य, साझेदारी और कूटनीति',
    3: 'रचनात्मकता, अभिव्यक्ति और ज्ञान',
    4: 'कड़ी मेहनत, अनुशासन और आधारशिला',
    5: 'परिवर्तन, स्वतंत्रता और विस्तार',
    6: 'परिवार, सद्भाव और जिम्मेदारी',
    7: 'आत्मनिरीक्षण, आध्यात्मिकता और विश्लेषण',
    8: 'महत्वाकांक्षा, धन और उपलब्धि',
    9: 'पूर्णता, विदाई और परिवर्तन'
  },
  Gujarati: {
    1: 'નવી શરૂઆત અને સ્વતંત્રતા',
    2: 'ધીરજ, ભાગીદારી અને સંવાદ',
    3: 'સર્જનાત્મકતા, અભિવ્યક્તિ અને જ્ઞાન',
    4: 'ભારે મહેનત, શિસ્ત અને પાયો',
    5: 'પરિવર્તન, સ્વતંત્રતા અને વિસ્તાર',
    6: 'કુટુંબ, સંવાદિતા અને જવાબદારી',
    7: 'આત્મ-ચિંતન, આધ્યાત્મિકતા અને સંશોધન',
    8: 'મહત્વાકાંક્ષા, સમૃદ્ધિ અને સિદ્ધિ',
    9: 'પૂર્ણતા, વિદાય અને સંક્રાંતિ'
  }
};

export default function PersonalCycles({ dob, lang, t }) {
  const today = new Date();
  const year = today.getFullYear();
  
  const py = calculatePersonalYear(dob, year);
  const pm = calculatePersonalMonth(dob, today);
  const pd = calculatePersonalDay(dob, today);

  const yearText = PERSONAL_YEAR_TEMPLATES[lang]?.[py] || '';
  const currentKeyword = YEAR_KEYWORDS[lang]?.[py] || YEAR_KEYWORDS.English[py] || 'Focus Cycle';

  const monthText = lang === 'Hindi' 
    ? `इस महीने ध्यान मुख्य रूप से आपके व्यक्तिगत चक्र के अंक ${pm} की गतिविधियों पर केंद्रित रहेगा।` 
    : lang === 'Gujarati'
    ? `આ મહિના દરમિયાન તમારા મુખ્ય કાર્યો વ્યક્તિગત અંક ${pm} થી પ્રભાવિત રહેશે.`
    : `This month indicates actions aligned with personal number ${pm} energy.`;

  const dayText = lang === 'Hindi'
    ? `आज का दिन व्यक्तिगत दिन ${pd} की ऊर्जा के साथ संरेखित गतिविधियों के लिए शुभ है।`
    : lang === 'Gujarati'
    ? `આજનો દિવસ વ્યક્તિગત દિવસ ${pd} ની ઉર્જા સાથે સુસંગત કાર્યો માટે શ્રેષ્ઠ છે.`
    : `Today is influenced by the vibration of personal day ${pd}.`;

  // Month names for current cycles
  const monthNames = {
    English: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    Hindi: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
    Gujarati: ["જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઓગસ્ટ", "સપ્ટેમ્બર", "ઓક્ટોબર", "નવેમ્બર", "ડિસેમ્બર"]
  };

  const currentMonthName = monthNames[lang]?.[today.getMonth()] || monthNames.English[today.getMonth()];

  return (
    <div className="report-cycles-container">
      <div className="report-cycle-card primary-cycle">
        <div className="cycle-badge-row">
          <span className="cycle-type-label">{t.personalYear}</span>
          <span className="cycle-badge">{py}</span>
        </div>
        <div className="cycle-content">
          <h4>{year} - {year + 1}</h4>
          <EditableText editId="personalCycles.yearText" defaultValue={yearText} tag="p" className="cycle-desc" multiline />
          <div className="cycle-keywords">
            <strong>{lang === 'Hindi' ? 'मुख्य शब्द:' : lang === 'Gujarati' ? 'મુખ્ય શબ્દ:' : 'Keywords:'}</strong> {currentKeyword}
          </div>
        </div>
      </div>

      <div className="cycles-sub-grid">
        <div className="report-cycle-card">
          <div className="cycle-badge-row">
            <span className="cycle-type-label">{t.personalMonth}</span>
            <span className="cycle-badge mini-badge">{pm}</span>
          </div>
          <div className="cycle-content">
            <h4>{currentMonthName}</h4>
            <EditableText editId="personalCycles.monthText" defaultValue={monthText} tag="p" className="cycle-desc" multiline
            />
          </div>
        </div>

        <div className="report-cycle-card">
          <div className="cycle-badge-row">
            <span className="cycle-type-label">{t.personalDay}</span>
            <span className="cycle-badge mini-badge">{pd}</span>
          </div>
          <div className="cycle-content">
            <h4>Today ({today.toLocaleDateString()})</h4>
            <EditableText editId="personalCycles.dayText" defaultValue={dayText} tag="p" className="cycle-desc" multiline />
          </div>
        </div>
      </div>
    </div>
  );
}
