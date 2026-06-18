import React from 'react';
import { getPresentArrows } from '../../../utils/reportCalculations';
import { ARROW_DEEP_TEMPLATES } from '../../../utils/reportConstants';
import EditableText from '../editables/EditableText';

// Lo Shu Grid adjacent pairs with their meanings
const PAIR_MEANINGS = {
  English: {
    "1-2": { name: "Intuitive Leader", desc: "Blend of independence and sensitivity. Strong inner voice guiding leadership decisions." },
    "1-3": { name: "Knowledge Leader", desc: "Wisdom combined with action. Natural teacher and spiritual guide." },
    "1-6": { name: "Responsible Creator", desc: "Creative independence channeled through family values and beauty." },
    "1-7": { name: "Investigator Duo", desc: "Both numbers search for deep truth. Always investigating, finding hidden mysteries, and searching secret wisdom." },
    "1-9": { name: "Dynamic Pioneer", desc: "Fire and authority. Courageous leader with immense willpower and drive." },
    "2-3": { name: "Creative Diplomat", desc: "Emotional intelligence blended with expressive wisdom. Great counselor." },
    "2-6": { name: "Nurturing Harmony", desc: "Deep love for family and home. Excellent taste and artistic pursuits." },
    "2-7": { name: "Psychic Intuition", desc: "Heightened sensitivity and mystical connection. Dreams carry messages." },
    "3-5": { name: "Communicative Sage", desc: "Brilliant communicator with deep knowledge. Writer or media personality." },
    "3-7": { name: "Spiritual Researcher", desc: "Investigator of hidden truths. Analytical philosopher and deep thinker." },
    "3-8": { name: "Structured Knowledge", desc: "Wisdom meets discipline. Strong foundation in education and career." },
    "3-9": { name: "Energetic Mentor", desc: "Dynamic guide with fiery passion for justice and teaching." },
    "5-7": { name: "Analytical Adventurer", desc: "Restless mind seeking deeper truths. Travel and research combined." },
    "5-9": { name: "Passionate Communicator", desc: "Sharp tongue and quick mind. Active salesperson with intense energy." },
    "6-7": { name: "Mystical Nurturer", desc: "Spiritual caretaker. Healing through love and intuitive understanding." },
    "7-9": { name: "Brave Mystic", desc: "Spiritual warrior. Deep research combined with courageous action." },
    "8-1": { name: "Authority Builder", desc: "Karmic lessons meet creative power. Success through sustained effort." },
    "9-1": { name: "Supreme Fire", desc: "Ultimate energy and authority. Natural general with fearless courage." },
    "9-2": { name: "Protective Guardian", desc: "Emotional warrior. Protective of loved ones with high empathy." },
    "9-3": { name: "Righteous Guide", desc: "Spiritual warrior and mentor. Fight for justice with wisdom and knowledge." },
    "9-7": { name: "Spiritual Warrior", desc: "High physical stamina meets deep mysticism. Brave seeker of truth and occult sciences." },
  },
  Hindi: {
    "1-2": { name: "सहज नेता", desc: "स्वतंत्रता और संवेदनशीलता का मिश्रण। नेतृत्व के निर्णयों को निर्देशित करने वाली मजबूत आंतरिक आवाज।" },
    "1-3": { name: "ज्ञान नेता", desc: "ज्ञान और कर्म का संयोजन। स्वाभाविक शिक्षक और आध्यात्मिक मार्गदर्शक।" },
    "1-6": { name: "जिम्मेदार रचनाकार", desc: "पारिवारिक मूल्यों और सौंदर्य के माध्यम से रचनात्मक स्वतंत्रता।" },
    "1-7": { name: "अन्वेषक जोड़ी", desc: "ये दोनों अंक खोजी अंक हैं। किसी न किसी खोज में लगे रहते हैं। गुप्त रहस्यों और विज्ञान की खोज करते हैं।" },
    "1-9": { name: "गतिशील अग्रणी", desc: "अग्नि और अधिकार। अपार इच्छाशक्ति और साहस के साथ नेता।" },
    "2-3": { name: "रचनात्मक राजनयिक", desc: "भावनात्मक बुद्धि और अभिव्यक्त ज्ञान का मिश्रण। उत्कृष्ट सलाहकार।" },
    "2-6": { name: "पोषण सद्भाव", desc: "परिवार और घर के प्रति गहरा प्रेम। उत्कृष्ट कलात्मक रुचि।" },
    "2-7": { name: "मानसिक अंतर्ज्ञान", desc: "उच्च संवेदनशीलता और रहस्यमय संबंध। सपनों में संदेश आते हैं।" },
    "3-5": { name: "संचार ऋषि", desc: "गहन ज्ञान के साथ शानदार संचारक। लेखक या मीडिया व्यक्तित्व।" },
    "3-7": { name: "आध्यात्मिक शोधकर्ता", desc: "छिपे हुए सत्यों का अन्वेषक। विश्लेषणात्मक दार्शनिक और गहन विचारक।" },
    "3-8": { name: "संरचित ज्ञान", desc: "ज्ञान और अनुशासन का मिलन। शिक्षा और करियर में मजबूत नींव।" },
    "3-9": { name: "ऊर्जावान गुरु", desc: "न्याय और शिक्षण के प्रति उग्र जुनून वाला गतिशील मार्गदर्शक।" },
    "5-7": { name: "विश्लेषणात्मक साहसी", desc: "गहरे सत्यों की तलाश करने वाला बेचैन दिमाग। यात्रा और शोध का संयोजन।" },
    "5-9": { name: "भावुक संचारक", desc: "तीखी जुबान और तेज दिमाग। तीव्र ऊर्जा वाला सक्रिय विक्रेता।" },
    "6-7": { name: "रहस्यमय पोषक", desc: "आध्यात्मिक देखभालकर्ता। प्रेम और सहज समझ के माध्यम से उपचार।" },
    "7-9": { name: "बहादुर रहस्यवादी", desc: "आध्यात्मिक योद्धा। साहसी कार्य के साथ गहन शोध।" },
    "8-1": { name: "अधिकार निर्माता", desc: "कर्म पाठ और रचनात्मक शक्ति का मिलन। निरंतर प्रयास से सफलता।" },
    "9-1": { name: "सर्वोच्च अग्नि", desc: "परम ऊर्जा और अधिकार। निडर साहस वाला स्वाभाविक सेनापति।" },
    "9-2": { name: "रक्षक संरक्षक", desc: "भावनात्मक योद्धा। उच्च सहानुभूति के साथ प्रियजनों की रक्षा करने वाला।" },
    "9-3": { name: "न्यायप्रिय मार्गदर्शक", desc: "आध्यात्मिक योद्धा और गुरु। ज्ञान और विवेक के साथ न्याय की लड़ाई।" },
    "9-7": { name: "आध्यात्मिक योद्धा", desc: "उच्च शारीरिक सहनशक्ति और गहन रहस्यवाद का मिलन। सत्य और गुप्त विज्ञान का बहादुर साधक।" },
  },
  Gujarati: {
    "1-2": { name: "સાહજિક નેતા", desc: "સ્વતંત્રતા અને સંવેદનશીલતાનું સંયોજન." },
    "1-3": { name: "જ્ઞાની નેતા", desc: "જ્ઞાન અને ક્રિયાનું મિશ્રણ. કુદરતી શિક્ષક." },
    "1-6": { name: "જવાબદાર સર્જક", desc: "કૌટુંબિક મૂલ્યો દ્વારા સર્જનાત્મકતા." },
    "1-7": { name: "સંશોધક જોડી", desc: "બંને અંકો ગૂઢ રહસ્યોની શોધમાં રહે છે." },
    "1-9": { name: "ગતિશીલ અગ્રેસર", desc: "અગ્નિ અને સત્તા. અપાર હિંમત અને ઈચ્છાશક્તિ." },
    "2-3": { name: "રચનાત્મક મધ્યસ્થ", desc: "ભાવનાત્મક સમજ અને જ્ઞાનનું સંયોજન." },
    "2-6": { name: "પોષણશીલ સંવાદિતા", desc: "પરિવાર પ્રત્યે ગહેરો પ્રેમ." },
    "2-7": { name: "માનસિક આંતરદ્રષ્ટિ", desc: "ઉચ્ચ સંવેદનશીલતા અને રહસ્યમય જોડાણ." },
    "3-5": { name: "સંચાર ઋષિ", desc: "ગહન જ્ઞાન સાથે ઉત્તમ વક્તા." },
    "3-7": { name: "આધ્યાત્મિક સંશોધક", desc: "છુપાયેલા સત્યનો શોધક." },
    "3-8": { name: "શિક્ષિત અને શિસ્તબદ્ધ જ્ઞાન", desc: "શિક્ષણ અને કારકિર્દીમાં મજબૂત પાયો." },
    "3-9": { name: "ઊર્જાવાન માર્ગદર્શક", desc: "ન્યાય માટે ઉત્સાહી ગુરુ." },
    "5-7": { name: "વિશ્લેષણાત્મક સાહસિક", desc: "ઊંડા સત્યની શોધમાં અથક મન." },
    "5-9": { name: "ઉત્કટ વક્તા", desc: "તીક્ષ્ણ બુદ્ધિ અને ઝડપી મન." },
    "6-7": { name: "રહસ્યમય સંભાળ", desc: "પ્રેમ અને સાહજિક સમજ દ્વારા ઉપચાર." },
    "7-9": { name: "બહાદુર સાધક", desc: "ઊંડા સંશોધન સાથે સાહસી ક્રિયા." },
    "8-1": { name: "સત્તા નિર્માતા", desc: "સતત પ્રયાસ દ્વારા સફળતા." },
    "9-1": { name: "સર્વોચ્ચ અગ્નિ", desc: "પરમ ઉર્જા અને નિર્ભય સાહસ." },
    "9-2": { name: "રક્ષક", desc: "ઊંડી સહાનુભૂતિ સાથે પ્રિયજનોનું રક્ષણ." },
    "9-3": { name: "ન્યાયપ્રિય માર્ગદર્શક", desc: "જ્ઞાન અને વિવેક સાથે ન્યાયની લડાઈ." },
    "9-7": { name: "આધ્યાત્મિક યોદ્ધા", desc: "ગૂઢ વિદ્યા અને સાહસનું મિલન." },
  }
};

