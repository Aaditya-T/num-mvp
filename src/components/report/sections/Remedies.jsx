import React from 'react';
import { REMEDIES_TEMPLATES } from '../../../utils/reportConstants';
import EditableText from '../editables/EditableText';

export default function Remedies({ moolank, lang, t }) {
  const planetaryRemedies = REMEDIES_TEMPLATES[lang]?.[moolank] || REMEDIES_TEMPLATES.English[1];

  const staticRudraksha = {
    1: { En: "1 Mukhi or 12 Mukhi Rudraksha. Wear Ruby stone or Garnet in copper ring.", Hi: "1 मुखी या 12 मुखी रुद्राक्ष। तांबे की अंगूठी में माणिक्य या गारनेट धारण करें।", Gu: "૧ મુખી અથવા ૧૨ મુખી રુદ્રાક્ષ. તાંબાની વીંટીમાં માણેક રત્ન પહેરવું." },
    2: { En: "2 Mukhi Rudraksha. Wear Pearl in silver ring on Mondays.", Hi: "2 मुखी रुद्राक्ष। सोमवार को चांदी की अंगूठी में मोती धारण करें।", Gu: "૨ મુખી રુદ્રાક્ષ. સોમવારે ચાંદીની વીંટીમાં મોતી પહેરવું." },
    3: { En: "5 Mukhi Rudraksha. Wear Yellow Sapphire (Pukhraj) in gold ring on Thursdays.", Hi: "5 मुखी रुद्राक्ष। गुरुवार को सोने की अंगूठी में पीला पुखराज धारण करें।", Gu: "૫ મુખી રુદ્રાક્ષ. ગુરુવારે સોનામાં પીળો પુખરાજ પહેરવો." },
    4: { En: "8 Mukhi Rudraksha. Wear Hessonite (Gomed) in silver or lead metal ring.", Hi: "8 मुखी रुद्राक्ष। चांदी या सीसा धातु की अंगूठी में गोमेद धारण करें।", Gu: "૮ મુખી રુદ્રાક્ષ. ચાંદી કે સીસા ધાતુમાં ગોમેદ પહેરવો." },
    5: { En: "4 Mukhi Rudraksha. Wear Emerald (Panna) in gold or silver ring on Wednesdays.", Hi: "4 मुखी रुद्राक्ष। बुधवार को सोने या चांदी की अंगूठी में पन्ना धारण करें।", Gu: "૪ મુખી રુદ્રાક્ષ. બુધવારે સોના કે ચાંદીમાં પન્ના પહેરવા." },
    6: { En: "6 Mukhi Rudraksha. Wear White Sapphire or Diamond in platinum/silver ring.", Hi: "6 मुखी रुद्राक्ष। प्लैटिनम या चांदी की अंगूठी में सफेद पुखराज या हीरा धारण करें।", Gu: "૬ મુખી રુદ્રાક્ષ. પ્લેટિનમ અથવા ચાંદીમાં હીરો કે ઓપલ પહેરવો." },
    7: { En: "9 Mukhi Rudraksha. Wear Cats Eye crystal in silver ring on Thursdays.", Hi: "9 मुखी रुद्राक्ष। गुरुवार को चांदी की अंगूठी में लहसुनिया रत्न धारण करें।", Gu: "૯ મુખી રુદ્રાક્ષ. ગુરુવારે ચાંદીમાં લહસુનિયા પહેરવું." },
    8: { En: "7 Mukhi or 14 Mukhi Rudraksha. Wear Blue Sapphire (Neelam) or Amethyst.", Hi: "7 मुखी या 14 मुखी रुद्राक्ष। नीलम या अमेथिस्ट रत्न धारण करें।", Gu: "૭ મુખી અથવા ૧૪ મુખી રુદ્રાક્ષ. નીલમ અથવા એમેથિસ્ટ રત્ન પહેરવું." },
    9: { En: "3 Mukhi Rudraksha. Wear Red Coral (Moonga) in copper or gold ring on Tuesdays.", Hi: "3 मुखी रुद्राक्ष। मंगलवार को तांबे या सोने की अंगूठी में लाल मूंगा धारण करें।", Gu: "૩ મુખી રુદ્રાક્ષ. મંગળવારે તાંબા કે સોનામાં લાલ મૂંગા પહેરવા." }
  };

  const finalRecs = {
    1: { En: "Feed wheat to birds, respect elders, wear orange/gold shades.", Hi: "पक्षियों को गेहूं खिलाएं, बड़ों का सम्मान करें, नारंगी/सुनहरे रंगों का प्रयोग करें।", Gu: "પક્ષીઓને ઘઉં નાખવા, વડીલોનો આદર કરવો." },
    2: { En: "Donate milk on Mondays, avoid cold food at night, keep fast on Purnima.", Hi: "सोमवार को दूध का दान करें, रात को ठंडे भोजन से बचें, पूर्णिमा का व्रत रखें।", Gu: "સોમવારે દૂધનું દાન કરવું, પૂનમના દિવસે ઉપવાસ કરવો." },
    3: { En: "Donate yellow lentils, apply saffron tilak on forehead, feed bananas to monkeys.", Hi: "पीली दाल दान करें, माथे पर केसर का तिलक लगाएं, बंदरों को केले खिलाएं।", Gu: "ચણાની દાળનું દાન કરવું, કપાળે કેસરનો તિલક કરવો." },
    4: { En: "Feed street dogs, donate lead/coal items on Saturdays, keep copper vessel near head.", Hi: "आवारा कुत्तों को खाना खिलाएं, शनिवार को कोयला दान करें, तांबे का बर्तन सिरहाने रखें।", Gu: "કૂતરાને રોટલી ખવડાવવી, શનિવારે કોલસાનું દાન કરવું." },
    5: { En: "Wear green clothes, feed green grass to cows, wear a Budh Yantra.", Hi: "हरे कपड़े पहनें, गाय को हरी घास खिलाएं, बुध यंत्र धारण करें।", Gu: "લીલા કપડાં પહેરવા, ગાયને લીલું ઘાસ ખવડાવવું, બુધ યંત્ર પહેરવું." },
    6: { En: "Feed white sweets to girls, donate white clothes on Fridays, respect spouse.", Hi: "कन्याओं को सफेद मिठाई खिलाएं, शुक्रवार को सफेद कपड़े दान करें, जीवनसाथी का सम्मान करें।", Gu: "કન્યાઓને સફેદ મીઠાઈ ખવડાવવી, શુક્રવારે સફેદ વસ્ત્રોનું દાન." },
    7: { En: "Donate sesame seeds, feed stray dogs, avoid negative spiritual circles.", Hi: "तिल दान करें, आवारा कुत्तों को खिलाएं, नकारात्मक आध्यात्मिक चक्रों से बचें।", Gu: "તલનું દાન કરવું, કાળા કૂતરાને દૂધ-રોટલી ખવડાવવા." },
    8: { En: "Feed crows, light mustard oil lamp under Peepal tree, support poor workers.", Hi: "कौओं को खिलाएं, पीपल के नीचे सरसों के तेल का दीपक जलाएं, गरीब मजदूरों की मदद करें।", Gu: "કાગડાને ચણ નાખવી, શનિવારે પીપળા નીચે દીવો પ્રગટાવવો." },
    9: { En: "Donate red lentils, read Hanuman Chalisa, avoid fast driving, respect siblings.", Hi: "लाल दाल दान करें, हनुमान चालीसा पढ़ें, तेज गाड़ी चलाने से बचें, भाई-बहनों का सम्मान करें।", Gu: "લાલ મસૂરનું દાન કરવું, હનુમાન ચાલીસા વાંચવી, ઉતાવળે વાહન ન ચલાવવું." }
  };

  const currentRudraksha = staticRudraksha[moolank]?.[lang === 'Hindi' ? 'Hi' : lang === 'Gujarati' ? 'Gu' : 'En'] || staticRudraksha[moolank]?.En;
  const currentFinal = finalRecs[moolank]?.[lang === 'Hindi' ? 'Hi' : lang === 'Gujarati' ? 'Gu' : 'En'] || finalRecs[moolank]?.En;

  return (
    <div className="report-remedies-wrapper">
      <div className="remedies-card">
        <h4>{t.rudrakshaHeader}</h4>
        <EditableText editId="remedies.rudraksha" defaultValue={currentRudraksha} tag="p" className="remedy-text-desc" multiline />
      </div>

      <div className="remedies-card">
        <h4>Planetary Remedy Guidance</h4>
        <EditableText editId="remedies.planetary" defaultValue={planetaryRemedies} tag="p" className="remedy-text-desc" multiline />
      </div>

      <div className="remedies-card highlight-card">
        <h4>Final Astrological Recommendation</h4>
        <EditableText editId="remedies.final" defaultValue={currentFinal} tag="p" className="remedy-text-desc font-bold" multiline />
      </div>
    </div>
  );
}
