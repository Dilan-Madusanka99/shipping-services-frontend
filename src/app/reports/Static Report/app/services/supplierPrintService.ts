import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupplierPrintService {
  constructor() {}

  printSupplierReport(supplier: any): void {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Supplier Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 {
            color: #1f2937;
            margin-bottom: 5px;
          }
          .report-date {
            color: #6b7280;
            margin-bottom: 20px;
            font-size: 0.9rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .footer {
            margin-top: 30px;
            font-size: 0.8rem;
            color: #6b7280;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          @media print {
            body {
              margin: 0;
              padding: 15px;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
          }
        </style>
      </head>
      <body>
        <h1>Supplier Report</h1>
        <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Category</th>
              <th>Contact No</th>
            </tr>
          </thead>
          <tbody>
            ${supplier
              .map(
                (supplier) => `
              <tr>
                <td>${supplier.supplierNo}</td>
                <td>${supplier.supplierName} </td>
                <td>${supplier.supplierCategory}</td>
                <td>${supplier.supplierContactNo}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Confidential - For internal use only</p>
          <p>Total Supplier: ${supplier.length}</p>
        </div>
      </body>
      </html>
    `;

    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Write content to iframe and print
    iframe.contentWindow?.document.write(printContent);
    iframe.contentWindow?.document.close();

    // Wait for content to load before printing
    iframe.onload = () => {
      iframe.contentWindow?.print();
      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  }
}
