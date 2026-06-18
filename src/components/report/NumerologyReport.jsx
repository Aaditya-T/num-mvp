import ReportSection from './ReportSection';
import EditableText from './editables/EditableText';
import { useEdit } from './EditContext';
import ProfileHeader from './sections/ProfileHeader';
import ExecutiveSummary from './sections/ExecutiveSummary';
import LoShuGridReport from './sections/LoShuGridReport';
import MindNumber from './sections/MindNumber';
import BodyNumber from './sections/BodyNumber';
import CombinationAnalysis from './sections/CombinationAnalysis';
import KuaReport from './sections/KuaReport';
import MissingNumbersReport from './sections/MissingNumbersReport';
import RepeatedNumbersReport from './sections/RepeatedNumbersReport';
import PlanesReport from './sections/PlanesReport';
import ArrowsReport from './sections/ArrowsReport';
import PersonalCycles from './sections/PersonalCycles';
import LuckFactor from './sections/LuckFactor';
import LuckyElements from './sections/LuckyElements';
import GemstoneGuide from './sections/GemstoneGuide';
import FirstLetter from './sections/FirstLetter';
import Remedies from './sections/Remedies';

import {
  calculateMoolank,
  calculateBhagyank,
  calculateLoShuGrid,
  calculateKua
} from '../../utils/numerology';
import { calculateAge } from '../../utils/reportCalculations';
import { REPORT_TRANSLATIONS } from '../../utils/reportConstants';

