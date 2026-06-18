import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Printer, Check, Copy } from 'lucide-react';
import { numberToWords } from '../utils/numberToWords';
import PinLockScreen from '../components/PinLockScreen';

const BRAND_TEMPLATES = {
  mentor: {
    companyName: '"Mentor Universe" Pinnacle Vastu Consultants',
    address: '6, Moon, Atmiya Empire, Nr Vinayaka Nursing College, Bakrol-Vadtal road, At Bakrol, Anand, Gujarat. 388315',
    phone: '9537836955',
    email: 'shivastro37@gmail.com',
    stateCode: '24-Gujarat',
    bankDetails: 'Anand Branch, A/c No: 41088234567, IFSC: SBIN0003023',
    upiId: '9512507831@okbizaxis',
    terms: 'Thank you for doing business with us.',
    signatureLabel: 'For "Mentor Universe" Pinnacle Vastu Consultants',
    logo: '/logo.png',
    themeClass: 'theme-gold'
  },
  numero: {
    companyName: '"Numero Divine" Numerology & Energy Guidance',
    address: 'Vadodara Branch, Vadodara, Gujarat (Consultations by prior appointment only). 390001',
    phone: '9687062789',
    email: 'payal.divine@gmail.com',
    stateCode: '24-Gujarat',
    bankDetails: 'Vadodara Branch, A/c No: 50100412345678, IFSC: HDFC0000125',
    upiId: '9687062789@okbizaxis',
    terms: 'Thank you for doing business with us.',
    signatureLabel: 'For "Numero Divine" Numerology & Energy Guidance',
    logo: '/numero-divine.jpeg',
    themeClass: 'theme-purple'
  }
};

