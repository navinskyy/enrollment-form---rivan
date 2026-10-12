'use client';
import { useState } from 'react';
import SignaturePad from './components/SignaturePad';

const COURSES = [
  { name: 'CCNA (200-301)', track: 'Networking' },
  { name: 'CCNP (ENCOR & ENARSI)', track: 'Networking' },
  { name: 'CompTIA Network+ (N10-009)', track: 'Networking' },
  { name: 'CompTIA A+ Core 1 & 2', track: 'IT support' },
  { name: 'Security+ (SY0-701)', track: 'Cybersecurity' },
  { name: 'Full Stack Web Development', track: 'Software development' },
];

const PAYMENT = ['Cash', 'Bank transfer', 'GCash / Maya', 'Credit / debit card', 'Check'];

export default function EnrollmentPage() {
  const [sponsored, setSponsored] = useState('');
  const [company, setCompany] = useState('');
  const [voucher, setVoucher] = useState('');
  const [voucherCode, setVoucherCode] = useState('');

  const isSponsored = sponsored === 'yes';
  const hasVoucher = voucher === 'with';

  function chooseSponsored(value) {
    setSponsored(value);
    if (value !== 'yes') setCompany(''); // company name only applies to sponsored students
  }

  function chooseVoucher(value) {
    setVoucher(value);
    if (value !== 'with') setVoucherCode('');
  }

  return (
    <>
      <div className="bar noprint">
        <p>Fill in the form, sign with your finger or mouse, then print or save as PDF.</p>
        <button className="primary" type="button" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      <main className="sheet">
        <header>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Rivan Security Inc Academy logo" />
          <div>
            <h1>RivanCyber Training Institute Inc.</h1>
            <h2>Student Enrollment Form</h2>
          </div>
        </header>

        <p className="title">Student information</p>
        <p className="note">Please print clearly. All fields are required unless marked optional.</p>

        <div className="grid">
          <label className="f full">
            Full name
            <input type="text" name="name" autoComplete="name" placeholder="Last name, first name, middle name" />
          </label>

          <label className="f full">
            Address
            <input
              type="text"
              name="address"
              autoComplete="street-address"
              placeholder="House no., street, barangay, city/municipality, province"
            />
          </label>

          <div className="full">
            <span className="q" id="q-sp">Sponsored by a company?</span>
            <div className="opts" role="radiogroup" aria-labelledby="q-sp">
              <label>
                <input type="radio" name="sponsored" checked={sponsored === 'yes'} onChange={() => chooseSponsored('yes')} />
                Sponsored
              </label>
              <label>
                <input type="radio" name="sponsored" checked={sponsored === 'no'} onChange={() => chooseSponsored('no')} />
                Not sponsored (self-funded)
              </label>
            </div>
            <label className={`f sub${isSponsored ? '' : ' is-disabled'}`}>
              Company name (if sponsored)
              <input
                type="text"
                name="company"
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={!isSponsored}
                required={isSponsored}
                placeholder={isSponsored ? '' : 'Only for sponsored students'}
              />
            </label>
          </div>

          <label className="f">
            Contact number
            <input type="tel" name="phone" autoComplete="tel" placeholder="09XX XXX XXXX" />
          </label>
          <label className="f">
            Email address
            <input type="email" name="email" autoComplete="email" placeholder="name@example.com" />
          </label>

          <div>
            <span className="q" id="q-v">Voucher</span>
            <div className="opts" role="radiogroup" aria-labelledby="q-v">
              <label>
                <input type="radio" name="voucher" checked={voucher === 'with'} onChange={() => chooseVoucher('with')} />
                With voucher
              </label>
              <label>
                <input type="radio" name="voucher" checked={voucher === 'without'} onChange={() => chooseVoucher('without')} />
                Without voucher
              </label>
            </div>
            <label className={`f sub${hasVoucher ? '' : ' is-disabled'}`}>
              Voucher code
              <input
                type="text"
                name="voucherCode"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                disabled={!hasVoucher}
                required={hasVoucher}
                placeholder={hasVoucher ? '' : 'Only if you have a voucher'}
              />
            </label>
          </div>

          <div>
            <span className="q" id="q-p">Mode of payment</span>
            <div className="opts" role="radiogroup" aria-labelledby="q-p">
              {PAYMENT.map((p) => (
                <label key={p}>
                  <input type="radio" name="payment" value={p} /> {p}
                </label>
              ))}
            </div>
          </div>

          <div className="full">
            <span className="q" id="q-c">
              Preferred course <span className="hint">(choose one)</span>
            </span>
            <div className="courses" role="radiogroup" aria-labelledby="q-c">
              {COURSES.map((c) => (
                <label key={c.name}>
                  <input type="radio" name="course" value={c.name} />
                  <span>
                    <b>{c.name}</b>
                    <small>{c.track}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="f">
            Training date
            <input type="date" name="trainingDate" />
          </label>

          <div className="full">
            <span className="q">Signature</span>
            <SignaturePad />
          </div>
        </div>

        <p className="agree">
          I confirm that the information above is true and correct, and I agree to follow the rules of the training institute.
        </p>
        <footer>RivanCyber Training Institute Inc. · Est. 2000</footer>
      </main>
    </>
  );
}