export default function NumerologyReport({ name, dob, gender, lang }) {
  const { brand } = useEdit();
  // Calculations
  const moolank = calculateMoolank(dob);
  const bhagyank = calculateBhagyank(dob);
  const gridCounts = calculateLoShuGrid(dob, true, moolank, bhagyank);
  const kuaObj = calculateKua(dob, gender);
  const kua = kuaObj ? kuaObj.kua : '';
  const age = calculateAge(dob);

  // Translations
  const t = REPORT_TRANSLATIONS[lang] || REPORT_TRANSLATIONS.English;

  return (
    <div className="numerology-report-root">
      
      {/* 1. COVER PAGE / PROFILE HEADER */}
      <ReportSection showHeader={false} className="cover-section" sectionId="cover">
        <ProfileHeader
          name={name}
          dob={dob}
          gender={gender}
          age={age}
          moolank={moolank}
          bhagyank={bhagyank}
          kua={kua}
          lang={lang}
          t={t}
        />
      </ReportSection>

      {/* 2. EXECUTIVE SUMMARY */}
      <ReportSection title={t.profileHeader} sectionId="summary">
        <ExecutiveSummary
          gridCounts={gridCounts}
          moolank={moolank}
          bhagyank={bhagyank}
          kua={kua}
          lang={lang}
        />
      </ReportSection>

      {/* 3. LO SHU GRID */}
      <ReportSection title={t.loShuGridTitle} sectionId="loshu">
        <LoShuGridReport gridCounts={gridCounts} t={t} lang={lang} />
      </ReportSection>

      {/* 3. CORE NUMBERS: MOOLANK */}
      <ReportSection title={t.mindNumberDeepDive} sectionId="mindNumber">
        <MindNumber moolank={moolank} lang={lang} t={t} />
      </ReportSection>

      {/* 4. CORE NUMBERS: BHAGYANK */}
      <ReportSection title={t.bodyNumberDeepDive} sectionId="bodyNumber">
        <BodyNumber bhagyank={bhagyank} lang={lang} t={t} />
      </ReportSection>

      {/* 5. COMBINATION */}
      <ReportSection title={t.combinationTitle} sectionId="combination">
        <CombinationAnalysis moolank={moolank} bhagyank={bhagyank} lang={lang} t={t} />
      </ReportSection>

      {/* 6. KUA NUMBER */}
      <ReportSection title={t.kuaDeepDive} sectionId="kua">
        <KuaReport kua={kua} gender={gender} lang={lang} t={t} />
      </ReportSection>

      {/* 7. PLANES / YOGAS */}
      <ReportSection title={t.planesAnalysis} sectionId="planes">
        <PlanesReport gridCounts={gridCounts} lang={lang} t={t} />
      </ReportSection>

      {/* 8. ARROWS */}
      <ReportSection title={t.arrowsTitle} sectionId="arrows">
        <ArrowsReport gridCounts={gridCounts} lang={lang} t={t} />
      </ReportSection>

      {/* 9. MISSING NUMBERS */}
      <ReportSection title={t.missingTitle} sectionId="missingNumbers">
        <MissingNumbersReport gridCounts={gridCounts} lang={lang} t={t} />
      </ReportSection>

      {/* 10. REPEATED NUMBERS */}
      <ReportSection title={t.repeatedTitle} sectionId="repeatedNumbers">
        <RepeatedNumbersReport gridCounts={gridCounts} lang={lang} t={t} />
      </ReportSection>

      {/* 10b. FIRST LETTER OF NAME */}
      <ReportSection title={lang === 'Hindi' ? 'नाम का प्रथम अक्षर' : lang === 'Gujarati' ? 'નામનો પ્રથમ અક્ષર' : 'First Letter Analysis'} sectionId="firstLetter">
        <FirstLetter name={name} lang={lang} t={t} />
      </ReportSection>

      {/* 11. PERSONAL CYCLES */}
      <ReportSection title={t.personalCyclesTitle} sectionId="personalCycles">
        <PersonalCycles dob={dob} lang={lang} t={t} />
      </ReportSection>

      {/* 12. LUCK FACTOR TABLE */}
      <ReportSection title={t.luckTableTitle} sectionId="luckFactor">
        <LuckFactor dob={dob} lang={lang} t={t} />
      </ReportSection>

      {/* 13. LUCKY ELEMENTS */}
      <ReportSection title={t.luckyElementsTitle} sectionId="luckyElements">
        <LuckyElements moolank={moolank} lang={lang} t={t} />
      </ReportSection>

      {/* 14. GEMSTONE ILLUSTRATIONS */}
      <ReportSection title={lang === 'Hindi' ? 'रत्न एवं क्रिस्टल चित्र मार्गदर्शिका' : lang === 'Gujarati' ? 'રત્ન અને ક્રિસ્ટલ ચિત્ર માર્ગદર્શિકા' : 'Gemstone & Crystal Illustration Guide'} sectionId="gemstones">
        <GemstoneGuide moolank={moolank} lang={lang} />
      </ReportSection>

      {/* 15. REMEDIES */}
      <ReportSection title={t.remediesTitle} sectionId="remedies">
        <Remedies moolank={moolank} lang={lang} t={t} />
      </ReportSection>

      {/* 16. SIGN OFF */}
      <ReportSection title={t.finalRecommendationTitle} sectionId="signoff">
        <div className="report-signoff-box">
          <EditableText
            editId="signoff.closingStatement"
            defaultValue={lang === 'Hindi'
              ? "यह रिपोर्ट वैदिक अंक ज्योतिष और लो शू ग्रिड सिद्धांतों के आधार पर तैयार की गई है। दिए गए उपायों को श्रद्धापूर्वक करने से आपके जीवन में अनुकूल संतुलन आ सकता है।"
              : lang === 'Gujarati'
              ? "આ અહેવાલ વૈદિક અંકશાસ્ત્રના સિદ્ધાંતો મુજબ તૈયાર કરવામાં આવ્યો છે. આપેલા ઉપાયો શ્રદ્ધાપૂર્વક કરવાથી જીવનમાં સકારાત્મક ઊર્જા વધશે."
              : "This detailed report has been computed utilizing Vedic Astro-Numerological and Feng Shui Grid formulations. Following the prescribed remedies with dedication will aid in structural and energetic alignment."}
            tag="p"
            className="closing-statement"
            multiline
          />
          <div className="sign-row">
            <div className="signature-area">
              <div className="sign-line"></div>
              <span>{t.consultationSign}</span>
            </div>
            <div className="stamp-area">
              <div className="stamp-circle">
                {brand === 'numero' ? (
                  <>
                    <span>NUMERO</span>
                    <span>DIVINE</span>
                  </>
                ) : (
                  <>
                    <span>MENTOR</span>
                    <span>UNIVERSE</span>
                  </>
                )}
              </div>
              <span>{t.stamp}</span>
            </div>
          </div>
        </div>
      </ReportSection>

    </div>
  );
}