export default function ArrowsReport({ gridCounts, lang, t }) {
  const arrows = getPresentArrows(gridCounts);

  // Collect full-line arrows from templates
  const activeArrowDetails = [];
  arrows.forEach(arrow => {
    const detail = ARROW_DEEP_TEMPLATES[lang]?.[arrow.key];
    if (detail) {
      activeArrowDetails.push({
        key: arrow.key,
        name: detail.name,
        numbers: arrow.numbers,
        desc: detail.desc,
        type: 'arrow'
      });
    }
  });

  // Collect present number pairs
  const presentNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => gridCounts[n] > 0);
  const pairDetails = [];
  const seenPairs = new Set();

  for (let i = 0; i < presentNums.length; i++) {
    for (let j = i + 1; j < presentNums.length; j++) {
      const a = presentNums[i];
      const b = presentNums[j];
      // Check both orderings
      const key1 = `${a}-${b}`;
      const key2 = `${b}-${a}`;
      const meaning = PAIR_MEANINGS[lang]?.[key1] || PAIR_MEANINGS[lang]?.[key2];
      if (meaning && !seenPairs.has(key1) && !seenPairs.has(key2)) {
        seenPairs.add(key1);
        pairDetails.push({
          key: key1,
          name: meaning.name,
          numbers: [a, b],
          desc: meaning.desc,
          type: 'pair'
        });
      }
    }
  }

  const hasContent = activeArrowDetails.length > 0 || pairDetails.length > 0;

  if (!hasContent) {
    return (
      <div className="report-arrows-empty">
        <p>
          {lang === 'Hindi'
            ? 'आपकी ग्रिड में कोई प्रमुख पूर्ण तीर या विशेष जोड़ी सक्रिय नहीं है।'
            : lang === 'Gujarati'
            ? 'તમારી ગ્રીડમાં કોઈ મુખ્ય પૂર્ણ તીર કે વિશેષ જોડી સક્રિય નથી.'
            : 'No major full arrows or notable pair archetypes are active in your grid.'}
        </p>
      </div>
    );
  }

  return (
    <div className="report-arrows-wrapper">
      {activeArrowDetails.length > 0 && (
        <>
          <h4 className="arrows-sub-heading">
            {lang === 'Hindi' ? 'पूर्ण तीर (Full Arrows)' : lang === 'Gujarati' ? 'પૂર્ણ તીર (Full Arrows)' : 'Complete Grid Arrows'}
          </h4>
          <div className="arrows-cards-grid">
            {activeArrowDetails.map((arrow) => (
              <div key={arrow.key} className="arrow-detail-card">
                <div className="arrow-card-header">
                  <span className="arrow-card-badge">{arrow.numbers.join(', ')}</span>
                  <EditableText editId={`arrows.name_${arrow.key}`} defaultValue={arrow.name} tag="h4" />
                </div>
                <div className="arrow-card-body">
                  <EditableText editId={`arrows.desc_${arrow.key}`} defaultValue={arrow.desc} tag="p" multiline />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {pairDetails.length > 0 && (
        <>
          <h4 className="arrows-sub-heading" style={{ marginTop: activeArrowDetails.length > 0 ? '2rem' : 0 }}>
            {lang === 'Hindi' ? 'विशेष अंक जोड़ी (Number Pairs)' : lang === 'Gujarati' ? 'વિશેષ અંક જોડી (Number Pairs)' : 'Special Number Pair Archetypes'}
          </h4>
          <div className="arrows-cards-grid">
            {pairDetails.map((pair) => (
              <div key={pair.key} className="arrow-detail-card pair-card">
                <div className="arrow-card-header">
                  <span className="arrow-card-badge pair-badge">({pair.numbers.join(', ')})</span>
                  <EditableText editId={`pairs.name_${pair.key}`} defaultValue={pair.name} tag="h4" />
                </div>
                <div className="arrow-card-body">
                  <EditableText editId={`pairs.desc_${pair.key}`} defaultValue={pair.desc} tag="p" multiline />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
