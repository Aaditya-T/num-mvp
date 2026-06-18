import React from 'react';
import { LUCKY_ELEMENTS_TEMPLATES } from '../../../utils/reportConstants';
import EditableText from '../editables/EditableText';

export default function LuckyElements({ moolank, lang, t }) {
  const elements = LUCKY_ELEMENTS_TEMPLATES[lang]?.[moolank] || LUCKY_ELEMENTS_TEMPLATES.English[1];

  const labels = {
    English: {
      prof: "Lucky Professions",
      crystal: "Lucky Crystal",
      color: "Lucky Colors",
      direction: "Lucky Direction",
      element: "Lucky Element",
      months: "Lucky Months",
      days: "Lucky Days",
      diseases: "Vulnerabilities",
      relations: "Relationships"
    },
    Hindi: {
      prof: "शुभ व्यवसाय (Professions)",
      crystal: "शुभ रत्न (Crystal)",
      color: "शुभ रंग (Colors)",
      direction: "शुभ दिशा (Direction)",
      element: "शुभ तत्व (Element)",
      months: "शुभ महीने (Months)",
      days: "शुभ दिन (Days)",
      diseases: "स्वास्थ्य कमजोरियां (Vulnerabilities)",
      relations: "संबंध अनुकूलता (Relationships)"
    },
    Gujarati: {
      prof: "શુભ વ્યવસાય",
      crystal: "શુભ રત્ન",
      color: "શુભ રંગો",
      direction: "શુભ દિશા",
      element: "શુભ તત્વ",
      months: "શુભ મહિનાઓ",
      days: "શુભ દિવસો",
      diseases: "સ્વાસ્થ્ય તકલીફો",
      relations: "સંબંધ સુસંગતતા"
    }
  };

  const currentLabels = labels[lang] || labels.English;

  // Static translations for Months & Days based on number
  const staticMonths = {
    1: { English: "April 21 to May 20, August 21 to Sept 20", Hindi: "21 अप्रैल से 20 मई, 21 अगस्त से 20 सितंबर", Gujarati: "૨૧ એપ્રિલ થી ૨૦ મે, ૨૧ ઓગસ્ટ થી ૨૦ સપ્ટેમ્બર" },
    2: { English: "June 21 to July 20, November 21 to Dec 20", Hindi: "21 जून से 20 जुलाई, 21 नवंबर से 20 दिसंबर", Gujarati: "૨૧ જૂન થી ૨૦ જુલાઈ, ૨૧ નવેમ્બર થી ૨૦ ડિસેમ્બર" },
    3: { English: "Feb 19 to March 20, Nov 21 to Dec 20", Hindi: "19 फरवरी से 20 मार्च, 21 नवंबर से 20 दिसंबर", Gujarati: "૧૯ ફેબ્રુઆરી થી ૨૦ માર્ચ, ૨૧ નવેમ્બર થી ૨૦ ડિસેમ્બર" },
    4: { English: "July 21 to August 20, Oct 21 to Nov 20", Hindi: "21 जुलाई से 20 अगस्त, 21 अक्टूबर से 20 नवंबर", Gujarati: "૨૧ જુલાઈ થી ૨૦ ઓગસ્ટ, ૨૧ ઓક્ટોબર થી ૨૦ નવેમ્બર" },
    5: { English: "May 21 to June 20, Sept 21 to Oct 20", Hindi: "21 मई से 20 जून, 21 सितंबर से 20 अक्टूबर", Gujarati: "૨૧ મે થી ૨૦ જૂન, ૨૧ સપ્ટેમ્બર થી ૨૦ ઓક્ટોબર" },
    6: { English: "April 21 to May 20, Sept 21 to Oct 20", Hindi: "21 अप्रैल से 20 मई, 21 सितंबर से 20 अक्टूबर", Gujarati: "૨૧ એપ્રિલ થી ૨૦ મે, ૨૧ સપ્ટેમ્બર થી ૨૦ ઓક્ટોબર" },
    7: { English: "June 21 to July 20, Oct 21 to Nov 20", Hindi: "21 जून से 20 जुलाई, 21 अक्टूबर से 20 नवंबर", Gujarati: "૨૧ જૂન થી ૨૦ જુલાઈ, ૨૧ ઓક્ટોબર થી ૨૦ નવેમ્બર" },
    8: { English: "Jan 21 to Feb 20, Dec 21 to Jan 20", Hindi: "21 जनवरी से 20 फरवरी, 21 दिसंबर से 20 जनवरी", Gujarati: "૨૧ જાન્યુઆરી થી ૨૦ ફેબ્રુઆરી, ૨૧ ડિસેમ્બર થી ૨૦ જાન્યુઆરી" },
    9: { English: "March 21 to April 20, Oct 21 to Nov 20", Hindi: "21 मार्च से 20 अप्रैल, 21 अक्टूबर से 20 नवंबर", Gujarati: "૨૧ માર્ચ થી ૨૦ એપ્રિલ, ૨૧ ઓક્ટોબર થી ૨૦ નવેમ્બર" }
  };

  const staticDays = {
    1: { English: "Sunday, Monday", Hindi: "रविवार, सोमवार", Gujarati: "રવિવાર, સોમવાર" },
    2: { English: "Monday, Friday, Sunday", Hindi: "सोमवार, शुक्रवार, रविवार", Gujarati: "સોમવાર, શુક્રવાર, રવિવાર" },
    3: { English: "Tuesday, Thursday, Friday", Hindi: "मंगलवार, गुरुवार, शुक्रवार", Gujarati: "મંગળવાર, ગુરુવાર, શુક્રવાર" },
    4: { English: "Saturday, Sunday, Monday", Hindi: "शनिवार, रविवार, सोमवार", Gujarati: "શનિવાર, રવિવાર, સોમવાર" },
    5: { English: "Wednesday, Thursday, Friday", Hindi: "बुधवार, गुरुवार, शुक्रवार", Gujarati: "बुधवार, गुरुवार, शुक्रवार" },
    6: { English: "Tuesday, Thursday, Friday", Hindi: "मंगलवार, गुरुवार, शुक्रवार", Gujarati: "મંગળવાર, ગુરુવાર, શુક્રવાર" },
    7: { English: "Sunday, Monday, Wednesday", Hindi: "रविवार, सोमवार, बुधवार", Gujarati: "રવિવાર, સોમવાર, બુધવાર" },
    8: { English: "Saturday, Sunday, Monday", Hindi: "शनिवार, रविवार, सोमवार", Gujarati: "શનિવાર, રવિવાર, સોમવાર" },
    9: { English: "Tuesday, Thursday, Friday", Hindi: "मंगलवार, गुरुवार, शुक्रवार", Gujarati: "મંગળવાર, ગુરુવાર, શુક્રવાર" }
  };

  const staticDiseases = {
    1: { English: "Heart problems, high blood pressure, eye strain", Hindi: "हृदय रोग, उच्च रक्तचाप, आंखों में खिंचाव", Gujarati: "હૃદયની તકલીફો, બ્લડ પ્રેશર, આંખની નબળાઈ" },
    2: { English: "Stomach issues, anxiety, digestive disorders", Hindi: "पेट की समस्याएं, चिंता, पाचन विकार", Gujarati: "પેટની તકલીફો, માનસિક તણાવ, અપચો" },
    3: { English: "Nervous stress, skin issues, liver problems", Hindi: "स्नायु तनाव, त्वचा रोग, यकृत (लिवर) की समस्याएं", Gujarati: "સ્નાયુ તણાવ, ચામડીના રોગો, લિવરની તકલીફ" },
    4: { English: "Sudden illnesses, respiratory issues, mental stress", Hindi: "अचानक होने वाली बीमारियां, सांस की तकलीफ, मानसिक तनाव", Gujarati: "અણધારી બીમારીઓ, શ્વાસની તકલીફ, માનસિક અશાંતિ" },
    5: { English: "Sleeplessness, nervous exhaustion, headaches", Hindi: "अनिद्रा, स्नायु थकावट, सिरदर्द", Gujarati: "અનિદ્રા, મગજનો થાક, માથાનો દુખાવો" },
    6: { English: "Throat infections, kidney issues, asthma", Hindi: "गले में संक्रमण, गुर्दे (किडनी) की समस्याएं, अस्थमा", Gujarati: "ગળાનું ઇન્ફેક્શન, કિડનીની તકલીફો, અસ્થમા" },
    7: { English: "Skin allergies, mental worries, joint pains", Hindi: "त्वचा की एलर्जी, मानसिक चिंताएं, जोड़ों का दर्द", Gujarati: "ત્વચાની એલર્જી, ચિંતા, સાંધાના દુખાવા" },
    8: { English: "Chronic joint pain, teeth/bone issues, rheumatism", Hindi: "पुराने जोड़ों का दर्द, दांतों/हड्डियों की समस्याएं, गठिया", Gujarati: "સાંધાનો જૂનો દુખાવો, હાડકાની નબળાઈ, સંધિવા" },
    9: { English: "Fevers, blood infections, heat rashes, minor accidents", Hindi: "बुखार, रक्त संक्रमण, गर्मी के दाने, मामूली दुर्घटनाएं", Gujarati: "તાવ, લોહીનું ઇન્ફેક્શન, ગરમીના ચાંદા, અણધારી ઈજાઓ" }
  };

  const staticRelations = {
    1: { English: "Friendly with 1, 2, 3, 5, 9. Avoid conflicts with 8.", Hindi: "1, 2, 3, 5, 9 के साथ मैत्रीपूर्ण। 8 के साथ विवादों से बचें।", Gujarati: "૧, ૨, ૩, ૫, ૯ સાથે ઉત્તમ મેળ. ૮ થી અંતર રાખવું." },
    2: { English: "Friendly with 1, 3, 7. High emotional sensitivity.", Hindi: "1, 3, 7 के साथ अनुकूल। उच्च भावनात्मक संवेदनशीलता।", Gujarati: "૧, ૩, ૭ સાથે મૈત્રીપૂર્ણ સંબંધો." },
    3: { English: "Friendly with 1, 2, 3, 9. Neutral with 5, 7. Conflict with 6.", Hindi: "1, 2, 3, 9 के साथ मित्र। 6 के साथ शत्रुता (36 का आंकड़ा)।", Gujarati: "૧, ૨, ૩, ૯ સાથે મૈત્રી. ૬ સાથે સંબંધોમાં ખટરાગ." },
    4: { English: "Friendly with 1, 5, 6. Neutral with 7, 8. Avoid 9.", Hindi: "1, 5, 6 के साथ मैत्री। 9 के साथ संघर्ष से बचें।", Gujarati: "૧, ૫, ૬ સાથે સારું બને. ૯ થી સાવધ રહેવું." },
    5: { English: "Friendly with 1, 3, 5, 6, 8. Adaptable to all.", Hindi: "1, 3, 5, 6, 8 के साथ मित्रता। सभी के प्रति अनुकूलनशील।", Gujarati: "૧, ૩, ૫, ૬, ૮ સાથે સરસ ભાગીદારી." },
    6: { English: "Friendly with 1, 5, 6, 8. Avoid partnership with 3.", Hindi: "1, 5, 6, 8 के साथ मित्र। 3 के साथ साझेदारी से बचें।", Gujarati: "૧, ૫, ૬, ૮ સાથે મિત્રતા. ૩ સાથે સંઘર્ષ ટાળવો." },
    7: { English: "Friendly with 1, 2, 3, 5. Independent seeker.", Hindi: "1, 2, 3, 5 के साथ मित्रता। स्वतंत्र रूप से रहने वाले।", Gujarati: "૧, ૨, ૩, ૫ સાથે અનુકૂળ સંબંધો." },
    8: { English: "Friendly with 5, 6. Neutral with 3, 7. Avoid 1.", Hindi: "5, 6 के साथ मित्रता। 1 के साथ संबंधों में घर्षण संभव।", Gujarati: "૫, ૬ સાથે મૈત્રીપૂર્ણ. ૧ સાથે વિરોધ શક્ય." },
    9: { English: "Friendly with 1, 2, 3, 5, 9. Conflicts with 4, 8.", Hindi: "1, 2, 3, 5, 9 के साथ मित्रता। 4 और 8 के साथ शत्रुता संभव।", Gujarati: "૧, ૨, ૩, ૫, ૯ સાથે સારું બને. ૪ અને ૮ સાથે વિરોધ." }
  };

  const monthsText = staticMonths[moolank]?.[lang] || staticMonths[moolank]?.English || '';
  const daysText = staticDays[moolank]?.[lang] || staticDays[moolank]?.English || '';
  const diseasesText = staticDiseases[moolank]?.[lang] || staticDiseases[moolank]?.English || '';
  const relationsText = staticRelations[moolank]?.[lang] || staticRelations[moolank]?.English || '';

  return (
    <div className="report-lucky-elements-grid">
      <table className="lucky-elements-table">
        <tbody>
          <tr>
            <td><strong>{currentLabels.prof}:</strong></td>
            <td>
              <EditableText editId="lucky.prof" defaultValue={elements.prof} tag="span" />
            </td>
          </tr>
          <tr>
            <td><strong>{currentLabels.crystal}:</strong></td>
            <td>
              <EditableText editId="lucky.crystal" defaultValue={elements.crystal} tag="span" />
            </td>
          </tr>
          <tr>
            <td><strong>{currentLabels.color}:</strong></td>
            <td>
              <EditableText editId="lucky.color" defaultValue={elements.color} tag="span" />
            </td>
          </tr>
          <tr>
            <td><strong>{currentLabels.direction}:</strong></td>
            <td>
              <EditableText editId="lucky.direction" defaultValue={elements.direction} tag="span" />
            </td>
          </tr>
          <tr>
            <td><strong>{currentLabels.element}:</strong></td>
            <td>
              <EditableText editId="lucky.element" defaultValue={elements.element} tag="span" />
            </td>
          </tr>
          <tr>
            <td><strong>{currentLabels.months}:</strong></td>
            <td>
              <EditableText editId="lucky.months" defaultValue={monthsText} tag="span" />
            </td>
          </tr>
          <tr>
            <td><strong>{currentLabels.days}:</strong></td>
            <td>
              <EditableText editId="lucky.days" defaultValue={daysText} tag="span" />
            </td>
          </tr>
          <tr>
            <td><strong>{currentLabels.diseases}:</strong></td>
            <td>
              <EditableText editId="lucky.diseases" defaultValue={diseasesText} tag="span" />
            </td>
          </tr>
          <tr>
            <td><strong>{currentLabels.relations}:</strong></td>
            <td>
              <EditableText editId="lucky.relations" defaultValue={relationsText} tag="span" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
