/* ══ PRINT BLANK FORM ══
 * يفتح نافذة طباعة نموذج فارغ يشبه الصورة:
 *   اللون | العدد | المتر / كيلو
 *  مع خانة مخصصة لتعليق عينة القماش بدبوس
 */function printBlankForm(){const rows=15;let rowsHtml="";for(let i=0;i<rows;i++){rowsHtml+=`
      <tr>
        <td class="num-cell">${i+1}</td>
        <td class="swatch-cell"><div class="swatch-box"></div></td>
        <td class="count-cell"></td>
        <td class="meter-cell"></td>
      </tr>`;}const html=`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8"/>
<title>نموذج جرد الرولوات</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;800&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  @page{size:A4 portrait;margin:6mm;}
  html,body{
    font-family:'Cairo',sans-serif;
    background:#fff;
    direction:rtl;
    color:#0d1117;
    width:210mm;
    height:285mm;
    overflow:hidden;
    font-size:10px;
  }
  .wrap{
    width:100%;
    height:285mm;
    display:flex;
    flex-direction:column;
    padding:4mm 5mm 3mm;
  }

  /* ── رأس الصفحة ── */
  .page-header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    border-bottom:2px solid #0d1117;
    padding-bottom:2.5mm;
    margin-bottom:2.5mm;
    flex-shrink:0;
  }
  .brand{font-weight:800;font-size:14px;letter-spacing:-0.3px;}
  .doc-title{font-size:10px;color:#475569;font-weight:600;margin-top:1px;}
  .doc-meta{text-align:left;font-size:9.5px;color:#334155;line-height:1.7;}
  .doc-meta span{font-weight:800;}

  /* ── سطر البيانات ── */
  .meta-row{
    display:flex;
    gap:6mm;
    margin-bottom:2.5mm;
    font-size:9.5px;
    color:#334155;
    flex-shrink:0;
    border:1px solid #e2e8f0;
    background:#f8fafc;
    padding:1.5mm 3mm;
    border-radius:2px;
  }
  .meta-row label{font-weight:800;white-space:nowrap;}
  .meta-row .field{border-bottom:1px solid #94a3b8;min-width:28mm;display:inline-block;height:4mm;}

  /* ── الجدول ── */
  table{
    width:100%;
    border-collapse:collapse;
    flex:1;
  }
  thead th{
    padding:2mm 2.5mm;
    text-align:right;
    font-size:9.5px;
    font-weight:800;
    color:#fff;
    background:#0d1117;
    border:1px solid #0d1117;
    white-space:nowrap;
  }
  th.num-th{width:8mm;text-align:center;}
  th.swatch-th{width:18mm;}
  th.count-th{width:18mm;text-align:center;}
  th.meter-th{text-align:center;}

  tbody tr{height:14.5mm;}
  tbody tr:nth-child(even){background:#f8fafc;}
  td{
    border:1px solid #cbd5e1;
    vertical-align:middle;
    padding:0 2mm;
  }
  td.num-cell{text-align:center;color:#94a3b8;font-size:9px;font-weight:700;}
  td.swatch-cell{width:18mm;}
  .swatch-box{
    width:14mm;height:9mm;
    border:1px dashed #94a3b8;
    border-radius:2px;
    display:inline-block;
    background:#fafafa;
  }
  td.count-cell{width:18mm;text-align:center;}
  td.meter-cell{}

  tfoot td{
    padding:2mm 2.5mm;
    background:#fffbeb;
    font-weight:800;
    font-size:10px;
    border:1px solid #0d1117;
    border-top:2px solid #0d1117;
  }

  /* ── تذييل ── */
  .footer{
    margin-top:2mm;
    padding-top:2mm;
    border-top:1px solid #cbd5e1;
    display:flex;
    justify-content:space-between;
    font-size:8.5px;
    color:#94a3b8;
    flex-shrink:0;
  }
</style>
</head>
<body>
<div class="wrap">

  <div class="page-header">
    <div>
      <div class="brand">📦 نموذج جرد الرولوات</div>
      <div class="doc-title">مخزون الأقمشة — إدخال يدوي</div>
    </div>
    <div class="doc-meta">
      <div>التاريخ: <span>_____ / _____ / _____</span></div>
      <div>الصنف: <span>_______________________</span></div>
    </div>
  </div>

  <div class="meta-row">
    <label>المورد:</label> <span class="field"></span>
    &nbsp;&nbsp;
    <label>النوع:</label> <span class="field"></span>
    &nbsp;&nbsp;
    <label>القياس:</label> <span class="field"></span>
    &nbsp;&nbsp;
    <label>السعر/م:</label> <span class="field"></span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="num-th">#</th>
        <th class="swatch-th">اللون &nbsp;<span style="font-weight:600;font-size:8px;opacity:.75">(عينة القماش)</span></th>
        <th class="count-th">العدد</th>
        <th class="meter-th">المتر / كيلو</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2">الإجمالي</td>
        <td style="text-align:center">_____</td>
        <td style="text-align:center">_____</td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">
    <span>المسؤول: ___________________</span>
    <span>التوقيع: ___________________</span>
    <span>طُبع من نظام المخزون</span>
  </div>

</div>
<script>window.onload=()=>{window.print();}<\/script>
</body>
</html>`;const w=window.open("","_blank","width=800,height=900");if(w){w.document.write(html);w.document.close();}}
