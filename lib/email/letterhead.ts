import { DEFAULT_OG_IMAGE } from "@/lib/seo";

/** HTML letterhead for transactional emails (matches IAPL branded header). */
export function buildEmailLetterheadHtml(): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#ffffff">
      <tr>
        <td style="padding:20px 24px 0;vertical-align:top">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
            <tr>
              <td style="vertical-align:top;width:140px;padding-right:16px">
                <img
                  src="${DEFAULT_OG_IMAGE}"
                  alt="Inuka Afrika Properties Limited"
                  width="130"
                  height="70"
                  style="display:block;max-width:130px;height:auto;border:0"
                />
              </td>
              <td style="vertical-align:top;text-align:right;font-family:Inter,Arial,sans-serif;font-size:11px;line-height:1.5;color:#1f2937">
                <table role="presentation" cellpadding="0" cellspacing="0" align="right" style="border-collapse:collapse">
                  <tr>
                    <td style="padding:0 12px 8px 0;vertical-align:top;text-align:left">
                      <p style="margin:0"><strong>Office:</strong> <a href="tel:+254711082084" style="color:#1f2937;text-decoration:none">+254 711 082084</a></p>
                      <p style="margin:2px 0 0 42px"><a href="tel:+254712399429" style="color:#1f2937;text-decoration:none">+254 712 399429</a></p>
                    </td>
                    <td style="padding:0 12px 8px 0;vertical-align:top;text-align:left">
                      <p style="margin:0"><strong>Email:</strong> <a href="mailto:info@inukaproperties.co.ke" style="color:#0284c7;text-decoration:none">info@inukaproperties.co.ke</a></p>
                      <p style="margin:2px 0 0"><strong>Website:</strong> <a href="https://www.inukaproperties.co.ke" style="color:#0284c7;text-decoration:none">www.inukaproperties.co.ke</a></p>
                    </td>
                    <td style="padding:0 0 8px;vertical-align:top;text-align:left">
                      <p style="margin:0">along links road next to</p>
                      <p style="margin:2px 0 0">Nyali healthcare</p>
                      <p style="margin:2px 0 0">P.O. Box 525-80100 - Msa.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 24px 0">
          <div style="height:4px;background:#0284c7;line-height:4px;font-size:0">&nbsp;</div>
        </td>
      </tr>
    </table>
  `;
}
