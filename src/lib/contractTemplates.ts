// Pre-built Developer Contract Templates (EN / DE)
// Placeholders: {{CLIENT_NAME}}, {{PROJECT_NAME}}, {{START_DATE}}, {{END_DATE}},
// {{TOTAL_AMOUNT}}, {{PAYMENT_SCHEDULE}}, {{DEVELOPER_NAME}}, {{DEVELOPER_ADDRESS}},
// {{CLIENT_ADDRESS}}, {{DATE}}

export interface ContractTemplate {
  id: string;
  title: string;
  language: "EN" | "DE";
  content: string;
}

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: "dev-agreement-en",
    title: "Software Development Agreement (EN)",
    language: "EN",
    content: `# SOFTWARE DEVELOPMENT AGREEMENT

**Date:** {{DATE}}

---

## 1. PARTIES

**Developer:**
{{DEVELOPER_NAME}}
{{DEVELOPER_ADDRESS}}

**Client:**
{{CLIENT_NAME}}
{{CLIENT_ADDRESS}}

---

## 2. SCOPE OF WORK

The Developer agrees to design, develop, and deliver the software project described as:

**Project:** {{PROJECT_NAME}}

The specific deliverables, milestones, and technical requirements shall be as mutually agreed upon by both parties and documented in the project scope document.

---

## 3. TIMELINE

- **Start Date:** {{START_DATE}}
- **Estimated Completion:** {{END_DATE}}

The Developer shall use reasonable efforts to complete the project within the estimated timeline. Delays caused by the Client (e.g., late feedback, scope changes) may extend the timeline accordingly.

---

## 4. COMPENSATION

**Total Amount:** {{TOTAL_AMOUNT}}

**Payment Schedule:**
{{PAYMENT_SCHEDULE}}

All invoices are payable within 14 days of issuance. Late payments shall accrue interest at the rate of 1.5% per month.

---

## 5. INTELLECTUAL PROPERTY

Upon full payment, all intellectual property rights in the deliverables shall transfer to the Client. The Developer retains the right to use anonymized portions of the work for portfolio purposes.

Prior to full payment, all work product remains the property of the Developer.

---

## 6. CONFIDENTIALITY

Both parties agree to keep confidential any proprietary information shared during the engagement. This obligation survives termination of this agreement for a period of 2 years.

---

## 7. WARRANTY

The Developer warrants that the deliverables will substantially conform to the agreed specifications for a period of 30 days after final delivery ("Warranty Period"). During this period, the Developer will fix defects at no additional charge.

---

## 8. LIMITATION OF LIABILITY

In no event shall either party be liable for indirect, incidental, special, or consequential damages. The Developer's total liability under this agreement shall not exceed the total compensation paid.

---

## 9. TERMINATION

Either party may terminate this agreement with 14 days written notice. Upon termination:
- The Client shall pay for all work completed to date.
- The Developer shall deliver all completed work product.

---

## 10. GOVERNING LAW

This agreement shall be governed by and construed in accordance with the laws of the Federal Republic of Germany.

---

## 11. SIGNATURES

By signing below, both parties agree to the terms and conditions outlined in this agreement.

**Developer:** {{DEVELOPER_NAME}}

**Client:** {{CLIENT_NAME}}

**Date:** {{DATE}}
`,
  },
  {
    id: "dev-agreement-de",
    title: "Softwareentwicklungsvertrag (DE)",
    language: "DE",
    content: `# SOFTWAREENTWICKLUNGSVERTRAG

**Datum:** {{DATE}}

---

## 1. VERTRAGSPARTEIEN

**Auftragnehmer (Entwickler):**
{{DEVELOPER_NAME}}
{{DEVELOPER_ADDRESS}}

**Auftraggeber (Kunde):**
{{CLIENT_NAME}}
{{CLIENT_ADDRESS}}

---

## 2. VERTRAGSGEGENSTAND

Der Entwickler verpflichtet sich, das nachfolgend beschriebene Softwareprojekt zu konzipieren, zu entwickeln und zu liefern:

**Projekt:** {{PROJECT_NAME}}

Die konkreten Leistungen, Meilensteine und technischen Anforderungen werden von beiden Parteien gemeinsam vereinbart und in einem Pflichtenheft dokumentiert.

---

## 3. ZEITRAHMEN

- **Projektbeginn:** {{START_DATE}}
- **Voraussichtliche Fertigstellung:** {{END_DATE}}

Der Entwickler wird angemessene Anstrengungen unternehmen, das Projekt innerhalb des geschätzten Zeitrahmens abzuschließen. Verzögerungen, die durch den Auftraggeber verursacht werden (z.B. verspätetes Feedback, Änderungen des Umfangs), können zu einer entsprechenden Verlängerung führen.

---

## 4. VERGÜTUNG

**Gesamtbetrag:** {{TOTAL_AMOUNT}}

**Zahlungsplan:**
{{PAYMENT_SCHEDULE}}

Alle Rechnungen sind innerhalb von 14 Tagen nach Rechnungsstellung fällig. Bei Zahlungsverzug werden Verzugszinsen in Höhe von 1,5% pro Monat berechnet.

---

## 5. GEISTIGES EIGENTUM

Nach vollständiger Bezahlung gehen alle Rechte am geistigen Eigentum der Ergebnisse auf den Auftraggeber über. Der Entwickler behält sich das Recht vor, anonymisierte Teile der Arbeit für Portfoliozwecke zu verwenden.

Vor vollständiger Bezahlung verbleibt das gesamte Arbeitsergebnis im Eigentum des Entwicklers.

---

## 6. VERTRAULICHKEIT

Beide Parteien verpflichten sich, alle im Rahmen der Zusammenarbeit ausgetauschten vertraulichen Informationen geheim zu halten. Diese Verpflichtung besteht auch nach Beendigung dieses Vertrages für einen Zeitraum von 2 Jahren fort.

---

## 7. GEWÄHRLEISTUNG

Der Entwickler gewährleistet, dass die Ergebnisse den vereinbarten Spezifikationen für einen Zeitraum von 30 Tagen nach der endgültigen Lieferung im Wesentlichen entsprechen ("Gewährleistungszeitraum"). Während dieses Zeitraums behebt der Entwickler Mängel ohne zusätzliche Kosten.

---

## 8. HAFTUNGSBESCHRÄNKUNG

Keine der Parteien haftet für indirekte Schäden, Nebenschäden, besondere Schäden oder Folgeschäden. Die Gesamthaftung des Entwicklers unter diesem Vertrag übersteigt nicht die gezahlte Gesamtvergütung.

---

## 9. KÜNDIGUNG

Jede Partei kann diesen Vertrag mit einer Frist von 14 Tagen schriftlich kündigen. Im Falle einer Kündigung:
- Der Auftraggeber bezahlt alle bis dahin erbrachten Leistungen.
- Der Entwickler liefert alle fertiggestellten Arbeitsergebnisse.

---

## 10. ANWENDBARES RECHT

Dieser Vertrag unterliegt dem Recht der Bundesrepublik Deutschland. Gerichtsstand ist der Sitz des Entwicklers.

---

## 11. SCHLUSSBESTIMMUNGEN

Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform. Sollte eine Bestimmung dieses Vertrages unwirksam sein oder werden, so wird die Wirksamkeit der übrigen Bestimmungen davon nicht berührt.

---

## 12. UNTERSCHRIFTEN

Mit ihrer Unterschrift bestätigen beide Parteien, dass sie die in diesem Vertrag festgelegten Bedingungen gelesen haben und diesen zustimmen.

**Auftragnehmer:** {{DEVELOPER_NAME}}

**Auftraggeber:** {{CLIENT_NAME}}

**Datum:** {{DATE}}
`,
  },
];

export function fillTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || `{{${key}}}`);
  }
  return result;
}
