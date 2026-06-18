import React from 'react';
import EditableText from '../editables/EditableText';

const FIRST_LETTER_DATA = {
  English: {
    A: "You are ambitious and free-thinking. A strong sense of independence drives you. You prefer to lead, not follow.",
    B: "You are emotional, sensitive, and shy. You are a wonderful friend and an excellent parent. Your feelings are easily hurt.",
    C: "You are very social, intuitive, and talented. You express yourself well and love the spotlight.",
    D: "You are grounded, practical, and hardworking. Your down-to-earth approach builds trust.",
    E: "You are physical, passionate, and temperamental. Freedom is extremely important to you.",
    F: "You are nurturing and responsible. You love deeply and are loyal to your family.",
    G: "You are an intellectual who is inventive and creative. You have high standards.",
    H: "You are creative, powerful, and independent. You have a strong desire to succeed in business.",
    I: "You are compassionate, caring, and creative. You feel things deeply and need harmony.",
    J: "You are ambitious, energetic, and talented. Your drive to succeed is strong.",
    K: "You are intuitive and insightful. You often know things before they happen.",
    L: "You are honest, loving, and benevolent. You are idealistic and seek to help others.",
    M: "You are a workaholic and love to stay busy. You are creative, focused and hard to change.",
    N: "You are creative, original, and strong-minded. You have a unique perspective on life.",
    O: "You are patient, supportive, and rule-following. You have strong moral values.",
    P: "You are intellectual and knowledge-based. You enjoy research and scholarly pursuits.",
    Q: "You are a magnetic person who attracts money and power. You are a trendsetter.",
    R: "You are social, tolerant, and hardworking. You are a humanitarian who cares about society.",
    S: "You are charismatic, warm, and generous. People are drawn to your energy and personality.",
    T: "You are restless and love change and activity. You have strong intuition.",
    U: "You have a roller-coaster life. You can achieve much only to lose it and then rebuild. Use your creativity wisely.",
    V: "You are intuitive, loyal, and genuine. You are sincere and honest in all your dealings.",
    W: "You are creative, eloquent, and determined. You have a strong will and are not easily swayed.",
    X: "You are creative, sensuous, and extremely passionate. You love exciting experiences.",
    Y: "You are a freedom-loving adventurer. You are independent and love to travel.",
    Z: "You are optimistic, compassionate, and dynamic. You are diplomatic and sensitive to others' needs.",
  },
  Hindi: {
    A: "आप महत्वाकांक्षी और स्वतंत्र विचारक हैं। आप में नेतृत्व की प्रबल भावना है।",
    B: "आप भावनात्मक, संवेदनशील और शर्मीले हैं। आप एक अद्भुत मित्र और उत्कृष्ट अभिभावक हैं।",
    C: "आप बहुत सामाजिक, सहज और प्रतिभाशाली हैं। आप खुद को अच्छी तरह व्यक्त करते हैं।",
    D: "आप व्यावहारिक और मेहनती हैं। आपकी जमीनी सोच विश्वास का निर्माण करती है।",
    E: "आप शारीरिक रूप से ऊर्जावान, भावुक और स्वभाव से स्वतंत्र हैं। स्वतंत्रता आपके लिए अत्यंत महत्वपूर्ण है।",
    F: "आप पोषण करने वाले और जिम्मेदार हैं। आप गहरा प्यार करते हैं और अपने परिवार के प्रति वफादार हैं।",
    G: "आप एक बुद्धिजीवी हैं जो आविष्कारशील और रचनात्मक हैं। आपके उच्च मानक हैं।",
    H: "आप रचनात्मक, शक्तिशाली और स्वतंत्र हैं। व्यवसाय में सफल होने की प्रबल इच्छा है।",
    I: "आप दयालु, देखभाल करने वाले और रचनात्मक हैं। आपको सामंजस्य की आवश्यकता है।",
    J: "आप महत्वाकांक्षी, ऊर्जावान और प्रतिभाशाली हैं। सफलता की ओर आपकी तीव्र प्रेरणा है।",
    K: "आप सहज और अंतर्दृष्टि वाले हैं। आप अक्सर चीजों को होने से पहले जान लेते हैं।",
    L: "आप ईमानदार, प्यार करने वाले और परोपकारी हैं। आप आदर्शवादी हैं।",
    M: "आप काम के शौकीन हैं और व्यस्त रहना पसंद करते हैं। आप रचनात्मक और केंद्रित हैं।",
    N: "आप रचनात्मक, मौलिक और दृढ़ विचारों वाले हैं। आपका जीवन के प्रति अनूठा दृष्टिकोण है।",
    O: "आप धैर्यवान, सहायक और नियम पालन करने वाले हैं। आपके नैतिक मूल्य मजबूत हैं।",
    P: "आप बौद्धिक और ज्ञानी हैं। आप शोध और विद्वतापूर्ण कार्यों का आनंद लेते हैं।",
    Q: "आप एक चुंबकीय व्यक्ति हैं जो धन और शक्ति को आकर्षित करते हैं।",
    R: "आप सामाजिक, सहनशील और मेहनती हैं। आप एक मानवतावादी हैं।",
    S: "आप करिश्माई, गर्मजोशी वाले और उदार हैं। लोग आपकी ऊर्जा की ओर आकर्षित होते हैं।",
    T: "आप बेचैन हैं और बदलाव और गतिविधि पसंद करते हैं। आपकी अंतर्ज्ञान मजबूत है।",
    U: "आपका जीवन उतार-चढ़ाव से भरा है। आप बहुत कुछ हासिल कर सकते हैं, खो सकते हैं, फिर बना सकते हैं। अपनी रचनात्मकता का बुद्धिमानी से उपयोग करें।",
    V: "आप सहज, वफादार और सच्चे हैं। आप ईमानदार और निष्कपट हैं।",
    W: "आप रचनात्मक, वाक्पटु और दृढ़ निश्चयी हैं। आपकी इच्छाशक्ति प्रबल है।",
    X: "आप रचनात्मक, संवेदनशील और अत्यधिक भावुक हैं। आपको रोमांचक अनुभव पसंद हैं।",
    Y: "आप स्वतंत्रता-प्रेमी साहसी हैं। आप स्वतंत्र हैं और यात्रा पसंद करते हैं।",
    Z: "आप आशावादी, दयालु और गतिशील हैं। आप कूटनीतिक और दूसरों की जरूरतों के प्रति संवेदनशील हैं।",
  },
  Gujarati: {
    A: "તમે મહત્વાકાંક્ષી અને સ્વતંત્ર વિચારક છો. નેતૃત્વ તમારો કુદરતી ગુણ છે.",
    B: "તમે ભાવુક, સંવેદનશીલ અને શરમાળ છો. ઉત્તમ મિત્ર અને કુટુંબ પ્રેમી.",
    C: "તમે ખૂબ સામાજિક, પ્રતિભાશાળી છો. તમે સ્વયંને સારી રીતે વ્યક્ત કરો છો.",
    D: "તમે વ્યવહારુ અને મહેનતુ છો. વિશ્વાસ ઊભો કરવો એ તમારી તાકાત છે.",
    E: "તમે ઉર્જાવાન, ભાવુક અને સ્વતંત્ર છો.",
    F: "તમે પરિવાર પ્રત્યે જવાબદાર અને વફાદાર છો.",
    G: "તમે બુદ્ધિશાળી, કલ્પનાશીલ અને સર્જનાત્મક છો.",
    H: "તમે સશક્ત, સ્વતંત્ર અને વ્યવસાયમાં સફળ થવા ઈચ્છો છો.",
    I: "તમે દયાળુ, સંભાળ રાખનાર અને સર્જનાત્મક છો.",
    J: "તમે મહત્વાકાંક્ષી, ઉર્જાવાન અને પ્રતિભાશાળી છો.",
    K: "તમે સાહજિક છો. ઘણી વાર ઘટના પહેલાં જ સમજી લો છો.",
    L: "તમે પ્રામાણિક, પ્રેમાળ અને પરોપકારી છો.",
    M: "તમે મહેનતુ, કામ કરવામાં વ્યસ્ત રહેવું ગમે છે.",
    N: "તમે મૌલિક વિચારો ધરાવો છો. અનોખો દ્રષ્ટિકોણ.",
    O: "તમે ધૈર્યવાન, સહાયક અને નૈતિક મૂલ્યોના પાલક છો.",
    P: "તમે બૌદ્ધિક, જ્ઞાની અને સંશોધનપ્રિય છો.",
    Q: "તમે ચુંબકીય વ્યક્તિત્વ ધરાવો છો. ધન અને સત્તા આકર્ષિત થાય.",
    R: "તમે સામાજિક, સહનશીલ અને માનવતાવાદી છો.",
    S: "તમે આકર્ષક, ઉદાર અને ઉર્જાવાન છો.",
    T: "તમે ચંચળ છો, ગતિવિધિ પ્રિય છો. અંતર્જ્ઞાન શક્તિશાળી છે.",
    U: "તમારું જીવન ઉતાર-ચઢાવથી ભરેલું છે. સર્જનાત્મકતાનો ડહાપણથી ઉપયોગ કરો.",
    V: "તમે વફાદાર, નિખાલસ અને પ્રમાણિક છો.",
    W: "તમે સર્જનાત્મક, વાક્પટુ અને દ્રઢ છો.",
    X: "તમે ભાવુક અને રોમાંચ પ્રિય છો.",
    Y: "તમે સાહસિક અને મુસાફરીના શોખીન છો.",
    Z: "તમે આશાવાદી, દયાળુ અને રાજદ્વારી છો.",
  },
};

export default function FirstLetter({ name, lang, t }) {
  const letter = (name || '').trim().charAt(0).toUpperCase();
  if (!letter) return null;

  const meaning =
    FIRST_LETTER_DATA[lang]?.[letter] ||
    FIRST_LETTER_DATA.English[letter] ||
    'Interpretation not available for this letter.';

  return (
    <div className="report-first-letter-card">
      <div className="first-letter-header">
        <div className="first-letter-badge">{letter}</div>
        <div className="first-letter-meta">
          <h3>First Letter: {letter}</h3>
          <p>
            {lang === 'Hindi'
              ? 'आपके नाम का प्रथम अक्षर'
              : lang === 'Gujarati'
                ? 'તમારા નામનો પ્રથમ અક્ષર'
                : 'The first letter of your name'}
          </p>
        </div>
      </div>
      <div className="first-letter-content">
        <EditableText
          editId="firstLetter.meaning"
          defaultValue={meaning}
          tag="p"
          multiline
        />
      </div>
    </div>
  );
}
