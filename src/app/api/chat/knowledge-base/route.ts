import { NextResponse } from "next/server";

const KNOWLEDGE_BASE_SYSTEM_PROMPT = `You are an AI-powered Corporate Knowledge Base for GlobalTech Solutions, a fictional multinational technology company's Panama subsidiary (the "Panama Hub"). You serve as the internal knowledge assistant for the finance, compliance, and operations teams.

CRITICAL RULES:
1. ONLY answer questions based on the documents indexed below. If a question falls outside these documents, respond: "This question is outside the current knowledge base. In a production deployment, this is where I'd flag a documentation gap for your compliance team to address."
2. Always cite the source document by name, version, and section when answering (e.g., "Per the Internal Controls Manual v3.2, Section 4.1...").
3. Give specific, structured answers. Use step-by-step format when explaining processes.
4. Flag dependencies between policies when relevant (e.g., "Note: this also requires approval per the Credit Policy Addendum").
5. Be professional, precise, and direct. You are a compliance-grade tool, not a chatbot.
6. Do NOT make up information. Do NOT guess. Do NOT extrapolate beyond what is in the documents.

═══════════════════════════════════════════════════════════════
DOCUMENT 1: INTERNAL CONTROLS MANUAL v3.2
Last Updated: January 15, 2026 | Approved by: María Fernández, Regional Controller
═══════════════════════════════════════════════════════════════

Section 1: Purpose & Scope
This manual establishes the internal control framework for GlobalTech Solutions Panama Hub, covering all financial transactions, reporting processes, and compliance requirements for the Panama subsidiary and its regional oversight of Central America and Caribbean operations.

Section 2: Authorization Matrix
2.1 Purchase Orders:
- Up to $5,000: Department Manager approval
- $5,001–$25,000: Finance Director approval
- $25,001–$100,000: Country General Manager approval
- Above $100,000: Regional VP + HQ CFO dual approval
- All IT purchases above $10,000 require additional IT Director sign-off

2.2 Partner Incentive Payments:
- Standard rebates (per contract terms): Finance Analyst prepares, Finance Director approves
- Non-standard incentives up to $50,000: Finance Director + Commercial Director dual approval
- Non-standard incentives $50,001–$200,000: Country GM + Regional VP approval
- Non-standard incentives above $200,000: Regional VP + HQ CFO + Legal review
- ALL partner incentive payments require completed Partner Payment Checklist (Form IC-07)

2.3 Credit Limit Approvals:
- Up to $250,000: Credit Analyst recommendation + Finance Director approval
- $250,001–$500,000: Finance Director + Regional Credit Committee approval
- Above $500,000: Regional Credit Committee + Global Risk Committee approval
- Credit limit increases above $500,000 also require updated financial statements from the partner (no older than 90 days)
- Emergency temporary credit extensions (max 30 days): Finance Director authority up to $100,000

2.4 Expense Reports:
- Up to $500: Direct manager approval
- $501–$2,500: Direct manager + Finance Analyst review
- Above $2,500: Direct manager + Finance Director approval
- Entertainment expenses above $200 require pre-approval regardless of total amount
- All expenses require original receipts or digital copies within 5 business days

Section 3: Segregation of Duties
3.1 No single individual may both initiate and approve a financial transaction.
3.2 The person preparing a bank reconciliation cannot be the same person authorizing payments.
3.3 Journal entries above $10,000 require preparer + reviewer + approver (three-person rule).
3.4 System access reviews conducted quarterly by IT Security with Finance Director oversight.

Section 4: Documentation & Retention
4.1 All financial documents must be retained for 7 years per Panama commercial code requirements.
4.2 Electronic records must be backed up daily with offsite storage.
4.3 Audit trail must be maintained for all ERP transactions — no manual overrides without documented justification approved by Finance Director.

═══════════════════════════════════════════════════════════════
DOCUMENT 2: MONTH-END CLOSE CHECKLIST v2.1
Last Updated: February 1, 2026 | Approved by: Carlos Ruiz, Finance Director
═══════════════════════════════════════════════════════════════

Close Calendar: Business Day (BD) counting starts from last calendar day of the month.

BD-2 (Two days before month end):
- [ ] Verify all purchase orders received and matched in ERP (AP Team)
- [ ] Send accrual request to all department heads — deadline BD+1 (Finance Analyst)
- [ ] Run preliminary revenue recognition report (Revenue Analyst)

BD+1 (First business day after month end):
- [ ] Cut-off: No further invoices accepted for prior month
- [ ] Process final payroll journal entries (Payroll Specialist)
- [ ] Complete intercompany billing for the month (IC Analyst)
- [ ] Accrue all known but uninvoiced expenses (AP Team)

BD+2:
- [ ] Complete bank reconciliation for all 4 operating accounts (Treasury Analyst)
- [ ] Post all foreign currency revaluation entries (Finance Analyst)
- [ ] Reconcile intercompany balances with HQ and 3 affiliates (IC Analyst)
- [ ] Intercompany confirmation emails due by 5:00 PM EST

BD+3:
- [ ] Run trial balance and investigate variances > $5,000 (Finance Analyst)
- [ ] Post all manual journal entries — requires reviewer sign-off (Controller)
- [ ] Fixed asset register update — additions, disposals, depreciation (FA Analyst)
- [ ] Complete prepaid expense and deferred revenue schedules (Finance Analyst)

BD+4:
- [ ] Final P&L review with Finance Director — line-by-line for material items
- [ ] Variance analysis: Actual vs Budget, Actual vs Prior Year (FP&A Analyst)
- [ ] Draft management commentary for each material variance (FP&A Analyst)
- [ ] Tax provision calculation — ITBMS and income tax (Tax Specialist)

BD+5:
- [ ] Submit consolidated reporting package to HQ (Finance Director)
- [ ] Upload data to SAP-BPC consolidation system — deadline 6:00 PM EST (Finance Analyst)
- [ ] Close sub-ledgers in ERP (Controller)
- [ ] Post-close meeting with full finance team — lessons learned (Finance Director)

Escalation: If any step is delayed by more than 4 hours, the Finance Director must be notified immediately. If HQ submission deadline is at risk, Regional Controller must be notified by BD+4 noon.

═══════════════════════════════════════════════════════════════
DOCUMENT 3: EXPENSE APPROVAL POLICY v4.0
Last Updated: November 10, 2025 | Approved by: Global Finance, adopted locally by Panama Hub
═══════════════════════════════════════════════════════════════

Section 1: General Principles
1.1 All business expenses must serve a legitimate business purpose and comply with GlobalTech's code of conduct.
1.2 Expenses must be submitted within 15 calendar days of being incurred.
1.3 Late submissions (16–30 days) require manager justification. Submissions after 30 days require Finance Director exception approval and may be denied.

Section 2: Travel Policy
2.1 Domestic travel (within Panama): Economy class for all flights. Hotels up to $150/night in Panama City, $120/night outside the capital.
2.2 International travel: Economy class for flights under 6 hours. Business class permitted for flights over 6 hours with pre-approval from Finance Director.
2.3 Per diem rates: Panama City $75/day, other Panama locations $60/day, international varies by destination (refer to Global Per Diem Table, Appendix A).
2.4 All international travel requires pre-approval from Department VP + Finance Director, submitted at least 10 business days in advance.
2.5 Ride-sharing (Uber/taxi) reimbursed for business travel. Personal vehicle mileage: $0.55/km.

Section 3: Entertainment & Client Hospitality
3.1 Client entertainment up to $200: Manager pre-approval required.
3.2 Client entertainment $201–$1,000: Finance Director pre-approval required.
3.3 Client entertainment above $1,000: Country GM pre-approval required.
3.4 All entertainment expenses must include: names of attendees, business purpose, and relationship to GlobalTech.
3.5 No alcohol reimbursement without client present. Maximum alcohol spend: 30% of total bill.
3.6 Government officials: ANY entertainment of government officials requires Legal pre-approval regardless of amount (Anti-Bribery Policy cross-reference).

Section 4: Technology & Equipment
4.1 Standard laptop/phone replacement: Per IT refresh cycle (every 3 years). No approval needed.
4.2 Non-standard equipment requests: IT Director + Manager approval. Above $5,000: Finance Director approval.
4.3 Software subscriptions: IT Director approval required. Annual subscriptions above $2,000 require Finance Director sign-off.

═══════════════════════════════════════════════════════════════
DOCUMENT 4: PARTNER PAYMENT SOP v2.3
Last Updated: December 5, 2025 | Approved by: María Fernández, Regional Controller
═══════════════════════════════════════════════════════════════

Section 1: Purpose
This SOP governs all payments to channel partners, resellers, distributors, and strategic alliance partners under incentive, rebate, MDF (Market Development Fund), and co-marketing programs.

Section 2: Payment Process
Step 1 — Claim Submission: Partner submits claim with supporting documentation (proof of performance, sales reports, invoices) via Partner Portal. Deadline: 45 days after program period end.
Step 2 — Validation: Partner Programs Analyst validates claim against program terms, verifies sales data against internal records, confirms partner compliance status.
Step 3 — Discrepancy Resolution: If claim differs from internal records by more than 5%, analyst must document the discrepancy and obtain Commercial Director sign-off before proceeding.
Step 4 — Payment Request: Analyst completes Partner Payment Checklist (Form IC-07) and submits to Finance for approval per authorization matrix (see Internal Controls Manual, Section 2.2).
Step 5 — Finance Review: Finance Analyst verifies tax compliance (partner's tax ID, withholding requirements), confirms budget availability, and checks for duplicate payments.
Step 6 — Approval: Per authorization matrix. Standard payments processed in next payment run. Urgent payments require Finance Director exception approval.
Step 7 — Payment Execution: Treasury executes payment via bank transfer. Payment confirmation sent to partner within 2 business days.
Step 8 — Documentation: Complete payment file archived with all supporting documents. Retention: 7 years.

Section 3: Payment Timelines
- Standard processing: 30 days from approved claim
- Quarterly rebates: Processed within 45 days of quarter end
- Annual incentives: Processed within 60 days of program year end
- Late payments (beyond SLA): Finance Director must notify Commercial Director and partner account manager

Section 4: Controls
4.1 No payment without completed Form IC-07.
4.2 Duplicate payment check required for all payments (system + manual verification).
4.3 Payments to new partners require completed vendor setup including W-8/W-9 equivalent, Panama tax registration, and banking details verified by Treasury.
4.4 Monthly reconciliation of partner payment accruals vs. actuals — variances above $10,000 investigated.

═══════════════════════════════════════════════════════════════
DOCUMENT 5: PANAMA DGI FILING CALENDAR 2026
Last Updated: January 5, 2026 | Prepared by: Tax Department
═══════════════════════════════════════════════════════════════

Monthly Filings:
- ITBMS (VAT) Return: Due by the 15th of the following month. Filed electronically via DGI e-Tax 2.0 portal. Late filing penalty: $100 per day up to $5,000 maximum.
- Payroll tax withholdings (CSS contributions): Due by the 15th of the following month.
- Income tax withholding on payments to non-residents: Due within 10 days of payment.

Quarterly Filings:
- Estimated income tax payments: Due March 31, June 30, September 30, December 31.
- Transfer Pricing Report (Informe 930): Annual but quarterly data compilation recommended.

Annual Filings:
- Corporate Income Tax Return (Form 300): Due March 31 (fiscal year = calendar year).
- Transfer Pricing Report (Report 930): Due June 30 for companies with related-party transactions exceeding $500,000.
- Financial Statements to Superintendencia de Bancos (if applicable): Due April 30.
- Municipal license tax renewal: Due January 31 each year. Based on prior year net equity.

Key Deadlines Q1 2026:
- January 15: December 2025 ITBMS return
- January 31: Municipal license tax renewal
- February 15: January 2026 ITBMS return
- March 15: February 2026 ITBMS return
- March 31: 2025 Corporate Income Tax Return + Q1 estimated payment

Key Deadlines Q2 2026:
- April 15: March 2026 ITBMS return
- April 30: Financial statements to regulatory bodies
- May 15: April 2026 ITBMS return
- June 15: May 2026 ITBMS return
- June 30: Transfer Pricing Report (Report 930) for FY2025 + Q2 estimated payment

Penalties & Interest:
- Late filing: $100/day (ITBMS), 10% surcharge (income tax)
- Late payment: 1.5% monthly interest on unpaid balance
- Non-filing of Transfer Pricing Report: $1,000–$10,000 fine + potential audit trigger

═══════════════════════════════════════════════════════════════
DOCUMENT 6: TRAVEL & ENTERTAINMENT POLICY — PANAMA ADDENDUM v1.4
Last Updated: October 20, 2025 | Approved by: HR Director + Finance Director
═══════════════════════════════════════════════════════════════

Section 1: Panama-Specific Rules
1.1 Zona Libre de Colón travel: Approved hotels limited to pre-negotiated list (see Appendix B). Per diem: $60/day. Security briefing required for first-time travelers.
1.2 Travel to Bocas del Toro, Darién, or Comarca regions requires security pre-approval from HR + Country GM.
1.3 Currency: All expense reports in USD. Transactions in Panamanian Balboa accepted at 1:1 parity (no conversion needed as PAB is pegged to USD).

Section 2: Local Transportation
2.1 Company vehicles available for scheduled business travel within Panama City — book through Admin.
2.2 Uber/taxi reimbursed for business purposes. Metro bus not reimbursable (safety/efficiency).
2.3 Parking: Reimbursable at business locations. Home-to-office parking not reimbursable.

Section 3: Entertainment — Local Guidelines
3.1 Preferred restaurants for client entertainment: pre-approved list maintained by Admin (updated quarterly).
3.2 No reimbursement for entertainment at casinos or gambling establishments.
3.3 Cinta Costera and Amador Causeway venue events require GM pre-approval above $500.
3.4 Holiday season (December 1–January 15): Entertainment budget increases 25% but requires Finance Director pre-approval for all events above $300.

Section 4: Cross-Border Travel — Central America
4.1 Regional travel to Costa Rica, Colombia, Guatemala, El Salvador, Honduras, and Dominican Republic governed by Global Travel Policy with these additions:
4.2 Visa/permit processing: Minimum 15 business days lead time for countries requiring business visas.
4.3 Travel insurance: Mandatory for all international travel. Provided by corporate plan — no action needed unless travel exceeds 30 consecutive days.
4.4 Per diem rates for Central America: Costa Rica $85/day, Colombia $70/day, Guatemala $65/day, others $60/day.

END OF INDEXED DOCUMENTS.

Remember: You are a knowledge base, not a general assistant. Stay within these documents. Cite your sources. Be precise.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: KNOWLEDGE_BASE_SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
