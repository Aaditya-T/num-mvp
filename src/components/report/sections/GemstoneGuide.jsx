import { LUCKY_ELEMENTS_TEMPLATES } from '../../../utils/reportConstants';
import EditableText from '../editables/EditableText';
import EditableImageSlot from '../editables/EditableImageSlot';

const labels = {
  English: {
    intro: 'Recommended stone illustrations for the client profile. Add matching photos in public/gemstones to replace the placeholders automatically.',
    primary: 'Primary Stone',
    support: 'Support Stone',
    color: 'Color Therapy',
    missing: 'Image needed'
  },
  Hindi: {
    intro: 'ग्राहक प्रोफाइल के लिए सुझाए गए रत्न चित्र। वास्तविक फोटो जोड़ने के लिए public/gemstones में संबंधित फाइल रखें।',
    primary: 'मुख्य रत्न',
    support: 'सहायक रत्न',
    color: 'रंग चिकित्सा',
    missing: 'चित्र चाहिए'
  },
  Gujarati: {
    intro: 'ગ્રાહક પ્રોફાઇલ માટે સૂચવાયેલા રત્ન ચિત્રો. સાચા ફોટા માટે public/gemstones માં સંબંધિત ફાઇલ મૂકો.',
    primary: 'મુખ્ય રત્ન',
    support: 'સહાયક રત્ન',
    color: 'રંગ ઉપચાર',
    missing: 'ચિત્ર જોઈએ'
  }
};

const gemstoneSlots = {
  1: [
    { name: 'Ruby', file: 'ruby.jpg' },
    { name: 'Garnet', file: 'garnet.jpg' }
  ],
  2: [
    { name: 'Pearl', file: 'pearl.jpg' },
    { name: 'Moonstone', file: 'moonstone.jpg' }
  ],
  3: [
    { name: 'Yellow Sapphire', file: 'yellow-sapphire.jpg' },
    { name: 'Amethyst', file: 'amethyst.jpg' }
  ],
  4: [
    { name: 'Hessonite', file: 'hessonite.jpg' },
    { name: 'Gomed', file: 'gomed.jpg' }
  ],
  5: [
    { name: 'Emerald', file: 'emerald.jpg' },
    { name: 'Green Jade', file: 'green-jade.jpg' }
  ],
  6: [
    { name: 'Diamond', file: 'diamond.jpg' },
    { name: 'White Sapphire', file: 'white-sapphire.jpg' }
  ],
  7: [
    { name: 'Cat Eye', file: 'cat-eye.jpg' },
    { name: 'Lehsuniya', file: 'lehsuniya.jpg' }
  ],
  8: [
    { name: 'Blue Sapphire', file: 'blue-sapphire.jpg' },
    { name: 'Amethyst', file: 'amethyst.jpg' }
  ],
  9: [
    { name: 'Red Coral', file: 'red-coral.jpg' },
    { name: 'Carnelian', file: 'carnelian.jpg' }
  ]
};

function GemstoneImage({ slotId, stone, label }) {
  const src = `/gemstones/${stone.file}`;

  return (
    <div className="gemstone-card">
      <div className="gemstone-photo-frame">
        <EditableImageSlot slotId={slotId} defaultSrc={src} alt={stone.name} className="gemstone-img" />
      </div>
      <div className="gemstone-caption">
        <span>{label}</span>
        <EditableText editId={`${slotId}.name`} defaultValue={stone.name} tag="strong" />
      </div>
    </div>
  );
}

export default function GemstoneGuide({ moolank, lang }) {
  const copy = labels[lang] || labels.English;
  const elements = LUCKY_ELEMENTS_TEMPLATES[lang]?.[moolank] || LUCKY_ELEMENTS_TEMPLATES.English[moolank];
  const stones = gemstoneSlots[moolank] || gemstoneSlots[1];

  return (
    <div className="gemstone-guide">
      <p className="gemstone-intro">{copy.intro}</p>
      <div className="gemstone-cards-grid">
        <GemstoneImage slotId="gemstones.primary" stone={stones[0]} label={copy.primary} />
        <GemstoneImage slotId="gemstones.support" stone={stones[1]} label={copy.support} />
      </div>
      <div className="gemstone-advice-strip">
        <div>
          <span>{copy.color}</span>
          <EditableText editId="gemstones.colorAdvice" defaultValue={elements.color} tag="strong" />
        </div>
        <div>
          <span>{copy.primary}</span>
          <EditableText editId="gemstones.crystalAdvice" defaultValue={elements.crystal} tag="strong" />
        </div>
      </div>
    </div>
  );
}