export default function InvoicePage() {
  const [selectedBrand, setSelectedBrand] = useState('mentor');
  const [activeTab, setActiveTab] = useState('edit');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('operator_authenticated') === 'true';
  });
  
  // Brand details state (pre-populated, editable)
  const [brandDetails, setBrandDetails] = useState({ ...BRAND_TEMPLATES.mentor });

  // Client Details
  const [clientDetails, setClientDetails] = useState({
    name: '',
    mobile: '',
    address: '',
    stateCode: '24-Gujarat'
  });

  // Invoice Details
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
    invoiceDate: new Date().toISOString().slice(0, 10),
    paymentMode: 'Credit'
  });

  // Items List
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Clear Quartz Bracelet (Dimond cut) AA Quality',
      code: '',
      hsn: '',
      quantity: 1,
      rate: 750.00,
      discount: 100.00,
      discountType: 'val' // val (Rs) or pct (%)
    }
  ]);

  // General billing totals
  const [shipping, setShipping] = useState(50.00);
  const [cgstPercent, setCgstPercent] = useState(0);
  const [sgstPercent, setSgstPercent] = useState(0);
  const [amountReceived, setAmountReceived] = useState(0);

  // Copy indicator state
  const [copiedWords, setCopiedWords] = useState(false);

  // Bank details visibility and custom signature upload states
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [customSignature, setCustomSignature] = useState(null);

  // Reset brand details when brand selection changes
  useEffect(() => {
    setBrandDetails({ ...BRAND_TEMPLATES[selectedBrand] });
  }, [selectedBrand]);

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 300;
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setCustomSignature(canvas.toDataURL('image/png'));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };



  // Form handlers
  const handleBrandDetailChange = (e) => {
    const { name, value } = e.target;
    setBrandDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoiceDetails(prev => ({ ...prev, [name]: value }));
  };

  // Item handlers
  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        code: '',
        hsn: '',
        quantity: 1,
        rate: 0,
        discount: 0,
        discountType: 'val'
      }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length === 1) return; // keep at least one
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleItemFieldChange = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // ─── Mathematical Calculations ─────────────────────────────────
  
  let totalQuantity = 0;
  let totalDiscount = 0;
  let subTotal = 0;

  const processedItems = items.map((item, idx) => {
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    const discInput = parseFloat(item.discount) || 0;

    let discVal = 0;
    let discPct = 0;

    if (item.discountType === 'pct') {
      discVal = (qty * rate * discInput) / 100;
      discPct = discInput;
    } else {
      discVal = discInput;
      discPct = (qty * rate) > 0 ? (discInput / (qty * rate)) * 100 : 0;
    }

    const itemAmount = (qty * rate) - discVal;

    totalQuantity += qty;
    totalDiscount += discVal;
    subTotal += itemAmount;

    return {
      ...item,
      serial: idx + 1,
      discVal,
      discPct,
      itemAmount
    };
  });

  const shippingVal = parseFloat(shipping) || 0;
  const cgstVal = (subTotal * parseFloat(cgstPercent || 0)) / 100;
  const sgstVal = (subTotal * parseFloat(sgstPercent || 0)) / 100;
  const grandTotal = subTotal + shippingVal + cgstVal + sgstVal;
  
  const receivedVal = parseFloat(amountReceived) || 0;
  const balanceVal = grandTotal - receivedVal;

  const invoiceWords = numberToWords(grandTotal);

  // UPI Payment Link and QR Code Generation
  const upiLink = brandDetails.upiId
    ? `upi://pay?pa=${brandDetails.upiId}&pn=${encodeURIComponent(brandDetails.companyName.replace(/"/g, ''))}&am=${grandTotal.toFixed(2)}&cu=INR`
    : '';
  const qrCodeUrl = upiLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`
    : '';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWords = () => {
    navigator.clipboard.writeText(invoiceWords);
    setCopiedWords(true);
    setTimeout(() => setCopiedWords(false), 2000);
  };

  if (!isAuthenticated) {
    return <PinLockScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="invoice-page-container">
      {/* Top Banner - hidden on print */}
      <div className="report-header-banner hide-on-print">
        <div className="banner-nav">
          <a href="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Public Website</span>
          </a>
          <div className="banner-center-nav">
            <a href="#/report" className="nav-tab-link">
              Report Generator
            </a>
            <a href="#/invoice" className="nav-tab-link active">
              Invoice Generator
            </a>
          </div>
          <div className="banner-title-group">
            <h2>Operator Portal</h2>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher - hidden on desktop and print */}
      <div className="invoice-mobile-tabs hide-on-print">
        <button 
          className={`mobile-tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          Edit Details
        </button>
        <button 
          className={`mobile-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Live Preview
        </button>
      </div>

      <div className="invoice-workspace-layout">
        
        {/* LEFT PANEL: INPUT FORM (Hidden on print) */}
        <div className={`invoice-form-panel hide-on-print ${activeTab === 'edit' ? 'show-mobile' : 'hide-mobile'}`}>
          
          {/* Brand Config */}
          <div className="form-section-card">
            <h3>Branding & Identity</h3>
            <div className="form-group">
              <label>Select Brand</label>
              <select 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="form-input"
              >
                <option value="mentor">Mentor Universe</option>
                <option value="numero">Numero Divine</option>
              </select>
            </div>
            <div className="form-group">
              <label>Company Display Name</label>
              <input
                type="text"
                name="companyName"
                value={brandDetails.companyName}
                onChange={handleBrandDetailChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Company Address</label>
              <textarea
                name="address"
                value={brandDetails.address}
                onChange={handleBrandDetailChange}
                rows={2}
                className="form-input"
              />
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={brandDetails.phone}
                  onChange={handleBrandDetailChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={brandDetails.email}
                  onChange={handleBrandDetailChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="form-section-card">
            <h3>Bill To (Client Details)</h3>
            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                name="name"
                value={clientDetails.name}
                onChange={handleClientChange}
                placeholder="Enter client full name"
                className="form-input"
              />
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  value={clientDetails.mobile}
                  onChange={handleClientChange}
                  placeholder="Enter mobile number"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Client State</label>
                <input
                  type="text"
                  name="stateCode"
                  value={clientDetails.stateCode}
                  onChange={handleClientChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Client Address</label>
              <input
                type="text"
                name="address"
                value={clientDetails.address}
                onChange={handleClientChange}
                placeholder="Enter client address"
                className="form-input"
              />
            </div>
          </div>

          {/* Invoice Metadata */}
          <div className="form-section-card">
            <h3>Invoice Metadata</h3>
            <div className="form-group-row">
              <div className="form-group">
                <label>Invoice / Quotation No</label>
                <input
                  type="text"
                  name="invoiceNo"
                  value={invoiceDetails.invoiceNo}
                  onChange={handleInvoiceChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Invoice Date</label>
                <input
                  type="date"
                  name="invoiceDate"
                  value={invoiceDetails.invoiceDate}
                  onChange={handleInvoiceChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Payment Mode</label>
              <select
                name="paymentMode"
                value={invoiceDetails.paymentMode}
                onChange={handleInvoiceChange}
                className="form-input"
              >
                <option value="Credit">Credit</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Items Section */}
          <div className="form-section-card">
            <div className="section-header-row">
              <h3>Invoice Items</h3>
              <button onClick={handleAddItem} className="btn btn-secondary btn-sm flex-center">
                <Plus size={14} />
                <span>Add Item</span>
              </button>
            </div>
            
            {items.map((item, index) => (
              <div key={item.id} className="item-input-row">
                <div className="item-row-header">
                  <span>Item #{index + 1}</span>
                  {items.length > 1 && (
                    <button onClick={() => handleRemoveItem(item.id)} className="btn-icon-danger" title="Remove item">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemFieldChange(item.id, 'name', e.target.value)}
                    placeholder="Enter item description"
                    className="form-input"
                  />
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Item Code</label>
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) => handleItemFieldChange(item.id, 'code', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>HSN/SAC</label>
                    <input
                      type="text"
                      value={item.hsn}
                      onChange={(e) => handleItemFieldChange(item.id, 'hsn', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleItemFieldChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit Rate (₹)</label>
                    <input
                      type="number"
                      value={item.rate}
                      min="0"
                      step="any"
                      onChange={(e) => handleItemFieldChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Discount</label>
                    <input
                      type="number"
                      value={item.discount}
                      min="0"
                      step="any"
                      onChange={(e) => handleItemFieldChange(item.id, 'discount', parseFloat(e.target.value) || 0)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Discount Type</label>
                    <select
                      value={item.discountType}
                      onChange={(e) => handleItemFieldChange(item.id, 'discountType', e.target.value)}
                      className="form-input"
                    >
                      <option value="val">Value (₹)</option>
                      <option value="pct">Percentage (%)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charges and GST Taxes */}
          <div className="form-section-card">
            <h3>Taxes & Additional Charges</h3>
            <div className="form-group-row">
              <div className="form-group">
                <label>Shipping / Courier (₹)</label>
                <input
                  type="number"
                  value={shipping}
                  min="0"
                  onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>CGST (%)</label>
                <input
                  type="number"
                  value={cgstPercent}
                  min="0"
                  onChange={(e) => setCgstPercent(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>SGST (%)</label>
                <input
                  type="number"
                  value={sgstPercent}
                  min="0"
                  onChange={(e) => setSgstPercent(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Amount Received (₹)</label>
              <input
                type="number"
                value={amountReceived}
                min="0"
                onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                className="form-input"
              />
            </div>
          </div>

          {/* Payment & Sign-off Config */}
          <div className="form-section-card">
            <h3>Settlement details</h3>
            <div className="form-group">
              <label>Bank details text</label>
              <input
                type="text"
                name="bankDetails"
                value={brandDetails.bankDetails}
                onChange={handleBrandDetailChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Merchant UPI ID (for QR payment)</label>
              <input
                type="text"
                name="upiId"
                value={brandDetails.upiId}
                onChange={handleBrandDetailChange}
                placeholder="UPI ID e.g. shivastro37@okaxis"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Authorized Signature Label</label>
              <input
                type="text"
                name="signatureLabel"
                value={brandDetails.signatureLabel || ''}
                onChange={handleBrandDetailChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Terms & Conditions</label>
              <input
                type="text"
                name="terms"
                value={brandDetails.terms}
                onChange={handleBrandDetailChange}
                className="form-input"
              />
            </div>

            <div className="form-group-checkbox" style={{ margin: '1rem 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="showBankDetails"
                checked={showBankDetails}
                onChange={(e) => setShowBankDetails(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <label htmlFor="showBankDetails" style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Show Bank Account Details (Hidden by default)
              </label>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Upload Custom Signature (PNG / JPG)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="form-input"
                style={{ cursor: 'pointer' }}
              />
              {customSignature && (
                <button
                  type="button"
                  onClick={() => setCustomSignature(null)}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '0.5rem', width: '100%', padding: '0.4rem', fontSize: '0.8rem' }}
                >
                  Remove Custom Signature
                </button>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button onClick={handlePrint} className="btn btn-primary btn-generate-report flex-center mb-4">
            <Printer size={16} />
            <span>Print / Save Invoice PDF</span>
          </button>
        </div>

        {/* RIGHT PANEL: PRINT PREVIEW SHEET */}
        <div className={`invoice-sheet-preview ${activeTab === 'preview' ? 'show-mobile' : 'hide-mobile'}`}>
          
          {/* Action Row */}
          <div className="preview-action-row hide-on-print">
            <span>Invoice Live Sheet Preview</span>
            <button onClick={handlePrint} className="btn btn-primary btn-sm flex-center">
              <Printer size={14} />
              <span>Print Sheet</span>
            </button>
          </div>

          {/* The Actual Invoice document */}
          <div className={`invoice-document ${brandDetails.themeClass}`}>
            
            {/* Header branding */}
            <div className="inv-header">
              <div className="inv-title-col">
                <h1>Tax Invoice</h1>
              </div>
              <div className="inv-original-tag">
                <span>ORIGINAL FOR RECIPIENT</span>
              </div>
            </div>

            <div className="inv-brand-details-row">
              <div className="inv-logo-box">
                <img src={brandDetails.logo} alt={brandDetails.companyName} className="inv-logo-img" />
              </div>
              <div className="inv-company-text">
                <h2>{brandDetails.companyName}</h2>
                <p>{brandDetails.address}</p>
                <div className="inv-company-contact">
                  <span><strong>Phone:</strong> {brandDetails.phone}</span>
                  {brandDetails.email && <span> | <strong>Email:</strong> {brandDetails.email}</span>}
                </div>
                <p className="inv-state"><strong>State:</strong> {brandDetails.stateCode}</p>
              </div>
            </div>

            {/* Bill To & Meta Details Info */}
            <table className="inv-meta-table">
              <tbody>
                <tr>
                  <th>Bill To:</th>
                  <th>Invoice Details:</th>
                </tr>
                <tr>
                  <td>
                    <div className="client-info-block">
                      <strong>{clientDetails.name || 'Client Name'}</strong>
                      {clientDetails.mobile && <p>Phone: {clientDetails.mobile}</p>}
                      {clientDetails.address && <p>Address: {clientDetails.address}</p>}
                      <p>State: {clientDetails.stateCode}</p>
                    </div>
                  </td>
                  <td>
                    <div className="invoice-meta-block">
                      <p><strong>No:</strong> {invoiceDetails.invoiceNo}</p>
                      <p><strong>Date:</strong> {invoiceDetails.invoiceDate}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Items table */}
            <table className="inv-items-table">
              <thead>
                <tr>
                  <th style={{ width: '4%' }}>#</th>
                  <th style={{ width: '35%' }}>Item Name</th>
                  <th style={{ width: '12%' }}>Item Code</th>
                  <th style={{ width: '12%' }}>HSN/SAC</th>
                  <th style={{ width: '8%', textAlign: 'center' }}>Quantity</th>
                  <th style={{ width: '12%', textAlign: 'right' }}>Price/Unit (₹)</th>
                  <th style={{ width: '12%', textAlign: 'right' }}>Discount (₹)</th>
                  <th style={{ width: '12%', textAlign: 'right' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {processedItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.serial}</td>
                    <td className="item-name-cell"><strong>{item.name || 'Item Description'}</strong></td>
                    <td>{item.code || '—'}</td>
                    <td>{item.hsn || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{item.rate.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }} className="discount-cell">
                      <span>{item.discVal > 0 ? `₹ ${item.discVal.toFixed(2)}` : '—'}</span>
                      {item.discPct > 0 && <span className="discount-pct-label">({item.discPct.toFixed(3)}%)</span>}
                    </td>
                    <td style={{ textAlign: 'right' }}>{item.itemAmount.toFixed(2)}</td>
                  </tr>
                ))}
                
                {/* Items Total Summary Row */}
                <tr className="totals-row">
                  <td colSpan="4"><strong>Total</strong></td>
                  <td style={{ textAlign: 'center' }}><strong>{totalQuantity}</strong></td>
                  <td></td>
                  <td style={{ textAlign: 'right' }}><strong>{totalDiscount > 0 ? `₹ ${totalDiscount.toFixed(2)}` : '—'}</strong></td>
                  <td style={{ textAlign: 'right' }}><strong>₹ {subTotal.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>

            {/* Bottom summary and billing calculation grid */}
            <div className="inv-bottom-grid">
              
              {/* Left Column: Settlement mode & Terms */}
              <div className="inv-bottom-left">
                <div className="bottom-left-card">
                  <div className="payment-mode-strip">
                    <strong>Payment Mode:</strong>
                    <span>{invoiceDetails.paymentMode}</span>
                  </div>
                  
                  {brandDetails.terms && (
                    <div className="terms-strip">
                      <strong>Terms And Conditions:</strong>
                      <p>{brandDetails.terms}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Calculations */}
              <div className="inv-bottom-right">
                <table className="summary-calc-table">
                  <tbody>
                    <tr>
                      <td>Sub Total</td>
                      <td>:</td>
                      <td>₹ {subTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Shipping</td>
                      <td>:</td>
                      <td>₹ {shippingVal.toFixed(2)}</td>
                    </tr>
                    
                    {cgstVal > 0 && (
                      <tr>
                        <td>CGST ({cgstPercent}%)</td>
                        <td>:</td>
                        <td>₹ {cgstVal.toFixed(2)}</td>
                      </tr>
                    )}
                    
                    {sgstVal > 0 && (
                      <tr>
                        <td>SGST ({sgstPercent}%)</td>
                        <td>:</td>
                        <td>₹ {sgstVal.toFixed(2)}</td>
                      </tr>
                    )}

                    <tr className="grand-total-row">
                      <td><strong>Total</strong></td>
                      <td><strong>:</strong></td>
                      <td><strong>₹ {grandTotal.toFixed(2)}</strong></td>
                    </tr>

                    <tr className="words-amount-row">
                      <td colSpan="3">
                        <div className="words-wrapper">
                          <strong>Invoice Amount In Words:</strong>
                          <div className="words-row-content">
                            <span className="words-text">{invoiceWords}</span>
                            <button onClick={handleCopyWords} className="btn-words-copy hide-on-print" title="Copy words to clipboard">
                              {copiedWords ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td>Received</td>
                      <td>:</td>
                      <td>₹ {receivedVal.toFixed(2)}</td>
                    </tr>
                    
                    <tr className="balance-due-row">
                      <td><strong>Balance</strong></td>
                      <td><strong>:</strong></td>
                      <td><strong>₹ {balanceVal.toFixed(2)}</strong></td>
                    </tr>

                    {totalDiscount > 0 && (
                      <tr className="savings-row">
                        <td>You Saved</td>
                        <td>:</td>
                        <td className="text-savings">₹ {totalDiscount.toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Page 2 / Sign-off section */}
            <div className="inv-signature-block-row">
              <div className="inv-bank-col">
                {(showBankDetails || qrCodeUrl) && (
                  <div className="bank-details-box">
                    {showBankDetails && (
                      <div style={{ marginBottom: qrCodeUrl ? '0.75rem' : '0' }}>
                        <strong>Bank Details:</strong>
                        <p>{brandDetails.bankDetails}</p>
                      </div>
                    )}
                    
                    {qrCodeUrl && (
                      <div className="upi-qr-card">
                        <img src={qrCodeUrl} alt="UPI QR Code" className="upi-qr-img" />
                        <div className="upi-badge">
                          <span>UPI</span>
                          <small>CLICK TO PAY</small>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="inv-sign-col">
                <div className="sign-details-box">
                  <strong>{brandDetails.signatureLabel || ''}:</strong>
                  <div className="inv-sign-area">
                    {customSignature ? (
                      <img src={customSignature} alt="Authorized Signature" className="inv-signature-img" />
                    ) : (
                      <div className="inv-sign-space"></div>
                    )}
                    <div className="inv-sign-line"></div>
                    <span>Authorized Signatory</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
